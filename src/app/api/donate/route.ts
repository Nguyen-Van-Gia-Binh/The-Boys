import { NextRequest, NextResponse } from "next/server";
import { Donor } from "@/data/donations";
import { CAMPAIGN_INFO } from "@/data/campaign";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

const DEFAULT_WEBHOOK_URL =
  "https://script.google.com/macros/s/AKfycbwMOKiNhJUi7Sk7nLZ1eojXbH0flQOXsdkkuLADdU0jHcXXQduvyEdwMjJWrOrEJQ-5/exec";
const OLD_STALE_SCRIPT_ID =
  "AKfycbxow8CaEHHnC_o5KD3kYsM4KWXfWcr9spcp_otCyKZeGTccUFOKGOWi-xEMOhJMjtP2";

function getCandidateUrls(): string[] {
  const envUrl = process.env.GOOGLE_SHEET_WEBHOOK_URL;
  const urls: string[] = [];

  if (envUrl && !envUrl.includes(OLD_STALE_SCRIPT_ID)) {
    urls.push(envUrl);
  }
  urls.push(DEFAULT_WEBHOOK_URL);
  if (envUrl && !urls.includes(envUrl)) {
    urls.push(envUrl);
  }
  return urls;
}

/**
 * GET: Lấy danh sách ủng hộ thực tế 100% từ Google Sheet (Tab Donations)
 */
export async function GET() {
  const candidateUrls = getCandidateUrls();

  for (const webhookUrl of candidateUrls) {
    try {
      const scriptUrl = new URL(webhookUrl);
      scriptUrl.searchParams.set("action", "donations");
      scriptUrl.searchParams.set("_t", Date.now().toString());

      const response = await fetch(scriptUrl.toString(), {
        method: "GET",
        cache: "no-store",
        next: { revalidate: 0 },
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && Array.isArray(data.donations)) {
          const sheetDonors: Donor[] = data.donations.map((d: {
            id: string;
            name: string;
            amount: number;
            message: string;
            createdAt: string;
            isAnonymous?: boolean;
            status?: string;
          }) => ({
            id: d.id,
            name: d.name,
            amount: Number(d.amount) || 0,
            message: d.message || "Gửi gắm yêu thương tri ân các anh hùng thời bình ❤️",
            createdAt: d.createdAt,
            isAnonymous: !!d.isAnonymous,
            badge: d.status?.includes("Đã") ? "Đã ghi nhận" : "Mới ủng hộ",
          }));

          const sorted = sheetDonors.sort((a, b) => b.amount - a.amount);
          const totalRaised = sorted.reduce((sum, d) => sum + (Number(d.amount) || 0), 0);

          if (sorted.length > 0 || webhookUrl === DEFAULT_WEBHOOK_URL) {
            return NextResponse.json({
              success: true,
              donations: sorted,
              totalRaised,
              count: sorted.length,
              isLiveFromSheet: true,
            });
          }
        }
      }
    } catch (err) {
      console.warn("Không thể fetch donations từ Google Sheet candidate URL:", err);
    }
  }

  // Nếu mất kết nối mạng hoặc sheet chưa load được
  return NextResponse.json({
    success: true,
    donations: [],
    totalRaised: 0,
    count: 0,
    isLiveFromSheet: false,
    message: "Chưa kết nối được Google Sheet hoặc chưa có dữ liệu.",
  });
}

/**
 * POST: Lưu lượt ủng hộ mới vào Google Sheet tab Donations
 */
export async function POST(req: NextRequest) {
  try {
    if (CAMPAIGN_INFO.isEnded) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Chiến dịch gây quỹ đã hoàn thành trọn vẹn và đạt mục tiêu! Hệ thống đã dừng tiếp nhận các lượt ủng hộ mới. Cảm ơn tấm lòng vàng của bạn!",
        },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { name, amount, message, isAnonymous, phone, donationId: clientDonationId } = body;

    const numAmount = Number(amount);
    if (!numAmount || numAmount < 1000) {
      return NextResponse.json(
        { success: false, message: "Số tiền ủng hộ không hợp lệ (tối thiểu 1.000đ)." },
        { status: 400 }
      );
    }

    const donorName = isAnonymous ? "Nhà hảo tâm giấu tên" : (name?.trim() || "Nhà hảo tâm giấu tên");
    const createdAt = new Date().toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" });
    
    // Sử dụng đúng mã donationId sinh từ client (khớp với VietQR) hoặc fallback
    const donationId = clientDonationId ? String(clientDonationId).trim().toUpperCase() : `DN${Math.floor(10000 + Math.random() * 90000)}`;

    const webhookUrl = getCandidateUrls()[0] || DEFAULT_WEBHOOK_URL;

    // Gửi đúng định dạng vào tab Donations trên Google Sheet
    if (webhookUrl && webhookUrl.startsWith("http")) {
      try {
        const sheetPayload = {
          type: "donation",
          donationId,
          createdAt,
          donorName,
          amount: numAmount,
          phone: phone || "",
          message: message || "Gửi gắm yêu thương tri ân các anh hùng thời bình ❤️",
          isAnonymous: !!isAnonymous,
          status: "Đã chuyển khoản (VietQR)",
        };

        await fetch(webhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(sheetPayload),
        });
      } catch (webhookErr) {
        console.warn("Lỗi đồng bộ Google Sheet Donation:", webhookErr);
      }
    }

    const newDonor: Donor = {
      id: donationId,
      name: donorName,
      amount: numAmount,
      message: message || "Gửi gắm yêu thương tri ân các anh hùng thời bình ❤️",
      createdAt: new Date().toLocaleDateString("vi-VN"),
      isAnonymous: !!isAnonymous,
      badge: "Mới ủng hộ ✨",
    };

    return NextResponse.json({
      success: true,
      donationId,
      donation: newDonor,
      message: "Cảm ơn bạn đã đồng hành và ủng hộ chiến dịch Dòng Nước Về Nguồn!",
    });
  } catch (error) {
    console.error("Donation API error:", error);
    return NextResponse.json(
      { success: false, message: "Đã xảy ra lỗi máy chủ khi tiếp nhận ủng hộ." },
      { status: 500 }
    );
  }
}
