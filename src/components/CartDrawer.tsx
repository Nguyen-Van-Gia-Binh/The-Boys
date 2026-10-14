"use client";

import React, { useState, useEffect } from "react";
import { X, Minus, Plus, ShoppingBag, ArrowRight, CheckCircle2, QrCode, AlertCircle, Sparkles, Gift, Copy, Check, Calendar, MapPin, Clock, Tag, Ticket, Loader2 } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { CAMPAIGN_INFO } from "@/data/campaign";
import { OrderFormData, OrderPayload } from "@/types";

export default function CartDrawer() {
  const {
    items,
    updateQuantity,
    removeFromCart,
    clearCart,
    isCartOpen,
    setIsCartOpen,
    activeTab,
    setActiveTab,
    subtotal,
    discountAmount,
    total,
    hasCombo,
    totalGiftBanhTrang,
    giftSummary,
    voucherBenefit,
    appliedVoucher,
    applyVoucher,
    removeVoucher,
    isApplyingVoucher,
    pastOrders,
    addPastOrder,
    customerPhone,
    setCustomerPhone,
    setIsOrdersDrawerOpen,
  } = useCart();

  // Phân loại nhóm món trong giỏ:
  const hasSnackOrDrink = items.some(
    (it) => it.product.category === "snack" || it.product.category === "drink"
  );
  const hasFlowerOrCombo = items.some(
    (it) => it.product.category === "flower" || it.product.category === "combo" || it.product.isCombo
  );
  const isMixedOrder = hasSnackOrDrink && hasFlowerOrCombo;
  const isSnackOnly = hasSnackOrDrink && !hasFlowerOrCombo;
  const isFlowerOnly = !hasSnackOrDrink && hasFlowerOrCombo;

  const [formData, setFormData] = useState<OrderFormData>({
    name: "",
    email: "",
    phone: "",
    address: "",
    note: "",
    pickupDate: "2026-10-13",
    pickupLocation: CAMPAIGN_INFO.pickupLocations[1] || CAMPAIGN_INFO.pickupLocations[0],
    pickupTime: CAMPAIGN_INFO.pickupTimeSlots[0],
    customPickupTime: "",
    flowerPickupDate: "2026-10-17",
    flowerPickupLocation: "Sảnh lầu 2 — Nơi tổ chức Workshop (Ngày 17/10)",
    flowerPickupTime: CAMPAIGN_INFO.pickupTimeSlots[0],
    flowerCustomPickupTime: "",
    isMixedOrder: false,
    paymentMethod: "bank_transfer",
  });

  // Tự động điền SĐT nếu khách đã đăng nhập trước đó
  useEffect(() => {
    if (customerPhone && !formData.phone) {
      setFormData((prev) => ({ ...prev, phone: customerPhone }));
    }
  }, [customerPhone]);

  // Tự động đồng bộ và tinh chỉnh thông tin nhận hàng theo từng nhóm đơn:
  useEffect(() => {
    setFormData((prev) => {
      if (isFlowerOnly) {
        // Chỉ có hoa/combo: chuyển ngày thành 17/10 và địa điểm là Sảnh lầu 2
        return {
          ...prev,
          pickupDate: "2026-10-17",
          pickupLocation: "Sảnh lầu 2 — Nơi tổ chức Workshop (Ngày 17/10)",
          isMixedOrder: false,
        };
      } else if (isMixedOrder) {
        // Đơn hỗn hợp: món ăn nhận theo địa điểm thông thường, hoa/combo nhận 17/10 tại Sảnh lầu 2
        return {
          ...prev,
          pickupLocation: prev.pickupLocation.includes("Sảnh lầu 2")
            ? (CAMPAIGN_INFO.pickupLocations[1] || "Khuôn viên Đại học FPT TP.HCM (Sảnh chính)")
            : prev.pickupLocation,
          flowerPickupDate: "2026-10-17",
          flowerPickupLocation: "Sảnh lầu 2 — Nơi tổ chức Workshop (Ngày 17/10)",
          flowerPickupTime: prev.flowerPickupTime || CAMPAIGN_INFO.pickupTimeSlots[0],
          isMixedOrder: true,
        };
      } else {
        // Chỉ có đồ ăn/uống lẻ: không ràng buộc 17/10
        return {
          ...prev,
          pickupLocation: prev.pickupLocation.includes("Sảnh lầu 2")
            ? (CAMPAIGN_INFO.pickupLocations[1] || "Khuôn viên Đại học FPT TP.HCM (Sảnh chính)")
            : prev.pickupLocation,
          isMixedOrder: false,
        };
      }
    });
  }, [isFlowerOnly, isMixedOrder, isSnackOnly]);

  const [orderCode, setOrderCode] = useState(() => `DH${Math.floor(1000 + Math.random() * 9000)}`);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyToClipboard = (text: string, key: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2000);
    }
  };

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successOrder, setSuccessOrder] = useState<OrderPayload | null>(null);
  const [voucherInput, setVoucherInput] = useState("");
  const [voucherError, setVoucherError] = useState("");
  const [voucherSuccess, setVoucherSuccess] = useState("");

  const handleApplyVoucher = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!voucherInput.trim()) return;
    setVoucherError("");
    setVoucherSuccess("");
    const res = await applyVoucher(voucherInput.trim());
    if (res.success) {
      setVoucherSuccess(res.message);
      setVoucherInput("");
    } else {
      setVoucherError(res.message);
    }
  };

  if (!isCartOpen) return null;

  const todayStr = new Date().toISOString().split("T")[0];

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    // Nếu đơn chỉ gồm hoa/combo, không cho chọn ngày trước 17/10
    if (name === "pickupDate" && isFlowerOnly && value < "2026-10-17") {
      setFormData((prev) => ({ ...prev, pickupDate: "2026-10-17" }));
      return;
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (items.length === 0) {
      setErrorMessage("Giỏ hàng của bạn đang trống.");
      return;
    }

    if (!formData.name.trim() || !formData.phone.trim()) {
      setErrorMessage("Vui lòng điền họ tên và số điện thoại.");
      return;
    }

    if (isFlowerOnly && formData.pickupDate < "2026-10-17") {
      setErrorMessage("Đơn hàng chỉ gồm Hoa hoặc Combo Workshop sẽ bắt đầu nhận từ ngày 17/10/2026.");
      return;
    }

    setIsSubmitting(true);

    const payload: OrderPayload = {
      ...formData,
      isMixedOrder,
      id: orderCode,
      items: items.map((it) => ({
        productId: it.product.id,
        productName: it.product.name,
        quantity: it.quantity,
        sizeName: it.selectedSize?.name,
        unitPrice: it.unitPrice,
        subtotal: it.unitPrice * it.quantity,
      })),
      giftSummary: giftSummary || undefined,
      subtotal,
      discountAmount: discountAmount || 0,
      voucherCode: appliedVoucher?.code,
      voucherDescription: appliedVoucher?.description,
      total,
      createdAt: new Date().toISOString(),
    };

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        const confirmedOrder: OrderPayload = {
          ...payload,
          id: data.orderId || orderCode,
        };
        addPastOrder(confirmedOrder);
        setSuccessOrder(confirmedOrder);
        if (payload.phone) {
          setCustomerPhone(payload.phone);
        }
        clearCart();
        setOrderCode(`DH${Math.floor(1000 + Math.random() * 9000)}`);
      } else {
        setErrorMessage(data.message || "Không thể gửi đơn. Vui lòng thử lại.");
      }
    } catch {
      setErrorMessage("Lỗi kết nối mạng. Vui lòng thử lại.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Nội dung chuyển khoản chuẩn hóa
  const transferMemo = `THEBOYS ${orderCode}`;

  // Tạo URL ảnh VietQR tự động
  const vietQrUrl = `https://img.vietqr.io/image/${CAMPAIGN_INFO.banking.bankId}-${CAMPAIGN_INFO.banking.accountNo}-compact2.png?amount=${total}&addInfo=${encodeURIComponent(
    transferMemo
  )}&accountName=${encodeURIComponent(CAMPAIGN_INFO.banking.accountName)}`;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-sm transition-opacity">
      {/* Background click to close */}
      <div className="fixed inset-0" onClick={() => setIsCartOpen(false)} />

      {/* Slide-over Drawer Panel */}
      <div className="relative flex h-full w-full max-w-md flex-col bg-[var(--brand-surface)] shadow-2xl overflow-y-auto">
        {/* Drawer Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[var(--brand-border)] bg-[var(--brand-surface)]/95 px-5 py-4 backdrop-blur-md">
          <div className="flex items-center gap-2.5">
            <span className="flex size-9 items-center justify-center rounded-xl bg-[#315444]/15 text-[#315444] dark:text-[#a8bf9e]">
              <ShoppingBag className="size-5" />
            </span>
            <div>
              <h2 className="text-lg font-bold text-[var(--brand-heading)]">Giỏ hàng & Thanh toán</h2>
              <p className="text-[11px] text-[var(--brand-muted)]">{items.reduce((s, it) => s + it.quantity, 0)} món được chọn</p>
            </div>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            className="flex size-9 items-center justify-center rounded-full text-[var(--brand-muted)] hover:bg-[var(--brand-surface-alt)] hover:text-[var(--brand-heading)] transition"
            aria-label="Đóng giỏ hàng"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Content Section */}
        <div className="flex-1 p-5 sm:p-6">
          {/* Nếu đặt hàng thành công */}
          {successOrder ? (
            <div className="flex flex-col items-center justify-center text-center py-10">
              <div className="flex size-16 items-center justify-center rounded-full bg-[#315444]/15 text-[#315444] mb-4">
                <CheckCircle2 className="size-10 text-[#315444]" />
              </div>
              <h3 className="text-2xl font-bold text-[var(--brand-heading)]">Đặt hàng thành công!</h3>
              <p className="mt-2 text-sm text-[var(--brand-muted)]">
                Mã đơn hàng: <strong className="text-[#df8143] text-base">{successOrder.id}</strong>
              </p>
              <div className="mt-6 rounded-2xl border border-[var(--brand-border)] bg-[var(--brand-surface-alt)] p-4 text-left text-xs space-y-1.5 w-full">
                <p><strong>Người nhận:</strong> {successOrder.name} ({successOrder.phone})</p>
                {successOrder.isMixedOrder ? (
                  <div className="space-y-2 pt-1 pb-1">
                    <div className="rounded-xl border border-emerald-500/30 bg-emerald-50/50 dark:bg-emerald-950/30 p-2.5 text-xs text-emerald-900 dark:text-emerald-200">
                      <p className="font-bold flex items-center gap-1.5 text-emerald-800 dark:text-emerald-300">
                        <span>🍱</span>
                        <span>Lịch nhận Đồ ăn / Thức uống:</span>
                      </p>
                      <p className="mt-0.5 text-[11px]">Ngày: <strong>{successOrder.pickupDate}</strong> ({successOrder.pickupTime})</p>
                      <p className="text-[11px]">Tại: <strong>{successOrder.pickupLocation}</strong></p>
                    </div>
                    <div className="rounded-xl border border-[#df8143]/40 bg-[#df8143]/10 p-2.5 text-xs text-[#b93815] dark:text-[#f39c5b]">
                      <p className="font-bold flex items-center gap-1.5">
                        <span>🌸</span>
                        <span>Lịch nhận Hoa tươi & Combo Workshop:</span>
                      </p>
                      <p className="mt-0.5 text-[11px]">Ngày: <strong>{successOrder.flowerPickupDate || "17/10/2026"}</strong> ({successOrder.flowerPickupTime || "Từ 08:00 sáng"})</p>
                      <p className="text-[11px]">Tại: <strong>{successOrder.flowerPickupLocation || "Sảnh lầu 2 — Nơi tổ chức Workshop"}</strong></p>
                    </div>
                  </div>
                ) : (
                  <>
                    <p><strong>Địa điểm:</strong> {successOrder.pickupLocation}</p>
                    <p><strong>Thời gian:</strong> {successOrder.pickupDate} ({successOrder.pickupTime})</p>
                    {successOrder.pickupLocation.includes("Sảnh lầu 2") && (
                      <div className="rounded-xl border border-[#df8143]/30 bg-[#df8143]/10 p-2.5 text-xs text-[#b93815] dark:text-[#f39c5b] font-bold flex items-center gap-2">
                        <Sparkles className="size-4 shrink-0 text-[#df8143]" />
                        <span>Hẹn gặp bạn tại <strong>Sảnh lầu 2 (Workshop)</strong> từ 08:00 sáng ngày 17/10 nhé!</span>
                      </div>
                    )}
                  </>
                )}
                {successOrder.giftSummary && (
                  <p className="rounded-xl bg-[#df8143]/15 p-2.5 font-bold text-[#b93815] dark:text-[#f39c5b] flex items-center gap-1.5">
                    <Gift className="size-4 shrink-0 text-[#df8143]" />
                    <span>Quà tặng kèm 17/10: {successOrder.giftSummary}</span>
                  </p>
                )}
                <p><strong>Hình thức:</strong> Chuyển khoản VietQR</p>
              </div>

              {/* Hướng dẫn chuyển khoản VietQR */}
              <div className="mt-4 rounded-2xl border-2 border-emerald-500/40 bg-emerald-50/40 dark:bg-emerald-950/20 p-4 text-center space-y-3 w-full">
                <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-emerald-800 dark:text-emerald-300">
                  <QrCode className="size-4 text-emerald-600" />
                  <span>Quét mã VietQR để thanh toán</span>
                </div>
                <div className="mx-auto size-52 overflow-hidden rounded-xl bg-white p-2 shadow-sm border border-neutral-200">
                  <img
                    src={`https://img.vietqr.io/image/${CAMPAIGN_INFO.banking.bankId}-${CAMPAIGN_INFO.banking.accountNo}-compact2.png?amount=${successOrder.total}&addInfo=${encodeURIComponent(`THEBOYS ${successOrder.id}`)}&accountName=${encodeURIComponent(CAMPAIGN_INFO.banking.accountName)}`}
                    alt="Mã QR chuyển khoản"
                    className="h-full w-full object-contain"
                  />
                </div>
                <div className="text-xs space-y-2 text-left bg-white dark:bg-neutral-900 rounded-xl p-3 border border-[var(--brand-border)]">
                  <div className="flex items-center justify-between">
                    <span className="text-[var(--brand-muted)]">Ngân hàng:</span>
                    <span className="font-semibold text-[var(--brand-heading)]">{CAMPAIGN_INFO.banking.bankName || CAMPAIGN_INFO.banking.bankId}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[var(--brand-muted)]">Số tài khoản:</span>
                    <div className="flex items-center gap-1.5 font-semibold text-[var(--brand-heading)]">
                      <span>{CAMPAIGN_INFO.banking.accountNo}</span>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(CAMPAIGN_INFO.banking.accountNo, "succ-stk")}
                        className="p-1 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800 text-[#315444]"
                        title="Sao chép STK"
                      >
                        {copiedKey === "succ-stk" ? <Check className="size-3.5 text-emerald-600" /> : <Copy className="size-3.5" />}
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[var(--brand-muted)]">Số tiền:</span>
                    <div className="flex items-center gap-1.5 font-bold text-[#df8143]">
                      <span>{successOrder.total.toLocaleString("vi-VN")}đ</span>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(successOrder.total.toString(), "succ-amount")}
                        className="p-1 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800 text-[#315444]"
                        title="Sao chép số tiền"
                      >
                        {copiedKey === "succ-amount" ? <Check className="size-3.5 text-emerald-600" /> : <Copy className="size-3.5" />}
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[var(--brand-muted)]">Nội dung CK:</span>
                    <div className="flex items-center gap-1.5 font-bold text-[#b93815] dark:text-[#f39c5b]">
                      <span>THEBOYS {successOrder.id}</span>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(`THEBOYS ${successOrder.id}`, "succ-memo")}
                        className="p-1 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800 text-[#315444]"
                        title="Sao chép nội dung"
                      >
                        {copiedKey === "succ-memo" ? <Check className="size-3.5 text-emerald-600" /> : <Copy className="size-3.5" />}
                      </button>
                    </div>
                  </div>
                </div>
                <p className="text-[11px] text-emerald-700 dark:text-emerald-400 font-medium">
                  ⚡ Vui lòng chuyển khoản đúng nội dung <strong>THEBOYS {successOrder.id}</strong> để nhóm The Boys đối soát và xác nhận đơn hàng của bạn nhanh nhất nhé!
                </p>
              </div>

              <p className="mt-4 text-xs text-[var(--brand-muted)]">
                Cảm ơn bạn đã đồng hành cùng chiến dịch Dòng Nước Về Nguồn của nhóm The Boys!
              </p>
              <div className="mt-6 flex flex-col gap-2.5 w-full">
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    setIsOrdersDrawerOpen(true);
                  }}
                  className="w-full rounded-xl bg-[#315444] py-3 text-sm font-semibold text-white hover:bg-[#243e33] transition shadow-md"
                >
                  Xem đơn đã đặt (Cập nhật thời gian thực)
                </button>
                <button
                  onClick={() => {
                    setSuccessOrder(null);
                    setIsCartOpen(false);
                  }}
                  className="w-full rounded-xl border border-[var(--brand-border)] py-2.5 text-sm font-semibold text-[var(--brand-text)] hover:bg-[var(--brand-surface-alt)] transition"
                >
                  Tiếp tục xem món khác
                </button>
              </div>
            </div>
          ) : items.length === 0 ? (
            /* Giỏ hàng trống */
            <div className="flex flex-col items-center justify-center text-center py-16">
              <div className="flex size-16 items-center justify-center rounded-full bg-[var(--brand-surface-alt)] text-[var(--brand-muted)] mb-4">
                <ShoppingBag className="size-8" />
              </div>
              <h3 className="text-lg font-bold text-[var(--brand-heading)]">Giỏ hàng của bạn đang trống</h3>
              <p className="mt-2 text-xs text-[var(--brand-muted)] max-w-xs">
                Hãy dạo quanh gian hàng và chọn vài món ăn vặt hoặc combo ý nghĩa nhé!
              </p>
              <button
                onClick={() => setIsCartOpen(false)}
                className="mt-6 rounded-full bg-[#315444] px-6 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-[#243e33] transition"
              >
                Ghé gian hàng ngay
              </button>
            </div>
          ) : (
            /* Danh sách món trong giỏ */
            <div>
              <div className="divide-y divide-[var(--brand-border)]">
                {items.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between py-3.5 gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-[var(--brand-heading)] truncate">
                        {item.product.name}
                      </p>
                      {item.selectedSize && (
                        <p className="text-[11px] font-medium text-[var(--brand-muted)]">
                          Size: {item.selectedSize.name}
                        </p>
                      )}
                      <p className="text-xs font-bold text-[#df8143] mt-0.5">
                        {item.unitPrice.toLocaleString("vi-VN")}đ
                      </p>
                    </div>

                    {/* Quantity Adjuster */}
                    <div className="flex items-center gap-1.5 rounded-full border border-[var(--brand-border)] bg-[var(--brand-surface-alt)] p-1">
                      <button
                        type="button"
                        onClick={() => updateQuantity(idx, -1)}
                        className="flex size-6 items-center justify-center rounded-full bg-[var(--brand-surface)] text-[var(--brand-heading)] hover:bg-[#df8143] hover:text-white transition"
                      >
                        <Minus className="size-3" />
                      </button>
                      <span className="w-5 text-center text-xs font-bold text-[var(--brand-heading)]">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(idx, 1)}
                        className="flex size-6 items-center justify-center rounded-full bg-[var(--brand-surface)] text-[var(--brand-heading)] hover:bg-[#315444] hover:text-white transition"
                      >
                        <Plus className="size-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Quà tặng kèm Pre-order nếu có mua Combo */}
              {totalGiftBanhTrang > 0 && (
                <div className="mt-3.5 overflow-hidden rounded-2xl border border-dashed border-[#df8143] bg-gradient-to-r from-[#df8143]/15 via-[#df8143]/10 to-[#df8143]/5 p-3.5 shadow-sm">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#df8143] to-[#b93815] text-white shadow-md shadow-[#df8143]/20 shrink-0">
                        <Gift className="size-5" />
                      </span>
                      <div>
                        <span className="inline-block rounded-md bg-[#df8143]/25 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wide text-[#b93815] dark:text-[#f39c5b]">
                          Quà tặng Pre-order 17/10
                        </span>
                        <p className="mt-0.5 text-xs font-bold text-[var(--brand-heading)]">
                          +{totalGiftBanhTrang} Bịch Bánh Tráng Ngũ Vị
                        </p>
                        <p className="text-[11px] text-[var(--brand-muted)]">
                          Tặng kèm theo các Combo đặt trước ngày 17/10
                        </p>
                      </div>
                    </div>
                    <div className="shrink-0 text-right">
                      <span className="rounded-full bg-emerald-500/15 px-2.5 py-1 text-xs font-extrabold text-emerald-600 dark:text-emerald-400">
                        0đ (Miễn phí)
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Khu vực Nhập Mã Giảm Giá (Vouchers) */}
              <div className="mt-4 rounded-2xl border border-[var(--brand-border)] bg-[var(--brand-surface-alt)] p-3.5 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[var(--brand-heading)]">
                    <Tag className="size-3.5 text-[#df8143]" />
                    <span>Mã giảm giá (Voucher)</span>
                  </div>
                  {appliedVoucher && (
                    <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/15 px-2 py-0.5 rounded-full">
                      Đang áp dụng
                    </span>
                  )}
                </div>

                {appliedVoucher ? (
                  <div className="flex items-center justify-between rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-2.5">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <Ticket className="size-4 text-emerald-600 shrink-0" />
                        <span className="text-xs font-black tracking-wider text-emerald-700 dark:text-emerald-300 uppercase">
                          {appliedVoucher.code}
                        </span>
                        <span className="rounded bg-emerald-600 px-1.5 py-0.5 text-[10px] font-bold text-white">
                          -{appliedVoucher.discountPercent}%
                        </span>
                      </div>
                      <p className="mt-0.5 text-[11px] text-[var(--brand-muted)] truncate">
                        {appliedVoucher.description}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        removeVoucher();
                        setVoucherSuccess("");
                        setVoucherError("");
                      }}
                      className="ml-2 flex size-6 shrink-0 items-center justify-center rounded-full text-neutral-400 hover:bg-neutral-200 hover:text-neutral-700 dark:hover:bg-neutral-800 transition"
                      title="Gỡ mã giảm giá"
                    >
                      <X className="size-3.5" />
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyVoucher} className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="relative flex-1">
                        <input
                          type="text"
                          value={voucherInput}
                          onChange={(e) => {
                            setVoucherInput(e.target.value.toUpperCase());
                            setVoucherError("");
                          }}
                          placeholder="Nhập mã giảm giá..."
                          className="w-full rounded-xl border border-[var(--brand-border)] bg-[var(--brand-surface)] px-3 py-2 text-xs font-bold uppercase tracking-wider text-[var(--brand-text)] placeholder:font-normal placeholder:normal-case placeholder:tracking-normal placeholder-[var(--brand-muted)] outline-none focus:border-[#315444] transition"
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={isApplyingVoucher || !voucherInput.trim()}
                        className="rounded-xl bg-[#315444] px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-[#243e33] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition shrink-0 flex items-center gap-1.5"
                      >
                        {isApplyingVoucher ? (
                          <>
                            <Loader2 className="size-3 animate-spin" />
                            <span>Kiểm tra...</span>
                          </>
                        ) : (
                          <span>Áp dụng</span>
                        )}
                      </button>
                    </div>

                    {voucherError && (
                      <p className="text-[11px] font-medium text-red-600 dark:text-red-400 flex items-center gap-1">
                        <AlertCircle className="size-3 shrink-0" />
                        <span>{voucherError}</span>
                      </p>
                    )}
                    {voucherSuccess && (
                      <p className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="size-3 shrink-0" />
                        <span>{voucherSuccess}</span>
                      </p>
                    )}
                  </form>
                )}
              </div>

              {/* Tạm tính & Voucher Section */}
              <div className="mt-3 rounded-2xl border border-[var(--brand-border)] bg-[var(--brand-surface-alt)] p-4 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold text-[var(--brand-heading)]">Tạm tính:</span>
                  <span className="text-base font-extrabold text-[#df8143]">
                    {subtotal.toLocaleString("vi-VN")}đ
                  </span>
                </div>

                {/* Dòng quà tặng */}
                {totalGiftBanhTrang > 0 && (
                  <div className="flex items-center justify-between text-xs text-[#b93815] dark:text-[#f39c5b] font-semibold pt-1 border-t border-[var(--brand-border)]">
                    <span className="flex items-center gap-1">
                      <Gift className="size-3.5 text-[#df8143]" />
                      Quà tặng Pre-order Combo:
                    </span>
                    <span>+{totalGiftBanhTrang} bịch Bánh tráng ngũ vị (0đ)</span>
                  </div>
                )}

                {/* Dòng giảm giá voucher */}
                {discountAmount > 0 && (
                  <div className="flex items-center justify-between text-xs text-emerald-600 dark:text-emerald-400 font-bold pt-1 border-t border-[var(--brand-border)]">
                    <span className="flex items-center gap-1">
                      <Ticket className="size-3.5" />
                      Giảm giá voucher ({appliedVoucher?.code}):
                    </span>
                    <span>-{discountAmount.toLocaleString("vi-VN")}đ</span>
                  </div>
                )}

                <div className="flex items-center justify-between text-sm font-bold text-[var(--brand-heading)] pt-1 border-t border-[var(--brand-border)]">
                  <span>Tổng thanh toán:</span>
                  <span className="text-lg font-black text-[#df8143]">
                    {total.toLocaleString("vi-VN")}đ
                  </span>
                </div>
              </div>

              {/* THÔNG BÁO CHO ĐƠN HỖN HỢP: CÓ CẢ ĐỒ ĂN/UỐNG VÀ HOA/COMBO */}
              {isMixedOrder && (
                <div className="mt-4 overflow-hidden rounded-2xl border-2 border-[#df8143] bg-gradient-to-br from-[#df8143]/15 via-[#df8143]/8 to-[#df8143]/3 p-4 shadow-sm">
                  <div className="flex items-start gap-3">
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#df8143] to-[#b93815] text-white shadow-md shadow-[#df8143]/20">
                      <Sparkles className="size-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h4 className="text-xs font-black uppercase tracking-wider text-[#b93815] dark:text-[#f39c5b]">
                          Đơn hỗn hợp: Đồ ăn & Hoa / Combo
                        </h4>
                        <span className="rounded-full bg-[#df8143] px-2 py-0.5 text-[10px] font-extrabold text-white">
                          Tách lịch nhận
                        </span>
                      </div>
                      <p className="mt-1 text-[12px] leading-relaxed text-[var(--brand-text)] font-medium">
                        Đơn hàng của bạn gồm cả <strong>Món ăn/Uống</strong> và <strong>Hoa tươi/Combo</strong>. Nhóm The Boys đã chia sẵn <strong>2 lịch nhận riêng biệt</strong> bên dưới để bạn nhận đồ ăn linh hoạt trong tuần (13-17/10) và nhận hoa tươi tại Workshop ngày 17/10 nhé!
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* THÔNG BÁO CHO ĐƠN CHỈ CÓ HOA / COMBO */}
              {isFlowerOnly && (
                <div className="mt-4 overflow-hidden rounded-2xl border-2 border-[#df8143] bg-gradient-to-br from-[#df8143]/15 via-[#df8143]/8 to-[#df8143]/3 p-4 shadow-sm">
                  <div className="flex items-start gap-3">
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#df8143] to-[#b93815] text-white shadow-md shadow-[#df8143]/20">
                      <Sparkles className="size-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h4 className="text-xs font-black uppercase tracking-wider text-[#b93815] dark:text-[#f39c5b]">
                          Lưu ý nhận Hoa tươi & Combo 17/10
                        </h4>
                        <span className="rounded-full bg-[#df8143] px-2 py-0.5 text-[10px] font-extrabold text-white">
                          17/10/2026
                        </span>
                      </div>
                      <p className="mt-1 text-[12px] leading-relaxed text-[var(--brand-text)] font-medium">
                        Để đảm bảo <strong>hoa tươi mới nhất</strong> cho ngày hội, đơn hàng Hoa & Combo sẽ được trao trực tiếp tại <strong>Sảnh lầu 2</strong> từ <strong>08:00 sáng ngày 17/10/2026</strong>.
                      </p>

                      <div className="mt-2.5 space-y-1.5 rounded-xl border border-[#df8143]/30 bg-[var(--brand-surface)]/95 p-3 text-[11.5px] font-semibold text-[var(--brand-heading)]">
                        <div className="flex items-center gap-2">
                          <Calendar className="size-4 text-[#df8143] shrink-0" />
                          <span>Ngày nhận: <strong className="text-[#b93815] dark:text-[#f39c5b]">17/10/2026</strong> (Ngày hội Workshop)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="size-4 text-[#315444] dark:text-emerald-400 shrink-0" />
                          <span>Địa điểm nhận: <strong className="text-[#315444] dark:text-emerald-400">Sảnh lầu 2 — Nơi tổ chức Workshop</strong></span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="size-4 text-[#df8143] shrink-0" />
                          <span>Thời gian bàn giao: <strong>Từ 08:00 sáng trở đi</strong></span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* FORM THÔNG TIN NHẬN HÀNG */}
              <form onSubmit={handleSubmitOrder} className="mt-6 space-y-3.5">
                <p className="text-sm font-bold text-[#315444] uppercase tracking-wide">
                  Thông tin người nhận
                </p>

                {/* Họ và tên */}
                <label className="block text-xs font-semibold text-[var(--brand-heading)]">
                  Họ và tên <span className="text-red-500">*</span>
                  <input
                    required
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Nhập họ và tên"
                    className="mt-1 w-full rounded-xl border border-[var(--brand-border)] bg-[var(--brand-surface)] px-3.5 py-2.5 text-sm font-normal text-[var(--brand-text)] outline-none focus:border-[#315444] transition"
                  />
                </label>

                {/* Email */}
                <label className="block text-xs font-semibold text-[var(--brand-heading)]">
                  Email <span className="text-red-500">*</span>
                  <input
                    required
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Nhập email"
                    className="mt-1 w-full rounded-xl border border-[var(--brand-border)] bg-[var(--brand-surface)] px-3.5 py-2.5 text-sm font-normal text-[var(--brand-text)] outline-none focus:border-[#315444] transition"
                  />
                </label>

                {/* Số điện thoại */}
                <label className="block text-xs font-semibold text-[var(--brand-heading)]">
                  Số điện thoại <span className="text-red-500">*</span>
                  <input
                    required
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Nhập số điện thoại"
                    className="mt-1 w-full rounded-xl border border-[var(--brand-border)] bg-[var(--brand-surface)] px-3.5 py-2.5 text-sm font-normal text-[var(--brand-text)] outline-none focus:border-[#315444] transition"
                  />
                </label>

                {/* Địa chỉ chi tiết */}
                <label className="block text-xs font-semibold text-[var(--brand-heading)]">
                  Địa chỉ chi tiết (phòng học / vị trí cụ thể)
                  <textarea
                    name="address"
                    rows={2}
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Nhập phòng học, tòa nhà hoặc số phòng..."
                    className="mt-1 w-full rounded-xl border border-[var(--brand-border)] bg-[var(--brand-surface)] px-3.5 py-2.5 text-sm font-normal text-[var(--brand-text)] outline-none focus:border-[#315444] transition resize-none"
                  />
                </label>

                {/* Ghi chú */}
                <label className="block text-xs font-semibold text-[var(--brand-heading)]">
                  Ghi chú thêm cho đơn hàng (không bắt buộc)
                  <textarea
                    name="note"
                    rows={2}
                    value={formData.note}
                    onChange={handleInputChange}
                    placeholder="Yêu cầu riêng của bạn, ví dụ: ít cay, mang trước 10h..."
                    className="mt-1 w-full rounded-xl border border-[var(--brand-border)] bg-[var(--brand-surface)] px-3.5 py-2.5 text-sm font-normal text-[var(--brand-text)] outline-none focus:border-[#315444] transition resize-none"
                  />
                </label>

                {/* KHU VỰC THỜI GIAN & ĐỊA ĐIỂM GIAO NHẬN */}
                {isMixedOrder ? (
                  /* TRƯỜNG HỢP ĐƠN HỖN HỢP: TÁCH 2 KHỐI RÕ RÀNG */
                  <div className="space-y-4 pt-2">
                    {/* KHỐI 1: LỊCH NHẬN ĐỒ ĂN VẶT & ĐỒ UỐNG */}
                    <div className="rounded-2xl border border-emerald-500/35 bg-emerald-50/40 dark:bg-emerald-950/25 p-3.5 space-y-3 shadow-xs">
                      <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wide">
                        <span className="flex size-5 items-center justify-center rounded-full bg-emerald-600 text-white text-[10px]">1</span>
                        <span>Lịch nhận Đồ ăn vặt / Thức uống (Linh hoạt trong tuần)</span>
                      </div>
                      <p className="text-[11px] text-[var(--brand-muted)]">
                        Bạn có thể chọn nhận bánh tráng, nước uống ngay trong tuần (từ ngày 13/10 đến 17/10):
                      </p>

                      {/* Ngày nhận món ăn */}
                      <label className="block text-xs font-semibold text-[var(--brand-heading)]">
                        Ngày nhận đồ ăn/uống <span className="text-red-500">*</span>
                        <input
                          required
                          type="date"
                          name="pickupDate"
                          min={todayStr}
                          value={formData.pickupDate}
                          onChange={handleInputChange}
                          className="mt-1 w-full rounded-xl border border-[var(--brand-border)] bg-[var(--brand-surface)] px-3.5 py-2.5 text-sm font-normal text-[var(--brand-text)] outline-none focus:border-[#315444] transition"
                        />
                      </label>

                      {/* Địa điểm nhận món ăn */}
                      <label className="block text-xs font-semibold text-[var(--brand-heading)]">
                        Địa điểm nhận đồ ăn/uống <span className="text-red-500">*</span>
                        <select
                          required
                          name="pickupLocation"
                          value={formData.pickupLocation}
                          onChange={handleInputChange}
                          className="mt-1 w-full rounded-xl border border-[var(--brand-border)] bg-[var(--brand-surface)] px-3.5 py-2.5 text-sm font-normal text-[var(--brand-text)] outline-none focus:border-[#315444] transition"
                        >
                          {CAMPAIGN_INFO.pickupLocations.map((loc) => (
                            <option key={loc} value={loc}>
                              {loc}
                            </option>
                          ))}
                        </select>
                      </label>

                      {/* Khung giờ nhận món ăn */}
                      <label className="block text-xs font-semibold text-[var(--brand-heading)]">
                        Khung giờ nhận đồ ăn/uống <span className="text-red-500">*</span>
                        <select
                          required
                          name="pickupTime"
                          value={formData.pickupTime}
                          onChange={handleInputChange}
                          className="mt-1 w-full rounded-xl border border-[var(--brand-border)] bg-[var(--brand-surface)] px-3.5 py-2.5 text-sm font-normal text-[var(--brand-text)] outline-none focus:border-[#315444] transition"
                        >
                          {CAMPAIGN_INFO.pickupTimeSlots.map((slot) => (
                            <option key={slot} value={slot}>
                              {slot === "custom" ? "Khác (thời gian cụ thể bạn muốn nhận)" : slot}
                            </option>
                          ))}
                        </select>
                      </label>
                      {formData.pickupTime === "custom" && (
                        <input
                          required
                          type="text"
                          name="customPickupTime"
                          value={formData.customPickupTime}
                          onChange={handleInputChange}
                          placeholder="Nhập giờ bạn muốn nhận đồ ăn/nước uống..."
                          className="w-full rounded-xl border border-[var(--brand-border)] bg-[var(--brand-surface)] px-3.5 py-2.5 text-sm font-normal text-[var(--brand-text)] outline-none focus:border-[#315444]"
                        />
                      )}
                    </div>

                    {/* KHỐI 2: LỊCH NHẬN HOA TƯƠI & COMBO WORKSHOP */}
                    <div className="rounded-2xl border-2 border-[#df8143]/45 bg-[#df8143]/10 dark:bg-[#df8143]/15 p-3.5 space-y-3 shadow-xs">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-xs font-bold text-[#b93815] dark:text-[#f39c5b] uppercase tracking-wide">
                          <span className="flex size-5 items-center justify-center rounded-full bg-[#df8143] text-white text-[10px]">2</span>
                          <span>Lịch nhận Hoa tươi & Combo Workshop</span>
                        </div>
                        <span className="rounded-full bg-[#df8143] px-2 py-0.5 text-[10px] font-extrabold text-white">
                          17/10/2026
                        </span>
                      </div>

                      <div className="rounded-xl border border-[#df8143]/30 bg-[var(--brand-surface)]/95 p-3 text-xs space-y-1.5 font-semibold text-[var(--brand-heading)]">
                        <div className="flex items-center gap-2">
                          <Calendar className="size-4 text-[#df8143] shrink-0" />
                          <span>Ngày nhận hoa: <strong className="text-[#b93815] dark:text-[#f39c5b]">17/10/2026</strong> (Ngày hội Workshop)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="size-4 text-[#315444] dark:text-emerald-400 shrink-0" />
                          <span>Địa điểm: <strong className="text-[#315444] dark:text-emerald-400">Sảnh lầu 2 — Nơi tổ chức Workshop</strong></span>
                        </div>
                      </div>

                      {/* Khung giờ nhận hoa 17/10 */}
                      <label className="block text-xs font-semibold text-[var(--brand-heading)]">
                        Khung giờ nhận hoa tại Sảnh lầu 2 ngày 17/10 <span className="text-red-500">*</span>
                        <select
                          required
                          name="flowerPickupTime"
                          value={formData.flowerPickupTime || CAMPAIGN_INFO.pickupTimeSlots[0]}
                          onChange={handleInputChange}
                          className="mt-1 w-full rounded-xl border border-[var(--brand-border)] bg-[var(--brand-surface)] px-3.5 py-2.5 text-sm font-normal text-[var(--brand-text)] outline-none focus:border-[#315444] transition"
                        >
                          {CAMPAIGN_INFO.pickupTimeSlots.map((slot) => (
                            <option key={slot} value={slot}>
                              {slot === "custom" ? "Khác (thời gian bạn đến Sảnh lầu 2)" : slot}
                            </option>
                          ))}
                        </select>
                        <p className="mt-1 text-[11px] text-[var(--brand-muted)]">
                          ⏰ Hoa tươi và workshop bắt đầu phục vụ bạn từ <strong>08:00 sáng</strong> trở đi.
                        </p>
                      </label>

                      {formData.flowerPickupTime === "custom" && (
                        <input
                          required
                          type="text"
                          name="flowerCustomPickupTime"
                          value={formData.flowerCustomPickupTime || ""}
                          onChange={handleInputChange}
                          placeholder="Nhập giờ bạn đến Sảnh lầu 2 nhận hoa / tham gia workshop..."
                          className="w-full rounded-xl border border-[var(--brand-border)] bg-[var(--brand-surface)] px-3.5 py-2.5 text-sm font-normal text-[var(--brand-text)] outline-none focus:border-[#315444]"
                        />
                      )}
                    </div>
                  </div>
                ) : (
                  /* TRƯỜNG HỢP ĐƠN ĐỒNG NHẤT (Chỉ Đồ ăn/Nước HOẶC Chỉ Hoa/Combo) */
                  <div className="space-y-3.5 pt-1">
                    {/* Ngày nhận */}
                    <label className="block text-xs font-semibold text-[var(--brand-heading)]">
                      <div className="flex items-center justify-between">
                        <span>Ngày nhận <span className="text-red-500">*</span></span>
                        {isFlowerOnly && (
                          <span className="text-[11px] font-bold text-[#b93815] dark:text-[#f39c5b]">
                            Hoa & Combo nhận 17/10
                          </span>
                        )}
                      </div>
                      <input
                        required
                        type="date"
                        name="pickupDate"
                        min={isFlowerOnly ? "2026-10-17" : todayStr}
                        value={formData.pickupDate}
                        onChange={handleInputChange}
                        className="mt-1 w-full rounded-xl border border-[var(--brand-border)] bg-[var(--brand-surface)] px-3.5 py-2.5 text-sm font-normal text-[var(--brand-text)] outline-none focus:border-[#315444] transition"
                      />
                      {isFlowerOnly ? (
                        <p className="mt-1 text-[11px] font-medium text-amber-700 dark:text-amber-400">
                          🌸 Đơn có Hoa/Combo: Nhận từ ngày <strong>17/10/2026</strong> tại Sảnh lầu 2 để đảm bảo hoa tươi mới nhất cho Workshop.
                        </p>
                      ) : (
                        <p className="mt-1 text-[11px] text-[var(--brand-muted)]">
                          Đồ ăn vặt & thức uống có thể nhận linh hoạt từ ngày 13/10/2026.
                        </p>
                      )}
                    </label>

                    {/* Địa điểm nhận */}
                    <label className="block text-xs font-semibold text-[var(--brand-heading)]">
                      <div className="flex items-center justify-between">
                        <span>Địa điểm nhận <span className="text-red-500">*</span></span>
                        {isFlowerOnly && (
                          <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400">
                            Khuyên chọn Sảnh lầu 2
                          </span>
                        )}
                      </div>
                      <select
                        required
                        name="pickupLocation"
                        value={formData.pickupLocation}
                        onChange={handleInputChange}
                        className="mt-1 w-full rounded-xl border border-[var(--brand-border)] bg-[var(--brand-surface)] px-3.5 py-2.5 text-sm font-normal text-[var(--brand-text)] outline-none focus:border-[#315444] transition"
                      >
                        {CAMPAIGN_INFO.pickupLocations.map((loc) => (
                          <option key={loc} value={loc}>
                            {loc}
                          </option>
                        ))}
                      </select>
                      {isFlowerOnly && (
                        <p className="mt-1 text-[11px] font-medium text-emerald-700 dark:text-emerald-400">
                          📍 Nhận tại <strong>Sảnh lầu 2</strong> (nơi tổ chức Workshop) để tham gia cắm hoa, in ảnh và viết thiệp tri ân trọn vẹn nhất!
                        </p>
                      )}
                    </label>

                    {/* Khung giờ nhận */}
                    <label className="block text-xs font-semibold text-[var(--brand-heading)]">
                      <div className="flex items-center justify-between">
                        <span>Khung giờ nhận <span className="text-red-500">*</span></span>
                        {isFlowerOnly && (
                          <span className="text-[11px] font-bold text-[#315444] dark:text-emerald-400">
                            Từ 08:00 sáng trở đi
                          </span>
                        )}
                      </div>
                      <select
                        required
                        name="pickupTime"
                        value={formData.pickupTime}
                        onChange={handleInputChange}
                        className="mt-1 w-full rounded-xl border border-[var(--brand-border)] bg-[var(--brand-surface)] px-3.5 py-2.5 text-sm font-normal text-[var(--brand-text)] outline-none focus:border-[#315444] transition"
                      >
                        {CAMPAIGN_INFO.pickupTimeSlots.map((slot) => (
                          <option key={slot} value={slot}>
                            {slot === "custom" ? "Khác (thời gian cụ thể bạn muốn nhận)" : slot}
                          </option>
                        ))}
                      </select>
                      {isFlowerOnly && (
                        <p className="mt-1 text-[11px] text-[var(--brand-muted)]">
                          ⏰ Hoa và Combo bắt đầu sẵn sàng bàn giao từ <strong>08:00 sáng</strong> ngày 17/10.
                        </p>
                      )}
                    </label>

                    {/* Custom pickup time if chosen */}
                    {formData.pickupTime === "custom" && (
                      <input
                        required
                        type="text"
                        name="customPickupTime"
                        value={formData.customPickupTime}
                        onChange={handleInputChange}
                        placeholder="Nhập giờ cụ thể bạn muốn nhận hàng..."
                        className="w-full rounded-xl border border-[var(--brand-border)] bg-[var(--brand-surface)] px-3.5 py-2.5 text-sm font-normal text-[var(--brand-text)] outline-none focus:border-[#315444]"
                      />
                    )}
                  </div>
                )}

                {/* Phương thức thanh toán duy nhất: Chuyển khoản VietQR */}
                <div className="pt-2 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-[var(--brand-heading)]">
                      Phương thức thanh toán <span className="text-red-500">*</span>
                    </span>
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-400">
                      Chuyển khoản VietQR
                    </span>
                  </div>
                  <div className="flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-50/50 dark:bg-emerald-950/20 p-2.5 text-xs text-emerald-800 dark:text-emerald-300">
                    <QrCode className="size-4 shrink-0 text-emerald-600" />
                    <span>Nhóm tiếp nhận thanh toán trước qua chuyển khoản ngân hàng (VietQR).</span>
                  </div>
                </div>

                {/* QR Code Chuyển khoản VietQR */}
                <div className="mt-3 rounded-2xl border border-[var(--brand-border)] bg-[var(--brand-surface-alt)] p-4 text-center space-y-3">
                  <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-[#315444]">
                    <QrCode className="size-4 text-[#df8143]" />
                    <span>Mã QR thanh toán VietQR (Tự động nhận diện)</span>
                  </div>
                  <div className="mx-auto size-52 overflow-hidden rounded-xl bg-white p-2 shadow-sm border border-neutral-200">
                    <img
                      src={vietQrUrl}
                      alt="Mã QR chuyển khoản VietQR"
                      className="h-full w-full object-contain"
                    />
                  </div>
                  <p className="text-sm font-bold text-[var(--brand-heading)]">
                    {CAMPAIGN_INFO.banking.accountName}
                  </p>

                  <div className="text-xs space-y-2 text-left bg-[var(--brand-surface)] rounded-xl p-3 border border-[var(--brand-border)]">
                    <div className="flex items-center justify-between">
                      <span className="text-[var(--brand-muted)]">Số tài khoản:</span>
                      <div className="flex items-center gap-1.5 font-semibold text-[var(--brand-heading)]">
                        <span>{CAMPAIGN_INFO.banking.bankId} - {CAMPAIGN_INFO.banking.accountNo}</span>
                        <button
                          type="button"
                          onClick={() => copyToClipboard(CAMPAIGN_INFO.banking.accountNo, "form-stk")}
                          className="p-1 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800 text-[#315444]"
                          title="Sao chép STK"
                        >
                          {copiedKey === "form-stk" ? <Check className="size-3.5 text-emerald-600" /> : <Copy className="size-3.5" />}
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[var(--brand-muted)]">Số tiền:</span>
                      <div className="flex items-center gap-1.5 font-bold text-[#df8143]">
                        <span>{total.toLocaleString("vi-VN")}đ</span>
                        <button
                          type="button"
                          onClick={() => copyToClipboard(total.toString(), "form-amount")}
                          className="p-1 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800 text-[#315444]"
                          title="Sao chép số tiền"
                        >
                          {copiedKey === "form-amount" ? <Check className="size-3.5 text-emerald-600" /> : <Copy className="size-3.5" />}
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[var(--brand-muted)]">Nội dung CK:</span>
                      <div className="flex items-center gap-1.5 font-bold text-[#b93815] dark:text-[#f39c5b]">
                        <span>{transferMemo}</span>
                        <button
                          type="button"
                          onClick={() => copyToClipboard(transferMemo, "form-memo")}
                          className="p-1 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800 text-[#315444]"
                          title="Sao chép nội dung"
                        >
                          {copiedKey === "form-memo" ? <Check className="size-3.5 text-emerald-600" /> : <Copy className="size-3.5" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  <p className="text-[11px] text-[var(--brand-muted)] italic">
                    💡 Vui lòng giữ đúng nội dung <strong>{transferMemo}</strong> khi chuyển khoản để nhóm The Boys nhận diện và xác nhận đơn của bạn nhanh nhất nhé!
                  </p>
                </div>

                {/* Error message if any */}
                {errorMessage && (
                  <div className="flex items-center gap-2 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 p-3 text-xs text-red-600 dark:text-red-400">
                    <AlertCircle className="size-4 shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                {/* Submit Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full rounded-2xl bg-[#315444] py-3.5 text-sm font-bold text-white shadow-lg shadow-[#315444]/25 hover:bg-[#243e33] active:scale-95 transition disabled:opacity-70 disabled:cursor-wait"
                  >
                    {isSubmitting ? "Đang gửi đơn hàng..." : "Xác nhận đặt hàng"}
                  </button>
                </div>

                {/* Link phụ chuyển sang Đơn của tôi */}
                <div className="pt-3 text-center border-t border-[var(--brand-border)]">
                  <button
                    type="button"
                    onClick={() => {
                      setIsCartOpen(false);
                      setIsOrdersDrawerOpen(true);
                    }}
                    className="text-xs text-[var(--brand-muted)] hover:text-[#df8143] font-medium transition"
                  >
                    Bạn muốn kiểm tra đơn đã đặt trước đó? <span className="underline font-bold text-[#315444] dark:text-[#a8bf9e]">Xem Đơn của tôi →</span>
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
