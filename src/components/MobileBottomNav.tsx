"use client";

import React from "react";
import { Home, Store, Package, ShoppingBag, Heart } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { CAMPAIGN_INFO } from "@/data/campaign";

export default function MobileBottomNav() {
  const {
    totalQuantity,
    setIsCartOpen,
    customerPhone,
    setIsOrdersDrawerOpen,
  } = useCart();

  const scrollToSection = (id: string) => {
    if (id === "top") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav
      aria-label="Thanh điều hướng di động"
      style={{ transform: "translateZ(0)" }}
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 w-full bg-white dark:bg-[#19221d] border-t border-[var(--brand-border)] shadow-[0_-6px_25px_rgba(0,0,0,0.12)] dark:shadow-[0_-6px_30px_rgba(0,0,0,0.5)] px-2 pt-2 pb-[max(0.6rem,env(safe-area-inset-bottom))]"
    >
      <div className="grid grid-cols-4 items-center">
        {/* 1. Trang chủ */}
        <button
          type="button"
          onClick={() => scrollToSection("top")}
          className="flex flex-col items-center justify-center py-1 text-[var(--brand-muted)] hover:text-[#df8143] active:scale-95 transition group"
        >
          <Home className="size-5 transition-transform group-hover:scale-110" />
          <span className="text-[10.5px] font-semibold tracking-tight mt-1 text-[var(--brand-heading)]">
            Trang chủ
          </span>
        </button>

        {/* 2. Gian hàng */}
        <button
          type="button"
          onClick={() => scrollToSection("shop")}
          className="flex flex-col items-center justify-center py-1 text-[var(--brand-muted)] hover:text-[#df8143] active:scale-95 transition group"
        >
          <Store className="size-5 transition-transform group-hover:scale-110" />
          <span className="text-[10.5px] font-semibold tracking-tight mt-1 text-[var(--brand-heading)]">
            Gian hàng
          </span>
        </button>

        {/* 3. Đơn của tôi */}
        <button
          type="button"
          onClick={() => setIsOrdersDrawerOpen(true)}
          className="relative flex flex-col items-center justify-center py-1 text-[var(--brand-muted)] hover:text-[#df8143] active:scale-95 transition group"
        >
          <div className="relative">
            <Package className="size-5 text-[#315444] dark:text-[#a8bf9e] transition-transform group-hover:scale-110" />
            {customerPhone && (
              <span
                className="absolute -top-1 -right-1 size-2 rounded-full bg-emerald-500 ring-2 ring-[var(--brand-surface)] animate-pulse"
                title="Đã lưu SĐT"
              />
            )}
          </div>
          <span className="text-[10.5px] font-semibold tracking-tight mt-1 text-[var(--brand-heading)] truncate max-w-[76px]">
            {customerPhone ? `Đơn (${customerPhone.slice(-4)})` : "Đơn của tôi"}
          </span>
        </button>

        {/* 4. Giỏ hàng hoặc Bảng Vàng */}
        {CAMPAIGN_INFO.isEnded ? (
          <button
            type="button"
            onClick={() => scrollToSection("donate")}
            className="relative flex flex-col items-center justify-center py-1 text-[var(--brand-muted)] hover:text-[#df8143] active:scale-95 transition group"
          >
            <Heart className="size-5 text-[#df8143] transition-transform group-hover:scale-110" />
            <span className="text-[10.5px] font-semibold tracking-tight mt-1 text-[var(--brand-heading)]">
              Bảng Vàng
            </span>
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setIsCartOpen(true)}
            className="relative flex flex-col items-center justify-center py-1 text-[var(--brand-muted)] hover:text-[#df8143] active:scale-95 transition group"
          >
            <div className="relative">
              <ShoppingBag className="size-5 text-[#df8143] transition-transform group-hover:scale-110" />
              {totalQuantity > 0 && (
                <span className="absolute -top-1.5 -right-2.5 flex h-4 min-w-4 px-1 items-center justify-center rounded-full bg-[#df8143] text-[9.5px] font-bold text-white shadow-sm ring-2 ring-[var(--brand-surface)] animate-pulse">
                  {totalQuantity}
                </span>
              )}
            </div>
            <span className="text-[10.5px] font-semibold tracking-tight mt-1 text-[var(--brand-heading)]">
              Giỏ hàng
            </span>
          </button>
        )}
      </div>
    </nav>
  );
}
