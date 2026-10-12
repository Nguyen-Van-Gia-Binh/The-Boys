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

    const DEFAULT_WEBHOOK_URL = "https://script.google.com/macros/s/AKfycbxow8CaEHHnC_o5KD3kYsM4KWXfWcr9spcp_otCyKZeGTccUFOKGOWi-xEMOhJMjtP2/exec";
    const webhookUrl = process.env.GOOGLE_SHEET_WEBHOOK_URL || DEFAULT_WEBHOOK_URL;

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
