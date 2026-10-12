"use client";

import React, { useState } from "react";
import { Search, Package, CheckCircle2, Clock, XCircle, AlertCircle, Loader2, Phone, Hash, Info, MessageCircle } from "lucide-react";

interface OrderResult {
  orderId: string;
  customerName: string;
  phone: string;
  status: string;
  createdAt: string;
  pickupDate: string;
  pickupTime: string;
  pickupLocation: string;
  items?: string;
  total: number;
  paymentMethod: string;
}

export default function OrderLookup() {
  const [searchType, setSearchType] = useState<"orderId" | "phone">("orderId");
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [orders, setOrders] = useState<OrderResult[]>([]);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    setIsLoading(true);
    setError("");
    setOrders([]);
    setSearched(false);

    try {
      const params = new URLSearchParams();
      if (searchType === "orderId") {
        params.set("orderId", inputValue.trim().toUpperCase());
      } else {
        params.set("phone", inputValue.trim());
      }

      params.set("_t", Date.now().toString());
      const res = await fetch(`/api/orders/lookup?${params.toString()}`, {
        cache: "no-store",
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
        },
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.message || "Không thể tra cứu. Vui lòng thử lại.");
        return;
      }

      setOrders(data.orders || []);
      setSearched(true);
    } catch {
      setError("Lỗi kết nối. Vui lòng kiểm tra mạng và thử lại.");
    } finally {
      setIsLoading(false);
    }
  };

  const formatPickupDate = (dateStr: string) => {
    if (!dateStr) return "";
    if (dateStr.includes("Đồ ăn:") || (dateStr.includes("/") && !dateStr.includes("T"))) {
      return dateStr;
    }
    try {
      const d = new Date(dateStr);
      if (!isNaN(d.getTime())) {
        return d.toLocaleDateString("vi-VN", {
          timeZone: "Asia/Ho_Chi_Minh",
          day: "2-digit",
          month: "2-digit",
          year: "numeric"
        });
      }
    } catch {}
    return dateStr;
  };

  const getStatusDisplay = (status: string) => {
    const lowerStatus = status.toLowerCase();

    if (lowerStatus.includes("đã thanh toán") || lowerStatus.includes("hoàn thành")) {
      return {
        icon: <CheckCircle2 className="size-5 text-emerald-600" />,
        bg: "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800",
        text: "text-emerald-700 dark:text-emerald-400",
        label: "Đã thanh toán",
        isPending: false,
      };
    }

    if (lowerStatus.includes("hủy") || lowerStatus.includes("bị từ chối")) {
      return {
        icon: <XCircle className="size-5 text-red-500" />,
        bg: "bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800",
        text: "text-red-700 dark:text-red-400",
        label: "Đã hủy",
        isPending: false,
      };
    }

    return {
      icon: <Clock className="size-5 text-amber-500" />,
      bg: "bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800",
      text: "text-amber-700 dark:text-amber-400",
      label: status || "Chờ xử lý",
      isPending: true,
    };
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Search Form */}
      <form onSubmit={handleSearch} className="space-y-4">
        {/* Toggle: Tìm theo mã đơn / SĐT */}
        <div className="flex rounded-xl bg-[var(--brand-surface-alt)] p-1 border border-[var(--brand-border)]">
          <button
            type="button"
            onClick={() => { setSearchType("orderId"); setInputValue(""); setOrders([]); setSearched(false); }}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition ${
              searchType === "orderId"
                ? "bg-[var(--brand-surface)] text-[var(--brand-heading)] shadow-sm"
                : "text-[var(--brand-muted)] hover:text-[var(--brand-heading)]"
            }`}
          >
            <Hash className="size-4" />
            Mã đơn hàng
          </button>
          <button
            type="button"
            onClick={() => { setSearchType("phone"); setInputValue(""); setOrders([]); setSearched(false); }}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition ${
              searchType === "phone"
                ? "bg-[var(--brand-surface)] text-[var(--brand-heading)] shadow-sm"
                : "text-[var(--brand-muted)] hover:text-[var(--brand-heading)]"
            }`}
          >
            <Phone className="size-4" />
            Số điện thoại
          </button>
        </div>

        {/* Input */}
        <div className="relative">
          <input
            type={searchType === "phone" ? "tel" : "text"}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={
              searchType === "orderId"
                ? "Nhập mã đơn, ví dụ: DH1234"
                : "Nhập số điện thoại đã đặt hàng"
            }
            className="w-full rounded-xl border-2 border-[var(--brand-border)] bg-[var(--brand-surface)] px-4 py-3.5 pr-12 text-sm text-[var(--brand-text)] placeholder-[var(--brand-muted)] focus:border-[#315444] focus:outline-none transition"
          />
          <button
            type="submit"
            disabled={isLoading || !inputValue.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-[#315444] text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#243e33] transition"
          >
            {isLoading ? (
              <Loader2 className="size-5 animate-spin" />
            ) : (
              <Search className="size-5" />
            )}
          </button>
        </div>

        {/* Helper text */}
        <p className="text-xs text-center text-[var(--brand-muted)]">
          {searchType === "orderId"
            ? "Mã đơn có dạng DHxxxx, ví dụ: DH1234"
            : "Nhập số điện thoại đã dùng khi đặt hàng"}
        </p>
      </form>

      {/* Error */}
      {error && (
        <div className="mt-6 flex items-start gap-3 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 p-4">
          <AlertCircle className="size-5 text-red-500 shrink-0 mt-0.5" />
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      {/* No results */}
      {searched && orders.length === 0 && !error && (
        <div className="mt-6 flex flex-col items-center text-center py-8">
          <div className="flex size-14 items-center justify-center rounded-full bg-[var(--brand-surface-alt)] text-[var(--brand-muted)] mb-3">
            <Package className="size-7" />
          </div>
          <h3 className="text-base font-bold text-[var(--brand-heading)]">Không tìm thấy đơn hàng</h3>
          <p className="mt-1 text-sm text-[var(--brand-muted)]">
            Không có đơn hàng nào khớp với <strong>{searchType === "orderId" ? "mã" : "số điện thoại"}</strong> bạn nhập.
          </p>
          <p className="mt-2 text-xs text-[var(--brand-muted)]">
            Hãy kiểm tra lại thông tin hoặc nhắn Zalo để được hỗ trợ.
          </p>
          <a
            href="https://zalo.me/0916532006"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0068FF] text-white text-sm font-semibold hover:bg-[#0057e0] active:scale-95 transition shadow-md shadow-blue-500/20"
          >
            <MessageCircle className="size-4" />
            Zalo hỗ trợ: 0916 532 006
          </a>
        </div>
      )}

      {/* Results */}
      {orders.length > 0 && (
        <div className="mt-6 space-y-4">
          <p className="text-sm font-semibold text-[var(--brand-heading)]">
            Tìm thấy {orders.length} đơn hàng
          </p>

          {orders.map((order, idx) => {
            const statusDisplay = getStatusDisplay(order.status);

            return (
              <div
                key={idx}
                className={`rounded-2xl border-2 p-4 space-y-3 ${statusDisplay.bg}`}
              >
                {/* Header: Mã đơn + Status */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Package className="size-5 text-[var(--brand-muted)]" />
                    <span className="font-bold text-[var(--brand-heading)]">{order.orderId}</span>
                  </div>
                  <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${statusDisplay.text}`}>
                    {statusDisplay.icon}
                    <span>{statusDisplay.label}</span>
                  </div>
                </div>

                {/* Customer */}
                <div className="text-sm">
                  <span className="text-[var(--brand-muted)]">Khách hàng: </span>
                  <span className="font-semibold text-[var(--brand-heading)]">{order.customerName}</span>
                </div>

                {/* Pickup Info */}
                <div className="rounded-xl bg-[var(--brand-surface)]/50 p-3 space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-[var(--brand-muted)]">Ngày nhận:</span>
                    <span className="font-semibold text-[var(--brand-heading)]">{formatPickupDate(order.pickupDate)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--brand-muted)]">Khung giờ:</span>
                    <span className="font-semibold text-[var(--brand-heading)]">{order.pickupTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--brand-muted)]">Địa điểm:</span>
                    <span className="font-semibold text-[var(--brand-heading)] text-right max-w-[65%]">{order.pickupLocation}</span>
                  </div>
                </div>

                {/* Items if available */}
                {order.items && (
                  <div className="text-xs text-[var(--brand-muted)] bg-[var(--brand-surface)]/40 rounded-xl p-2.5">
                    <span className="font-semibold text-[var(--brand-heading)]">Món đã đặt: </span>
                    <span>{order.items}</span>
                  </div>
                )}

                {/* Payment */}
                <div className="flex items-center justify-between pt-2 border-t border-[var(--brand-border)]/50">
                  <div className="text-xs text-[var(--brand-muted)]">
                    {order.paymentMethod}
                  </div>
                  <div className="text-base font-black text-[#df8143]">
                    {Number(order.total).toLocaleString("vi-VN")}đ
                  </div>
                </div>

                {/* Pending notification */}
                {statusDisplay.isPending && (
                  <div className="flex items-start gap-2.5 rounded-xl bg-amber-500/10 border border-amber-500/25 p-3 text-xs text-amber-900 dark:text-amber-200">
                    <Info className="size-4 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
                    <div className="space-y-0.5 leading-relaxed">
                      <p className="font-semibold text-amber-950 dark:text-amber-100">
                        Thông báo thanh toán
                      </p>
                      <p className="opacity-90">
                        Nếu bạn đã chuyển khoản, vui lòng chờ khoảng <strong>15–20 phút</strong> để nhóm đối soát tài khoản và cập nhật trạng thái đơn hàng nhé!
                      </p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Support footer */}
      <div className="mt-8 flex items-center justify-center gap-2 text-xs text-[var(--brand-muted)]">
        <MessageCircle className="size-3.5 text-[#0068FF]" />
        <span>Cần hỗ trợ? Nhắn Zalo:</span>
        <a
          href="https://zalo.me/0916532006"
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-[#0068FF] hover:underline"
        >
          0916 532 006
        </a>
      </div>
    </div>
  );
}
