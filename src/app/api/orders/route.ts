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
    const itemsSummary = itemsList.join("; ");

    const initialStatus =
      body.paymentMethod === "cash"
        ? "Chờ xác nhận (Tiền mặt)"
        : "Chờ chuyển khoản (VietQR)";

    // Gửi sang Google Sheets Webhook nếu có cấu hình
    const webhookUrl = process.env.GOOGLE_SHEET_WEBHOOK_URL;
    let sheetSynced = false;

    if (webhookUrl && webhookUrl.startsWith("http")) {
      try {
        const sheetPayload = {
          orderId,
          createdAt,
          customerName: body.name,
          phone: body.phone,
          email: body.email,
          pickupDate: body.pickupDate,
          pickupTime: body.pickupTime === "custom" ? (body.customPickupTime || "Tự chọn") : body.pickupTime,
          pickupLocation: body.pickupLocation,
          address: body.address || "",
          items: itemsSummary,
          subtotal: body.subtotal,
          discount: body.discountAmount || 0,
          total: body.total,
          paymentMethod: body.paymentMethod === "cash" ? "Tiền mặt khi nhận" : "Chuyển khoản VietQR",
          note: body.note || "",
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
