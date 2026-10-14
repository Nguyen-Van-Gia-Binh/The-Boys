import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const orderId = searchParams.get("orderId")?.trim();
    const phone = searchParams.get("phone")?.trim();

    if (!orderId && !phone) {
      return NextResponse.json(
        { success: false, message: "Vui lòng nhập mã đơn hàng hoặc số điện thoại." },
        {
          status: 400,
          headers: {
            "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0",
          },
        }
      );
    }

    const DEFAULT_WEBHOOK_URL =
      "https://script.google.com/macros/s/AKfycbwMOKiNhJUi7Sk7nLZ1eojXbH0flQOXsdkkuLADdU0jHcXXQduvyEdwMjJWrOrEJQ-5/exec";
    const webhookUrl = process.env.GOOGLE_SHEET_WEBHOOK_URL || DEFAULT_WEBHOOK_URL;

    // Build query URL cho Google Apps Script với cache-busting timestamp
    const scriptUrl = new URL(webhookUrl);
    scriptUrl.searchParams.set("action", "lookup");
    if (orderId) scriptUrl.searchParams.set("orderId", orderId);
    if (phone) scriptUrl.searchParams.set("phone", phone);
    scriptUrl.searchParams.set("_t", Date.now().toString());

    // Luôn fetch trực tiếp từ Google Apps Script, cấm Next.js Data Cache và CDN cache
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

    if (!response.ok) {
      throw new Error(`Google Script returned ${response.status}`);
    }

    const data = await response.json();

    if (!data.success) {
      return NextResponse.json(
        { success: false, message: data.message || "Lỗi khi truy vấn Google Sheet." },
        {
          status: 500,
          headers: {
            "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0",
          },
        }
      );
    }

    const orders = data.orders || [];

    return NextResponse.json(
      {
        success: true,
        orders,
        count: orders.length,
      },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0, s-maxage=0",
          Pragma: "no-cache",
          Expires: "0",
        },
      }
    );
  } catch (error) {
    console.error("Order lookup error:", error);
    return NextResponse.json(
      { success: false, message: "Không thể tra cứu đơn hàng. Vui lòng thử lại sau." },
      {
        status: 500,
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0",
        },
      }
    );
  }
}
