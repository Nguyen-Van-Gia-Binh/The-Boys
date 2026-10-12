import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const orderId = searchParams.get("orderId")?.trim();
    const phone = searchParams.get("phone")?.trim();

    if (!orderId && !phone) {
      return NextResponse.json(
        { success: false, message: "Vui lòng nhập mã đơn hàng hoặc số điện thoại." },
        { status: 400 }
      );
    }

    const webhookUrl = process.env.GOOGLE_SHEET_WEBHOOK_URL;

    if (!webhookUrl || !webhookUrl.startsWith("http")) {
      // Mock data nếu chưa có webhook (development)
      return NextResponse.json({
        success: true,
        orders: [
          {
            orderId: "DH1234",
            customerName: "Nguyễn Văn A",
            phone: "0912345678",
            status: "Chờ chuyển khoản (VietQR)",
            createdAt: "13/10/2024, 10:30:00",
            pickupDate: "17/10/2024",
            pickupTime: "08:00 - 09:00",
            pickupLocation: "Sảnh A - Trường ĐH FPT",
            total: 125000,
            paymentMethod: "Chuyển khoản VietQR"
          }
        ],
        note: "⚠️ Đang chạy ở chế độ mock. Vui lòng cấu hình GOOGLE_SHEET_WEBHOOK_URL để tra cứu thực."
      });
    }

    // Build query URL cho Google Apps Script
    const scriptUrl = new URL(webhookUrl);
    scriptUrl.searchParams.set("action", "lookup");
    if (orderId) scriptUrl.searchParams.set("orderId", orderId);
    if (phone) scriptUrl.searchParams.set("phone", phone);

    const response = await fetch(scriptUrl.toString(), {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      throw new Error(`Google Script returned ${response.status}`);
    }

    const data = await response.json();

    if (!data.success) {
      return NextResponse.json(
        { success: false, message: data.message || "Lỗi khi truy vấn Google Sheet." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      orders: data.orders || [],
      count: data.count || 0
    });

  } catch (error) {
    console.error("Order lookup error:", error);
    return NextResponse.json(
      { success: false, message: "Không thể tra cứu đơn hàng. Vui lòng thử lại sau." },
      { status: 500 }
    );
  }
}
