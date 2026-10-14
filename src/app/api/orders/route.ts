import { NextRequest, NextResponse } from "next/server";
import { OrderPayload } from "@/types";

export async function POST(req: NextRequest) {
  try {
    const body: OrderPayload = await req.json();

    // Basic Validation
    if (!body.name || !body.phone || !body.items || body.items.length === 0) {
      return NextResponse.json(
        { success: false, message: "Vui lòng nhập đầy đủ họ tên, số điện thoại và chọn món." },
        { status: 400 }
      );
    }

    const orderId = body.id || `DH${Math.floor(1000 + Math.random() * 9000)}`;
    const createdAt = new Date().toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" });

    const fullOrder: OrderPayload = {
      ...body,
      id: orderId,
      createdAt,
    };

    // Format item summary for Google Sheets
    const itemsList = body.items.map(
      (it) =>
        `${it.quantity}x ${it.productName}${it.sizeName ? ` (${it.sizeName})` : ""}: ${it.subtotal.toLocaleString("vi-VN")}đ`
    );
    if (body.giftSummary) {
      itemsList.push(`🎁 Quà tặng kèm: ${body.giftSummary}`);
    }
    if (body.voucherCode) {
      itemsList.push(`🎟️ Voucher: ${body.voucherCode} (-${(body.discountAmount || 0).toLocaleString("vi-VN")}đ)`);
    }
    const itemsSummary = itemsList.join("; ");

    const initialStatus = "Chờ chuyển khoản (VietQR)";

    const DEFAULT_WEBHOOK_URL =
      "https://script.google.com/macros/s/AKfycbwMOKiNhJUi7Sk7nLZ1eojXbH0flQOXsdkkuLADdU0jHcXXQduvyEdwMjJWrOrEJQ-5/exec";
    const webhookUrl = process.env.GOOGLE_SHEET_WEBHOOK_URL || DEFAULT_WEBHOOK_URL;
    let sheetSynced = false;

    // Định dạng thông tin nhận hàng (hỗ trợ tách bạch lịch nhận khi là đơn hỗn hợp Đồ ăn + Hoa/Combo)
    let finalPickupDate = body.pickupDate;
    let finalPickupTime = body.pickupTime === "custom" ? (body.customPickupTime || "Tự chọn") : body.pickupTime;
    let finalPickupLocation = body.pickupLocation;
    let finalNote = body.note || "";

    if (body.isMixedOrder && body.flowerPickupDate) {
      const flowerTime =
        body.flowerPickupTime === "custom"
          ? body.flowerCustomPickupTime || "Tự chọn"
          : body.flowerPickupTime || "08:00 - 09:00";
      const flowerLoc = body.flowerPickupLocation || "Sảnh lầu 2 — Nơi tổ chức Workshop (Ngày 17/10)";
      finalPickupDate = `Đồ ăn: ${body.pickupDate} | Hoa: ${body.flowerPickupDate}`;
      finalPickupTime = `Đồ ăn: ${finalPickupTime} | Hoa: ${flowerTime}`;
      finalPickupLocation = `Đồ ăn: ${body.pickupLocation} | Hoa: ${flowerLoc}`;
      finalNote = `[ĐƠN HỖN HỢP: Đồ ăn nhận ${body.pickupDate} tại ${body.pickupLocation} (${finalPickupTime}); Hoa/Combo nhận ${body.flowerPickupDate} tại ${flowerLoc} (${flowerTime})]${body.note ? ` | Note: ${body.note}` : ""}`.trim();
    }

    if (webhookUrl && webhookUrl.startsWith("http")) {
      try {
        const sheetPayload = {
          orderId,
          createdAt,
          customerName: body.name,
          phone: body.phone,
          email: body.email,
          pickupDate: finalPickupDate,
          pickupTime: finalPickupTime,
          pickupLocation: finalPickupLocation,
          address: body.address || "",
          items: itemsSummary,
          subtotal: body.subtotal,
          discount: body.discountAmount || 0,
          total: body.total,
          paymentMethod: "Chuyển khoản VietQR",
          note: finalNote,
          status: initialStatus,
        };

        const res = await fetch(webhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(sheetPayload),
        });

        if (res.ok) {
          sheetSynced = true;
        } else {
          console.warn("Google Sheet Webhook returned non-200:", res.status);
        }
      } catch (err) {
        console.error("Error pushing to Google Sheet Webhook:", err);
      }
    } else {
      console.log("ℹ️ GOOGLE_SHEET_WEBHOOK_URL chưa được cấu hình. Đơn hàng được lưu mô phỏng thành công:", fullOrder);
    }

    return NextResponse.json({
      success: true,
      orderId,
      order: fullOrder,
      sheetSynced,
      message: "Đặt hàng thành công! Nhóm The Boys đã tiếp nhận đơn của bạn.",
    });
  } catch (error) {
    console.error("Order API error:", error);
    return NextResponse.json(
      { success: false, message: "Lỗi hệ thống khi xử lý đơn hàng. Vui lòng thử lại sau." },
      { status: 500 }
    );
  }
}
