"use client";

import React from "react";
import { Sparkles, ArrowRight, Gift, Flame, Tag } from "lucide-react";
import { useCart } from "@/context/CartContext";

export default function VoucherBanner() {
  const { voucherBenefit, setIsCartOpen } = useCart();

  return (
    <div className="relative z-30 border-b border-[#e4d5be] dark:border-[#27382c] bg-[#f5ecdd] dark:bg-[#1a261f] py-2 px-4 transition-colors">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-3 gap-y-1.5 text-center text-xs sm:text-sm">
        {/* Badge */}
        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#df8143] px-2.5 py-0.5 text-[11px] font-bold text-white shadow-sm">
          <Flame className="size-3 fill-white" />
          DEBUT 13/10
        </span>

        {/* Text */}
        <span className="font-medium text-[var(--brand-heading)]">
          Ưu đãi đặt sớm sự kiện 17/10: Nhận Voucher giảm <strong>10% — 15%</strong> cho các Combo!
        </span>

        {/* Chips */}
        <div className="hidden md:flex items-center gap-1.5 text-[11px]">
          <span className="rounded-md bg-black/5 dark:bg-white/10 px-2 py-0.5 font-semibold text-[#8b4513] dark:text-[#f0c985]">
            Đơn &gt;59k: -10%
          </span>
          <span className="rounded-md bg-black/5 dark:bg-white/10 px-2 py-0.5 font-semibold text-[#8b4513] dark:text-[#f0c985]">
            Đơn &gt;89k: -10% All
          </span>
          <span className="rounded-md bg-[#df8143]/15 px-2 py-0.5 font-bold text-[#df8143]">
            Đơn &gt;149k: -15% VIP
          </span>
        </div>

        {/* CTA */}
        <button
          onClick={() => setIsCartOpen(true)}
          className="inline-flex items-center gap-1 font-bold text-[#df8143] hover:text-[#ca6f33] transition hover:underline ml-1"
        >
          {voucherBenefit.current ? (
            <span className="inline-flex items-center gap-1 text-[#315444] dark:text-[#e6b057]">
              <Gift className="size-3.5" /> {voucherBenefit.current.title} →
            </span>
          ) : (
            <span>Xem chi tiết giỏ hàng &amp; lấy ưu đãi →</span>
          )}
        </button>
      </div>
    </div>
  );
}
