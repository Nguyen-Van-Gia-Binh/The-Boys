import { NextRequest, NextResponse } from "next/server";
import { Voucher } from "@/types";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const DEFAULT_WEBHOOK_URL =
  "https://script.google.com/macros/s/AKfycbwMOKiNhJUi7Sk7nLZ1eojXbH0flQOXsdkkuLADdU0jHcXXQduvyEdwMjJWrOrEJQ-5/exec";

// Danh sách voucher rỗng, phụ thuộc 100% vào Google Sheet tab Vouchers
const FALLBACK_VOUCHERS: Voucher[] = [];

async function fetchVouchersFromSheet(): Promise<{ vouchers: Voucher[]; isError: boolean }> {
  const candidateUrls = [
    process.env.GOOGLE_SHEET_WEBHOOK_URL,
    DEFAULT_WEBHOOK_URL,
  ].filter((url): url is string => !!url && url.startsWith("http"));

  // Loại bỏ các URL trùng lặp
  const uniqueUrls = Array.from(new Set(candidateUrls));

  for (const webhookUrl of uniqueUrls) {
    try {
      const url = new URL(webhookUrl);
      url.searchParams.set("action", "vouchers");
      url.searchParams.set("_t", Date.now().toString());

      const res = await fetch(url.toString(), {
        method: "GET",
        cache: "no-store",
        next: { revalidate: 0 },
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.vouchers)) {
          return { vouchers: data.vouchers, isError: false };
        }
      }
    } catch (err) {
      console.warn(`Không thể fetch vouchers từ ${webhookUrl}:`, err);
    }
  }

  return { vouchers: [], isError: true };
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const rawCode = (body.code || "").trim().toUpperCase();
    const subtotal = Number(body.subtotal) || 0;
    const items: Array<{ category?: string; subtotal: number; quantity: number }> =
      Array.isArray(body.items) ? body.items : [];

    if (!rawCode) {
      return NextResponse.json(
        { valid: false, message: "Vui lòng nhập mã giảm giá." },
        { status: 400 }
      );
    }

    if (subtotal <= 0) {
      return NextResponse.json(
        { valid: false, message: "Giỏ hàng đang trống. Vui lòng chọn món trước khi áp mã." },
        { status: 400 }
      );
    }

    const { vouchers, isError } = await fetchVouchersFromSheet();

    // Nếu không kết nối được Google Sheet
    if (isError) {
      return NextResponse.json({
        valid: false,
        message: "Chưa thể kết nối tới Google Sheet để kiểm tra mã. Vui lòng thử lại sau giây lát!",
      });
    }

    const voucher = vouchers.find(
      (v) => (v.code || "").trim().toUpperCase() === rawCode
    );

    if (!voucher) {
      return NextResponse.json({
        valid: false,
        message: `Mã giảm giá "${rawCode}" không tồn tại hoặc đã kết thúc.`,
      });
    }

    // 1. Kiểm tra trạng thái kích hoạt
    if (!voucher.active) {
      return NextResponse.json({
        valid: false,
        message: `Mã giảm giá "${voucher.code}" hiện đang tạm ngưng sử dụng.`,
      });
    }

    // 2. Kiểm tra hạn sử dụng
    if (voucher.expiryDate) {
      // Chuẩn hóa định dạng YYYY-MM-DD hoặc DD/MM/YYYY
      let expiryTime: number | null = null;
      if (voucher.expiryDate.includes("/")) {
        const parts = voucher.expiryDate.split("/");
        if (parts.length === 3) {
          // dd/mm/yyyy -> yyyy, mm-1, dd
          expiryTime = new Date(
            Number(parts[2]),
            Number(parts[1]) - 1,
            Number(parts[0]),
            23,
            59,
            59
          ).getTime();
        }
      } else {
        const d = new Date(voucher.expiryDate);
        d.setHours(23, 59, 59, 999);
        expiryTime = d.getTime();
      }

      if (expiryTime && !isNaN(expiryTime) && Date.now() > expiryTime) {
        return NextResponse.json({
          valid: false,
          message: `Mã giảm giá "${voucher.code}" đã hết hạn vào ngày ${voucher.expiryDate}.`,
        });
      }
    }

    // 3. Kiểm tra đơn hàng tối thiểu (Min Spend)
    if (voucher.minSpend && subtotal < voucher.minSpend) {
      const shortage = voucher.minSpend - subtotal;
      return NextResponse.json({
        valid: false,
        message: `Mã "${voucher.code}" chỉ áp dụng cho đơn từ ${voucher.minSpend.toLocaleString("vi-VN")}đ. Bạn cần mua thêm ${shortage.toLocaleString("vi-VN")}đ để được giảm giá.`,
      });
    }

    // 4. Kiểm tra ngành hàng áp dụng (Applicable Category)
    const category = (voucher.applicableCategory || "all").toLowerCase();
    let eligibleAmount = subtotal;

    if (category !== "all") {
      const matchingItems = items.filter(
        (it) => (it.category || "").toLowerCase() === category
      );

      const matchingSubtotal = matchingItems.reduce(
        (sum, it) => sum + (Number(it.subtotal) || 0),
        0
      );

      if (matchingItems.length === 0 || matchingSubtotal <= 0) {
        const categoryLabels: Record<string, string> = {
          combo: "Combo Workshop 17/10",
          flower: "Hoa tươi",
          snack: "Đồ ăn vặt",
          drink: "Đồ uống",
        };
        const label = categoryLabels[category] || category;

        return NextResponse.json({
          valid: false,
          message: `Mã "${voucher.code}" chỉ áp dụng cho các sản phẩm thuộc nhóm "${label}". Giỏ hàng của bạn chưa có sản phẩm này.`,
        });
      }

      eligibleAmount = matchingSubtotal;
    }

    // 5. Tính toán số tiền giảm
    let discountAmount = Math.round(
      eligibleAmount * (Number(voucher.discountPercent) / 100)
    );

    // Áp trần giảm giá tối đa nếu có
    if (voucher.maxDiscount && voucher.maxDiscount > 0) {
      discountAmount = Math.min(discountAmount, voucher.maxDiscount);
    }

    // Giảm không quá subtotal
    discountAmount = Math.min(discountAmount, subtotal);

    const finalTotal = Math.max(0, subtotal - discountAmount);

    return NextResponse.json({
      success: true,
      valid: true,
      voucherCode: voucher.code,
      discountPercent: voucher.discountPercent,
      maxDiscount: voucher.maxDiscount || 0,
      minSpend: voucher.minSpend || 0,
      applicableCategory: voucher.applicableCategory || "all",
      discountAmount,
      description: voucher.description,
      finalTotal,
      message: `Đã áp dụng mã ${voucher.code}: giảm ${discountAmount.toLocaleString("vi-VN")}đ!`,
    });
  } catch (error) {
    console.error("Lỗi validate voucher:", error);
    return NextResponse.json(
      { valid: false, message: "Đã xảy ra lỗi khi kiểm tra mã giảm giá." },
      { status: 500 }
    );
  }
}
