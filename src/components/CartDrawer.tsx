"use client";

import React, { useState } from "react";
import { X, Minus, Plus, ShoppingBag, ArrowRight, CheckCircle2, QrCode, AlertCircle, Sparkles, Gift } from "lucide-react";
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
    pastOrders,
    addPastOrder,
  } = useCart();

  const [formData, setFormData] = useState<OrderFormData>({
    name: "",
    email: "",
    phone: "",
    address: "",
    note: "",
    pickupDate: "2026-10-13",
    pickupLocation: CAMPAIGN_INFO.pickupLocations[0],
    pickupTime: CAMPAIGN_INFO.pickupTimeSlots[0],
    customPickupTime: "",
    paymentMethod: "cash",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successOrder, setSuccessOrder] = useState<OrderPayload | null>(null);

  if (!isCartOpen) return null;

  const todayStr = new Date().toISOString().split("T")[0];

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
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

    setIsSubmitting(true);

    const payload: OrderPayload = {
      ...formData,
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
      discountAmount,
      voucherDescription: voucherBenefit.current?.title,
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
          id: data.orderId,
        };
        addPastOrder(confirmedOrder);
        setSuccessOrder(confirmedOrder);
        clearCart();
      } else {
        setErrorMessage(data.message || "Không thể gửi đơn. Vui lòng thử lại.");
      }
    } catch {
      setErrorMessage("Lỗi kết nối mạng. Vui lòng thử lại.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Tạo URL ảnh VietQR tự động
  const vietQrUrl = `https://img.vietqr.io/image/${CAMPAIGN_INFO.banking.bankId}-${CAMPAIGN_INFO.banking.accountNo}-compact2.png?amount=${total}&addInfo=${encodeURIComponent(
    (formData.name || "Khach") + " " + (formData.phone || "SDT")
  )}&accountName=${encodeURIComponent(CAMPAIGN_INFO.banking.accountName)}`;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-sm transition-opacity">
      {/* Background click to close */}
      <div className="fixed inset-0" onClick={() => setIsCartOpen(false)} />

      {/* Slide-over Drawer Panel */}
      <div className="relative flex h-full w-full max-w-md flex-col bg-[var(--brand-surface)] shadow-2xl overflow-y-auto">
        {/* Drawer Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[var(--brand-border)] bg-[var(--brand-surface)]/95 px-6 py-4 backdrop-blur-md">
          <h2 className="text-2xl font-bold text-[var(--brand-heading)]">Giỏ hàng</h2>
          <button
            onClick={() => setIsCartOpen(false)}
            className="flex size-9 items-center justify-center rounded-full text-[var(--brand-muted)] hover:bg-[var(--brand-surface-alt)] hover:text-[var(--brand-heading)] transition"
            aria-label="Đóng giỏ hàng"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Tab Switcher: Giỏ hàng | Đơn đã đặt */}
        <div className="p-4 bg-[var(--brand-surface-alt)] border-b border-[var(--brand-border)]">
          <div className="grid grid-cols-2 rounded-2xl bg-[var(--brand-border)]/40 p-1 text-sm font-semibold">
            <button
              type="button"
              onClick={() => {
                setActiveTab("cart");
                setSuccessOrder(null);
              }}
              className={`rounded-xl py-2 transition ${
                activeTab === "cart"
                  ? "bg-[var(--brand-surface)] text-[var(--brand-heading)] shadow-sm"
                  : "text-[var(--brand-muted)] hover:text-[var(--brand-heading)]"
              }`}
            >
              Giỏ hàng ({items.reduce((s, it) => s + it.quantity, 0)})
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab("orders");
                setSuccessOrder(null);
              }}
              className={`rounded-xl py-2 transition ${
                activeTab === "orders"
                  ? "bg-[var(--brand-surface)] text-[var(--brand-heading)] shadow-sm"
                  : "text-[var(--brand-muted)] hover:text-[var(--brand-heading)]"
              }`}
            >
              Đơn đã đặt ({pastOrders.length})
            </button>
          </div>
        </div>

        {/* Content Section */}
        <div className="flex-1 p-5 sm:p-6">
          {/* TAB 1: GIỎ HÀNG */}
          {activeTab === "cart" && (
            <>
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
                    <p><strong>Địa điểm:</strong> {successOrder.pickupLocation}</p>
                    <p><strong>Thời gian:</strong> {successOrder.pickupDate} ({successOrder.pickupTime})</p>
                    {successOrder.giftSummary && (
                      <p className="rounded-xl bg-[#df8143]/15 p-2.5 font-bold text-[#b93815] dark:text-[#f39c5b] flex items-center gap-1.5">
                        <Gift className="size-4 shrink-0 text-[#df8143]" />
                        <span>Quà tặng kèm 17/10: {successOrder.giftSummary}</span>
                      </p>
                    )}
                    <p><strong>Tổng thanh toán:</strong> <span className="text-[#df8143] font-bold text-sm">{successOrder.total.toLocaleString("vi-VN")}đ</span></p>
                    <p><strong>Hình thức:</strong> {successOrder.paymentMethod === "cash" ? "Tiền mặt khi nhận" : "Chuyển khoản VietQR"}</p>
                  </div>
                  <p className="mt-4 text-xs text-[var(--brand-muted)]">
                    Cảm ơn bạn đã đồng hành cùng chiến dịch Dòng Nước Về Nguồn của nhóm The Boys!
                  </p>
                  <div className="mt-6 flex flex-col gap-2.5 w-full">
                    <button
                      onClick={() => setActiveTab("orders")}
                      className="w-full rounded-xl bg-[#315444] py-3 text-sm font-semibold text-white hover:bg-[#243e33] transition"
                    >
                      Xem đơn đã đặt
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
                              +{totalGiftBanhTrang} Bịch Bánh Tráng Trộn Đặc Biệt
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

                  {/* Tạm tính & Voucher Section */}
                  <div className="mt-4 rounded-2xl border border-[var(--brand-border)] bg-[var(--brand-surface-alt)] p-4 space-y-2">
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
                        <span>+{totalGiftBanhTrang} bịch Bánh tráng trộn (0đ)</span>
                      </div>
                    )}

                    {/* Dòng giảm giá món lẻ */}
                    {discountAmount > 0 && (
                      <div className="flex items-center justify-between text-xs text-[#315444] font-semibold pt-1 border-t border-[var(--brand-border)]">
                        <span className="flex items-center gap-1">
                          <Sparkles className="size-3.5 text-[#e6b057]" />
                          Ưu đãi món lẻ ({voucherBenefit.current?.title}):
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

                    {/* Voucher / Promo Tips */}
                    {hasCombo ? (
                      <p className="text-[11px] text-[var(--brand-muted)] pt-1">
                        🎁 Đơn có Combo nhận <strong>{totalGiftBanhTrang} bịch bánh tráng trộn</strong> (ưu đãi voucher % không áp dụng đồng thời với combo có quà tặng).
                      </p>
                    ) : voucherBenefit.next ? (
                      <p className="text-[11px] text-[var(--brand-muted)] pt-1">
                        💡 Mua thêm <strong>{voucherBenefit.neededForNext.toLocaleString("vi-VN")}đ</strong> món lẻ để nhận <strong>{voucherBenefit.next.title}</strong>!
                      </p>
                    ) : null}
                  </div>

                  {/* FORM THÔNG TIN NHẬN HÀNG */}
                  <form onSubmit={handleSubmitOrder} className="mt-6 space-y-3.5">
                    <p className="text-sm font-bold text-[#315444] uppercase tracking-wide">
                      Thông tin nhận hàng
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
                      Địa chỉ chi tiết (không bắt buộc)
                      <textarea
                        name="address"
                        rows={2}
                        value={formData.address}
                        onChange={handleInputChange}
                        placeholder="Nhập địa chỉ, phòng học, tòa nhà hoặc số phòng..."
                        className="mt-1 w-full rounded-xl border border-[var(--brand-border)] bg-[var(--brand-surface)] px-3.5 py-2.5 text-sm font-normal text-[var(--brand-text)] outline-none focus:border-[#315444] transition resize-none"
                      />
                    </label>

                    {/* Ghi chú */}
                    <label className="block text-xs font-semibold text-[var(--brand-heading)]">
                      Ghi chú cho đơn hàng (không bắt buộc)
                      <textarea
                        name="note"
                        rows={2}
                        value={formData.note}
                        onChange={handleInputChange}
                        placeholder="Yêu cầu riêng của bạn, ví dụ: ít cay, giao trước 10h..."
                        className="mt-1 w-full rounded-xl border border-[var(--brand-border)] bg-[var(--brand-surface)] px-3.5 py-2.5 text-sm font-normal text-[var(--brand-text)] outline-none focus:border-[#315444] transition resize-none"
                      />
                    </label>

                    {/* Ngày nhận */}
                    <label className="block text-xs font-semibold text-[var(--brand-heading)]">
                      Ngày nhận <span className="text-red-500">*</span>
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

                    {/* Địa điểm nhận */}
                    <label className="block text-xs font-semibold text-[var(--brand-heading)]">
                      Địa điểm nhận <span className="text-red-500">*</span>
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

                    {/* Khung giờ nhận */}
                    <label className="block text-xs font-semibold text-[var(--brand-heading)]">
                      Khung giờ nhận <span className="text-red-500">*</span>
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

                    {/* Phương thức thanh toán */}
                    <fieldset className="pt-2 space-y-2">
                      <legend className="text-xs font-semibold text-[var(--brand-heading)]">
                        Phương thức thanh toán <span className="text-red-500">*</span>
                      </legend>
                      <label className="flex cursor-pointer items-center gap-2.5 text-sm font-medium text-[var(--brand-heading)] p-2.5 rounded-xl border border-[var(--brand-border)] hover:bg-[var(--brand-surface-alt)] transition">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="cash"
                          checked={formData.paymentMethod === "cash"}
                          onChange={() => setFormData((p) => ({ ...p, paymentMethod: "cash" }))}
                          className="size-4 text-[#315444] focus:ring-[#315444]"
                        />
                        <span>Tiền mặt khi nhận hàng</span>
                      </label>

                      <label className="flex cursor-pointer items-center gap-2.5 text-sm font-medium text-[var(--brand-heading)] p-2.5 rounded-xl border border-[var(--brand-border)] hover:bg-[var(--brand-surface-alt)] transition">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="bank_transfer"
                          checked={formData.paymentMethod === "bank_transfer"}
                          onChange={() => setFormData((p) => ({ ...p, paymentMethod: "bank_transfer" }))}
                          className="size-4 text-[#315444] focus:ring-[#315444]"
                        />
                        <span>Chuyển khoản ngân hàng (VietQR)</span>
                      </label>
                    </fieldset>

                    {/* QR Code Chuyển khoản nếu chọn bank_transfer */}
                    {formData.paymentMethod === "bank_transfer" && (
                      <div className="mt-3 rounded-2xl border border-[var(--brand-border)] bg-[var(--brand-surface-alt)] p-4 text-center space-y-2">
                        <p className="text-xs font-bold text-[#315444] flex items-center justify-center gap-1.5">
                          <QrCode className="size-4 text-[#df8143]" />
                          Quét mã để chuyển khoản nhanh VietQR
                        </p>
                        <div className="mx-auto size-56 overflow-hidden rounded-xl bg-white p-2 shadow-sm border border-neutral-200">
                          <img
                            src={vietQrUrl}
                            alt="Mã QR chuyển khoản VietQR"
                            className="h-full w-full object-contain"
                          />
                        </div>
                        <p className="text-sm font-bold text-[var(--brand-heading)]">
                          {CAMPAIGN_INFO.banking.accountName}
                        </p>
                        <p className="text-xs text-[var(--brand-text)] font-medium">
                          NH: {CAMPAIGN_INFO.banking.bankName || CAMPAIGN_INFO.banking.bankId} · STK: {CAMPAIGN_INFO.banking.accountNo}
                        </p>
                        <div className="rounded-lg bg-[var(--brand-surface)] p-2 text-xs border border-[var(--brand-border)]">
                          Nội dung CK bắt buộc:{" "}
                          <strong className="text-[#df8143]">
                            {formData.name.trim() || "Họ tên của bạn"} - {formData.phone.trim() || "SĐT của bạn"}
                          </strong>
                        </div>
                      </div>
                    )}

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
                  </form>
                </div>
              )}
            </>
          )}

          {/* TAB 2: ĐƠN ĐÃ ĐẶT */}
          {activeTab === "orders" && (
            <div>
              {pastOrders.length === 0 ? (
                <div className="flex flex-col items-center justify-center text-center py-16">
                  <div className="flex size-14 items-center justify-center rounded-full bg-[var(--brand-surface-alt)] text-[var(--brand-muted)] mb-3">
                    <ShoppingBag className="size-6" />
                  </div>
                  <p className="text-sm font-bold text-[var(--brand-heading)]">Bạn chưa có đơn hàng nào</p>
                  <p className="mt-1 text-xs text-[var(--brand-muted)]">
                    Các đơn bạn đặt trên trình duyệt này sẽ được lưu tại đây để tiện theo dõi.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-xs text-[var(--brand-muted)] font-medium">
                    Danh sách đơn hàng bạn đã đặt trên thiết bị này:
                  </p>
                  {pastOrders.map((ord, idx) => (
                    <div
                      key={idx}
                      className="rounded-2xl border border-[var(--brand-border)] bg-[var(--brand-surface-alt)] p-4 text-xs space-y-2 shadow-sm"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[#df8143] text-sm">{ord.id}</span>
                        <span className="rounded-full bg-[#315444]/15 px-2 py-0.5 text-[10px] font-bold text-[#315444]">
                          Đã tiếp nhận
                        </span>
                      </div>
                      <p className="text-[var(--brand-muted)]">Thời gian: {ord.createdAt}</p>
                      <div className="border-t border-[var(--brand-border)] pt-2 space-y-1">
                        {ord.items.map((it, i) => (
                          <div key={i} className="flex justify-between">
                            <span>{it.quantity}x {it.productName} {it.sizeName ? `(${it.sizeName})` : ""}</span>
                            <span className="font-semibold">{it.subtotal.toLocaleString("vi-VN")}đ</span>
                          </div>
                        ))}
                      </div>
                      {ord.giftSummary && (
                        <div className="rounded-lg bg-[#df8143]/15 px-2.5 py-1 text-[11px] font-bold text-[#b93815] dark:text-[#f39c5b] flex items-center gap-1.5">
                          <Gift className="size-3.5 shrink-0 text-[#df8143]" />
                          <span>Quà tặng kèm: {ord.giftSummary}</span>
                        </div>
                      )}
                      <div className="border-t border-[var(--brand-border)] pt-2 flex justify-between font-bold text-sm">
                        <span>Tổng tiền:</span>
                        <span className="text-[#df8143]">{ord.total.toLocaleString("vi-VN")}đ</span>
                      </div>
                      <div className="text-[11px] text-[var(--brand-muted)]">
                        Nhận ngày {ord.pickupDate} ({ord.pickupTime}) tại {ord.pickupLocation}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
