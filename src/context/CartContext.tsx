"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { CheckCircle2, ArrowRight, X } from "lucide-react";
import { CartItem, Product, OrderPayload } from "@/types";
import { calculateVoucherBenefit } from "@/data/campaign";

export interface AppliedVoucher {
  code: string;
  discountPercent: number;
  maxDiscount?: number;
  minSpend: number;
  applicableCategory: string;
  description: string;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, selectedSize?: { name: string; price: number }) => void;
  updateQuantity: (index: number, delta: number) => void;
  removeFromCart: (index: number) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  activeTab: "cart" | "orders";
  setActiveTab: (tab: "cart" | "orders") => void;
  subtotal: number;
  discountAmount: number;
  total: number;
  totalQuantity: number;
  hasCombo: boolean;
  totalGiftBanhTrang: number;
  giftSummary: string;
  voucherBenefit: ReturnType<typeof calculateVoucherBenefit>;
  appliedVoucher: AppliedVoucher | null;
  applyVoucher: (code: string) => Promise<{ success: boolean; message: string }>;
  removeVoucher: () => void;
  isApplyingVoucher: boolean;
  pastOrders: OrderPayload[];
  addPastOrder: (order: OrderPayload) => void;
  customerPhone: string;
  setCustomerPhone: (phone: string) => void;
  isOrdersDrawerOpen: boolean;
  setIsOrdersDrawerOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"cart" | "orders">("cart");
  const [pastOrders, setPastOrders] = useState<OrderPayload[]>([]);
  const [customerPhone, setCustomerPhoneState] = useState<string>("");
  const [isOrdersDrawerOpen, setIsOrdersDrawerOpen] = useState(false);
  const [appliedVoucher, setAppliedVoucher] = useState<AppliedVoucher | null>(null);
  const [isApplyingVoucher, setIsApplyingVoucher] = useState(false);

  const setCustomerPhone = (phone: string) => {
    const clean = phone.trim();
    setCustomerPhoneState(clean);
    if (clean) {
      localStorage.setItem("theboys_customer_phone", clean);
    } else {
      localStorage.removeItem("theboys_customer_phone");
    }
  };
  const [toast, setToast] = useState<{
    id: number;
    title: string;
    description: string;
  } | null>(null);

  // Auto-dismiss toast sau 2.8 giây
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      setToast(null);
    }, 2800);
    return () => clearTimeout(timer);
  }, [toast]);

  // Load cart, orders, and voucher from localStorage
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem("theboys_cart");
      if (savedCart) setItems(JSON.parse(savedCart));

      const savedOrders = localStorage.getItem("theboys_orders");
      if (savedOrders) setPastOrders(JSON.parse(savedOrders));

      const savedPhone = localStorage.getItem("theboys_customer_phone");
      if (savedPhone) setCustomerPhoneState(savedPhone);

      const savedVoucher = localStorage.getItem("theboys_voucher");
      if (savedVoucher) setAppliedVoucher(JSON.parse(savedVoucher));
    } catch {
      // Ignore JSON error
    }
  }, []);

  // Sync cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("theboys_cart", JSON.stringify(items));
    } catch {
      // Ignore
    }
  }, [items]);

  // Sync voucher to localStorage
  useEffect(() => {
    try {
      if (appliedVoucher) {
        localStorage.setItem("theboys_voucher", JSON.stringify(appliedVoucher));
      } else {
        localStorage.removeItem("theboys_voucher");
      }
    } catch {
      // Ignore
    }
  }, [appliedVoucher]);

  const addToCart = (product: Product, selectedSize?: { name: string; price: number }) => {
    const unitPrice = selectedSize ? selectedSize.price : product.price;

    setItems((prev) => {
      const existingIdx = prev.findIndex(
        (item) =>
          item.product.id === product.id &&
          item.selectedSize?.name === selectedSize?.name
      );

      if (existingIdx > -1) {
        const next = [...prev];
        next[existingIdx] = {
          ...next[existingIdx],
          quantity: next[existingIdx].quantity + 1,
        };
        return next;
      }

      return [
        ...prev,
        {
          product,
          quantity: 1,
          selectedSize,
          unitPrice,
        },
      ];
    });

    // Thông báo nhẹ nhàng tinh tế thay vì tự động nhảy mở giỏ hàng
    const sizeNote = selectedSize ? ` (${selectedSize.name})` : "";
    setToast({
      id: Date.now(),
      title: "Đã thêm vào giỏ hàng!",
      description: `${product.name}${sizeNote}`,
    });
  };

  const updateQuantity = (index: number, delta: number) => {
    setItems((prev) => {
      const next = [...prev];
      const item = next[index];
      if (!item) return prev;

      const newQty = item.quantity + delta;
      if (newQty <= 0) {
        next.splice(index, 1);
      } else {
        next[index] = { ...item, quantity: newQty };
      }
      return next;
    });
  };

  const removeFromCart = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const clearCart = () => {
    setItems([]);
    setAppliedVoucher(null);
  };

  const addPastOrder = (order: OrderPayload) => {
    setPastOrders((prev) => {
      const next = [order, ...prev];
      try {
        localStorage.setItem("theboys_orders", JSON.stringify(next));
      } catch {
        // Ignore
      }
      return next;
    });
  };

  const subtotal = items.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity,
    0
  );

  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);

  // Phân tích quà tặng combo
  const comboItems = items.filter((it) => it.product.isCombo);
  const hasCombo = comboItems.length > 0;
  const totalGiftBanhTrang = comboItems.reduce(
    (sum, it) => sum + (it.product.comboGift?.quantity || 0) * it.quantity,
    0
  );
  const giftSummary =
    totalGiftBanhTrang > 0
      ? `${totalGiftBanhTrang} bịch Bánh tráng ngũ vị`
      : "";

  const voucherBenefit = calculateVoucherBenefit(subtotal);

  // Tính số tiền giảm giá theo voucher đang áp dụng
  const discountAmount = React.useMemo(() => {
    if (!appliedVoucher) return 0;
    if (subtotal < appliedVoucher.minSpend) return 0;

    const cat = (appliedVoucher.applicableCategory || "all").toLowerCase();
    let eligibleSubtotal = subtotal;

    if (cat !== "all") {
      const eligibleItems = items.filter(
        (it) => (it.product.category || "").toLowerCase() === cat
      );
      eligibleSubtotal = eligibleItems.reduce(
        (sum, it) => sum + it.unitPrice * it.quantity,
        0
      );
      if (eligibleSubtotal <= 0) return 0;
    }

    let disc = Math.round(eligibleSubtotal * (appliedVoucher.discountPercent / 100));
    if (appliedVoucher.maxDiscount && appliedVoucher.maxDiscount > 0) {
      disc = Math.min(disc, appliedVoucher.maxDiscount);
    }
    return Math.min(disc, subtotal);
  }, [appliedVoucher, items, subtotal]);

  const total = Math.max(0, subtotal - discountAmount);

  const applyVoucher = async (code: string): Promise<{ success: boolean; message: string }> => {
    const cleanCode = code.trim().toUpperCase();
    if (!cleanCode) {
      return { success: false, message: "Vui lòng nhập mã giảm giá." };
    }
    if (subtotal <= 0) {
      return { success: false, message: "Giỏ hàng đang trống. Hãy chọn món trước khi áp mã." };
    }

    setIsApplyingVoucher(true);
    try {
      const res = await fetch("/api/vouchers/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: cleanCode,
          subtotal,
          items: items.map((it) => ({
            category: it.product.category,
            subtotal: it.unitPrice * it.quantity,
            quantity: it.quantity,
          })),
        }),
      });

      const data = await res.json();
      if (res.ok && data.valid) {
        const newVoucher: AppliedVoucher = {
          code: data.voucherCode,
          discountPercent: data.discountPercent,
          maxDiscount: data.maxDiscount || 0,
          minSpend: data.minSpend || 0,
          applicableCategory: data.applicableCategory || "all",
          description: data.description || "",
        };
        setAppliedVoucher(newVoucher);
        setToast({
          id: Date.now(),
          title: "Áp mã thành công! 🎉",
          description: data.message || `Giảm ${data.discountAmount?.toLocaleString("vi-VN")}đ`,
        });
        return { success: true, message: data.message };
      } else {
        return { success: false, message: data.message || "Mã giảm giá không hợp lệ." };
      }
    } catch {
      return { success: false, message: "Lỗi kết nối khi kiểm tra mã. Vui lòng thử lại." };
    } finally {
      setIsApplyingVoucher(false);
    }
  };

  const removeVoucher = () => {
    setAppliedVoucher(null);
    setToast({
      id: Date.now(),
      title: "Đã gỡ mã giảm giá",
      description: "Đã hủy áp dụng voucher cho đơn hàng.",
    });
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
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
        totalQuantity,
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
        isOrdersDrawerOpen,
        setIsOrdersDrawerOpen,
      }}
    >
      {children}

      {/* Thông báo nhẹ nhàng khi thêm món vào giỏ hàng */}
      {toast && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-5 right-5 z-50 flex items-center gap-3 rounded-2xl border border-[var(--brand-border)] bg-[var(--brand-surface)]/95 px-4 py-3 shadow-2xl backdrop-blur-md transition-all animate-in fade-in slide-in-from-bottom-3 duration-300 max-w-sm sm:max-w-md ring-1 ring-black/5"
        >
          <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="size-5" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold text-[var(--brand-heading)]">{toast.title}</p>
            <p className="text-[11px] text-[var(--brand-muted)] truncate">{toast.description}</p>
          </div>
          <button
            type="button"
            onClick={() => {
              setIsCartOpen(true);
              setToast(null);
            }}
            className="flex items-center gap-1 rounded-xl bg-[#315444] px-3 py-1.5 text-[11px] font-bold text-white shadow-sm hover:bg-[#243e33] transition shrink-0 active:scale-95"
          >
            <span>Xem giỏ</span>
            <ArrowRight className="size-3" />
          </button>
          <button
            type="button"
            onClick={() => setToast(null)}
            className="p-1 rounded-lg text-[var(--brand-muted)] hover:bg-[var(--brand-surface-alt)] transition shrink-0"
            aria-label="Đóng thông báo"
          >
            <X className="size-3.5" />
          </button>
        </div>
      )}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
