"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  X,
  Phone,
  RefreshCw,
  Package,
  CheckCircle2,
  Clock,
  XCircle,
  AlertCircle,
  Calendar,
  MapPin,
  ArrowRight,
  LogOut,
  ShoppingBag,
  Sparkles,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { OrderResult } from "@/types";

export default function CustomerOrdersDrawer() {
  const {
    customerPhone,
    setCustomerPhone,
    isOrdersDrawerOpen,
    setIsOrdersDrawerOpen,
  } = useCart();

  const [inputPhone, setInputPhone] = useState("");
  const [orders, setOrders] = useState<OrderResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [error, setError] = useState("");
  const [lastSyncedTime, setLastSyncedTime] = useState<string>("");
  const [syncNotice, setSyncNotice] = useState<string>("");

  // Hàm tải danh sách đơn hàng từ API (gọi trực tiếp Google Sheet realtime)
  const fetchOrders = useCallback(
    async (phone: string, isManualSync = false) => {
      const cleanPhone = phone.trim();
      if (!cleanPhone) return;

      if (isManualSync) {
        setIsSyncing(true);
      } else {
        setIsLoading(true);
      }
      setError("");
      setSyncNotice("");

      try {
        const params = new URLSearchParams();
        params.set("phone", cleanPhone);
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
          setError(data.message || "Không thể tải đơn hàng. Vui lòng thử lại.");
          return;
        }

        const fetchedOrders: OrderResult[] = data.orders || [];
        setOrders(fetchedOrders);

        const now = new Date();
        const timeString = now.toLocaleTimeString("vi-VN", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        });
        setLastSyncedTime(timeString);

        if (isManualSync) {
          setSyncNotice("Đã đồng bộ dữ liệu mới nhất từ Google Sheet!");
          setTimeout(() => setSyncNotice(""), 3500);
        }
      } catch (err) {
        console.error("Fetch orders error:", err);
        setError("Lỗi kết nối mạng. Vui lòng bấm 'Đồng bộ' để thử lại.");
      } finally {
        setIsLoading(false);
        setIsSyncing(false);
      }
    },
    []
  );

  // Khi mở drawer và đã có SĐT lưu sẵn -> Tự động gọi API tải danh sách đơn mới nhất
  useEffect(() => {
    if (isOrdersDrawerOpen && customerPhone) {
      fetchOrders(customerPhone, false);
    }
  }, [isOrdersDrawerOpen, customerPhone, fetchOrders]);

  // Xử lý đăng nhập bằng SĐT
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = inputPhone.trim().replace(/[^\d]/g, "");
    if (clean.length < 9 || clean.length > 11) {
      setError("Vui lòng nhập số điện thoại hợp lệ (9 - 11 chữ số).");
      return;
    }

    setCustomerPhone(clean);
    fetchOrders(clean, false);
  };

  // Đăng xuất / Đổi số điện thoại khác
  const handleLogout = () => {
    setCustomerPhone("");
    setOrders([]);
    setInputPhone("");
    setError("");
    setSyncNotice("");
  };

  // Nút bấm Đồng bộ theo yêu cầu của người dùng
  const handleManualSync = () => {
    if (!customerPhone || isSyncing) return;
    fetchOrders(customerPhone, true);
  };

  const getStatusBadge = (status: string) => {
    const s = (status || "").toLowerCase();
    if (s.includes("đã thanh toán") || s.includes("hoàn thành")) {
      return {
        icon: <CheckCircle2 className="size-4 text-emerald-600 dark:text-emerald-400" />,
        bg: "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-700",
        text: "text-emerald-700 dark:text-emerald-300",
        label: "Đã thanh toán",
      };
    }
    if (s.includes("hủy") || s.includes("từ chối")) {
      return {
        icon: <XCircle className="size-4 text-red-500" />,
        bg: "bg-red-50 dark:bg-red-950/40 border-red-300 dark:border-red-700",
        text: "text-red-700 dark:text-red-300",
        label: "Đã hủy",
      };
    }
    return {
      icon: <Clock className="size-4 text-amber-600 dark:text-amber-400" />,
      bg: "bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-700",
      text: "text-amber-800 dark:text-amber-300",
      label: status || "Chờ xử lý (VietQR)",
    };
  };

  if (!isOrdersDrawerOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm transition-opacity">
      {/* Nền mờ bấm ra ngoài để đóng */}
      <div className="fixed inset-0" onClick={() => setIsOrdersDrawerOpen(false)} />

      {/* Slide-over Drawer Panel */}
      <div className="relative flex h-full w-full max-w-md flex-col bg-[var(--brand-surface)] shadow-2xl overflow-y-auto border-l border-[var(--brand-border)]">
        {/* Drawer Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[var(--brand-border)] bg-[var(--brand-surface)]/95 px-5 py-4 backdrop-blur-md">
          <div className="flex items-center gap-2.5">
            <span className="flex size-9 items-center justify-center rounded-xl bg-[#315444]/15 text-[#315444] dark:text-[#a8bf9e]">
              <Package className="size-5" />
            </span>
            <div>
              <h2 className="text-lg font-bold text-[var(--brand-heading)]">Đơn hàng của tôi</h2>
              <p className="text-[11px] text-[var(--brand-muted)]">Tra cứu trạng thái theo số điện thoại</p>
            </div>
          </div>
          <button
            onClick={() => setIsOrdersDrawerOpen(false)}
            className="flex size-9 items-center justify-center rounded-full text-[var(--brand-muted)] hover:bg-[var(--brand-surface-alt)] hover:text-[var(--brand-heading)] transition"
            aria-label="Đóng"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Nội dung bên trong Drawer */}
        <div className="flex-1 p-5 space-y-4">
          {/* TRƯỜNG HỢP 1: CHƯA ĐĂNG NHẬP SỐ ĐIỆN THOẠI */}
          {!customerPhone ? (
            <div className="py-6 space-y-6">
              <div className="rounded-3xl border border-[var(--brand-border)] bg-[var(--brand-surface-alt)] p-5 text-center space-y-3">
                <span className="inline-flex size-14 items-center justify-center rounded-2xl bg-[#315444]/15 text-[#315444] dark:text-[#a8bf9e]">
                  <Phone className="size-7" />
                </span>
                <h3 className="text-base font-bold text-[var(--brand-heading)]">
                  Đăng nhập nhanh bằng Số điện thoại
                </h3>
                <p className="text-xs text-[var(--brand-muted)] leading-relaxed">
                  Nhập số điện thoại đã dùng khi đặt hàng. Hệ thống sẽ tự động lưu lại và hiển thị toàn bộ lịch sử đơn hàng của bạn.
                </p>
              </div>

              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[var(--brand-heading)] block">
                    Số điện thoại đặt hàng:
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      value={inputPhone}
                      onChange={(e) => setInputPhone(e.target.value)}
                      placeholder="Ví dụ: 0869 089 715"
                      className="w-full rounded-2xl border border-[var(--brand-border)] bg-[var(--brand-surface)] px-4 py-3.5 pl-11 text-sm font-semibold text-[var(--brand-heading)] placeholder:text-[var(--brand-muted)] outline-none focus:border-[#315444] focus:ring-2 focus:ring-[#315444]/20 transition"
                      autoFocus
                    />
                    <Phone className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 size-4 text-[var(--brand-muted)]" />
                  </div>
                </div>

                {error && (
                  <div className="flex items-center gap-2 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 p-3 text-xs text-red-600 dark:text-red-400">
                    <AlertCircle className="size-4 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-2 rounded-2xl bg-[#315444] py-3.5 text-sm font-bold text-white shadow-lg shadow-[#315444]/20 hover:bg-[#243e33] active:scale-95 transition disabled:opacity-70"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="size-4 animate-spin" />
                      <span>Đang kiểm tra...</span>
                    </>
                  ) : (
                    <>
                      <span>Xem đơn hàng của tôi</span>
                      <ArrowRight className="size-4" />
                    </>
                  )}
                </button>
              </form>

              <div className="rounded-2xl border border-dashed border-[var(--brand-border)] p-4 text-[11px] text-[var(--brand-muted)] leading-relaxed space-y-1">
                <p className="font-semibold text-[var(--brand-heading)] flex items-center gap-1.5">
                  <Sparkles className="size-3.5 text-[#df8143]" />
                  Tiện ích 1 chạm:
                </p>
                <p>• Không cần tạo tài khoản hay ghi nhớ mật khẩu.</p>
                <p>• Trình duyệt sẽ tự động ghi nhớ số điện thoại này cho những lần ghé thăm sau.</p>
              </div>
            </div>
          ) : (
            /* TRƯỜNG HỢP 2: ĐÃ CÓ SỐ ĐIỆN THOẠI -> HIỂN THỊ ĐƠN HÀNG & NÚT ĐỒNG BỘ */
            <div className="space-y-4">
              {/* Thanh thông tin tài khoản & Nút Đồng Bộ */}
              <div className="rounded-2xl border border-[var(--brand-border)] bg-[var(--brand-surface-alt)] p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="flex size-8 items-center justify-center rounded-full bg-[#315444]/15 text-[#315444] dark:text-[#a8bf9e]">
                      <Phone className="size-4" />
                    </span>
                    <div>
                      <p className="text-[11px] text-[var(--brand-muted)]">Số điện thoại của bạn:</p>
                      <p className="text-sm font-bold text-[var(--brand-heading)]">{customerPhone}</p>
                    </div>
                  </div>

                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-1 text-xs text-[var(--brand-muted)] hover:text-red-500 transition px-2 py-1 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30"
                    title="Đổi số điện thoại khác"
                  >
                    <LogOut className="size-3.5" />
                    <span>Đổi số</span>
                  </button>
                </div>

                {/* HÀNG NÚT ĐỒNG BỘ MỚI NHẤT (THEO YÊU CẦU) */}
                <div className="pt-2 border-t border-[var(--brand-border)] flex items-center justify-between gap-2">
                  <div className="text-[11px] text-[var(--brand-muted)]">
                    {lastSyncedTime ? (
                      <span>Cập nhật lúc: <strong>{lastSyncedTime}</strong></span>
                    ) : (
                      <span>Dữ liệu trực tiếp Google Sheet</span>
                    )}
                  </div>

                  <button
                    onClick={handleManualSync}
                    disabled={isSyncing}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#315444] text-white hover:bg-[#243e33] text-xs font-semibold shadow-sm transition active:scale-95 disabled:opacity-70 disabled:cursor-wait"
                  >
                    <RefreshCw className={`size-3.5 ${isSyncing ? "animate-spin" : ""}`} />
                    <span>{isSyncing ? "Đang đồng bộ..." : "Đồng bộ mới nhất"}</span>
                  </button>
                </div>

                {/* Thông báo đồng bộ thành công */}
                {syncNotice && (
                  <div className="flex items-center gap-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-700 px-3 py-2 text-xs font-medium text-emerald-800 dark:text-emerald-300 animate-in fade-in duration-200">
                    <CheckCircle2 className="size-3.5 shrink-0 text-emerald-600" />
                    <span>{syncNotice}</span>
                  </div>
                )}
              </div>

              {/* Thông báo lỗi nếu có */}
              {error && (
                <div className="flex items-center gap-2 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 p-3 text-xs text-red-600 dark:text-red-400">
                  <AlertCircle className="size-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Danh sách đơn hàng */}
              {isLoading ? (
                <div className="py-16 text-center space-y-3">
                  <RefreshCw className="size-8 mx-auto animate-spin text-[#315444]" />
                  <p className="text-xs text-[var(--brand-muted)] font-medium">
                    Đang tra cứu đơn hàng từ Google Sheet...
                  </p>
                </div>
              ) : orders.length === 0 ? (
                <div className="py-12 text-center space-y-3">
                  <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-[var(--brand-surface-alt)] text-[var(--brand-muted)]">
                    <ShoppingBag className="size-6" />
                  </div>
                  <h4 className="text-base font-bold text-[var(--brand-heading)]">
                    Chưa tìm thấy đơn hàng nào
                  </h4>
                  <p className="text-xs text-[var(--brand-muted)] max-w-xs mx-auto leading-relaxed">
                    Số điện thoại <strong>{customerPhone}</strong> chưa có đơn hàng nào được ghi nhận trên hệ thống.
                  </p>
                  <div className="pt-2">
                    <button
                      onClick={() => {
                        setIsOrdersDrawerOpen(false);
                        const shopEl = document.getElementById("shop");
                        if (shopEl) shopEl.scrollIntoView({ behavior: "smooth" });
                      }}
                      className="inline-flex items-center gap-1.5 rounded-full bg-[#315444] px-5 py-2 text-xs font-semibold text-white hover:bg-[#243e33] transition"
                    >
                      <span>Ghé gian hàng đặt món</span>
                      <ArrowRight className="size-3.5" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs font-semibold text-[var(--brand-heading)] px-1">
                    <span>Tìm thấy <strong>{orders.length}</strong> đơn hàng:</span>
                    <span className="text-[11px] text-[var(--brand-muted)] font-normal">
                      Kéo xuống để xem hết
                    </span>
                  </div>

                  {orders.map((ord, idx) => {
                    const badge = getStatusBadge(ord.status);
                    return (
                      <div
                        key={idx}
                        className="rounded-2xl border border-[var(--brand-border)] bg-[var(--brand-surface-alt)] p-4 text-xs space-y-3 shadow-sm hover:shadow-md transition"
                      >
                        {/* Header: Mã đơn + Trạng thái */}
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-extrabold text-[#df8143] text-sm tracking-wide">
                            {ord.orderId}
                          </span>
                          <span
                            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold border ${badge.bg} ${badge.text}`}
                          >
                            {badge.icon}
                            <span>{badge.label}</span>
                          </span>
                        </div>

                        {/* Tên khách hàng & Thời gian đặt */}
                        <div className="text-[var(--brand-muted)] space-y-0.5">
                          <p>
                            Khách hàng: <strong className="text-[var(--brand-heading)]">{ord.customerName}</strong>
                          </p>
                          {ord.createdAt && (
                            <p className="text-[11px]">Đặt lúc: {ord.createdAt}</p>
                          )}
                        </div>

                        {/* Danh sách món */}
                        {ord.items && (
                          <div className="rounded-xl bg-[var(--brand-surface)] p-2.5 border border-[var(--brand-border)] text-[var(--brand-heading)] space-y-1">
                            <p className="font-semibold text-[11px] text-[var(--brand-muted)]">
                              Món đã đặt:
                            </p>
                            <p className="leading-relaxed font-medium">{ord.items}</p>
                          </div>
                        )}

                        {/* Tổng thanh toán */}
                        <div className="flex items-center justify-between pt-1 border-t border-[var(--brand-border)]">
                          <span className="font-semibold text-[var(--brand-muted)]">Tổng thanh toán:</span>
                          <span className="text-sm font-extrabold text-[#df8143]">
                            {Number(ord.total || 0).toLocaleString("vi-VN")}đ
                          </span>
                        </div>

                        {/* Lịch nhận hàng */}
                        {(ord.pickupDate || ord.pickupLocation) && (
                          <div className="rounded-xl bg-[#315444]/5 dark:bg-[#315444]/15 p-2.5 text-[11px] space-y-1 text-[var(--brand-heading)]">
                            {ord.pickupDate && (
                              <p className="flex items-center gap-1.5">
                                <Calendar className="size-3.5 text-[#315444] shrink-0" />
                                <span>Ngày: <strong>{ord.pickupDate}</strong> {ord.pickupTime ? `(${ord.pickupTime})` : ""}</span>
                              </p>
                            )}
                            {ord.pickupLocation && (
                              <p className="flex items-center gap-1.5">
                                <MapPin className="size-3.5 text-[#df8143] shrink-0" />
                                <span>Tại: <strong>{ord.pickupLocation}</strong></span>
                              </p>
                            )}
                          </div>
                        )}

                        {/* Lưu ý đối soát nếu đang chờ chuyển khoản */}
                        {ord.status && ord.status.toLowerCase().includes("chờ") && (
                          <p className="text-[10px] text-amber-700 dark:text-amber-400 italic">
                            💡 Nếu bạn vừa chuyển khoản, vui lòng chờ khoảng 15–20 phút để nhóm đối soát tài khoản và ấn <strong>Đồng bộ</strong> lại nhé!
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
