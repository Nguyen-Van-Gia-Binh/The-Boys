"use client";

import React from "react";
import { Sparkles, ArrowRight, Gift, Tag, Flame } from "lucide-react";
import { useCart } from "@/context/CartContext";

export default function VoucherBanner() {
  const { voucherBenefit, subtotal, setIsCartOpen } = useCart();

  return (
    <div className="relative z-30 bg-gradient-to-r from-[#243e33] via-[#315444] to-[#243e33] text-[#fffdfa] py-2.5 px-4 shadow-sm border-b border-[#3d6854]">
      <div className="mx-auto max-w-7xl flex flex-col md:flex-row items-center justify-between gap-2.5 text-xs sm:text-sm">
        {/* Left: Tag + Headline */}
        <div className="flex items-center gap-2.5 flex-wrap justify-center md:justify-start">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#df8143] px-3 py-0.5 text-[11px] font-extrabold text-white shadow-sm tracking-wide">
            <Flame className="size-3.5 fill-white" />
            DEBUT 13/10
          </span>
          <span className="font-bold tracking-tight text-white flex items-center gap-1.5">
            Ưu đãi đặt sớm sự kiện 17/10:
          </span>
          <div className="hidden lg:flex items-center gap-2 text-xs">
            <span className="inline-flex items-center gap-1 rounded-md bg-white/10 px-2 py-0.5 font-medium text-[#f0c985]">
              <Tag className="size-3" /> &gt;59k: Giảm 10%
            </span>
            <span className="inline-flex items-center gap-1 rounded-md bg-white/10 px-2 py-0.5 font-medium text-[#f0c985]">
              <Tag className="size-3" /> &gt;89k: Giảm 10% All
            </span>
            <span className="inline-flex items-center gap-1 rounded-md bg-[#e6b057]/20 px-2 py-0.5 font-bold text-[#e6b057]">
              ⭐ &gt;149k: Giảm 15% VIP
            </span>
          </div>
        </div>

        {/* Right: Dynamic Cart Voucher CTA */}
        <div className="flex items-center gap-3">
          {voucherBenefit.current ? (
            <button
              onClick={() => setIsCartOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-full bg-[#e6b057] px-3.5 py-1 font-bold text-[#1a2820] text-xs shadow-md hover:bg-[#f0c985] transition active:scale-95"
            >
              <Gift className="size-3.5 fill-[#1a2820]" />
              {voucherBenefit.current.title}
              <ArrowRight className="size-3" />
            </button>
          ) : (
            <button
              onClick={() => setIsCartOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-full bg-white/15 hover:bg-white/25 px-3 py-1 font-semibold text-xs text-[#f0c985] transition border border-white/20 active:scale-95"
            >
              <Sparkles className="size-3 text-[#e6b057]" />
              <span>Mua thêm <strong>{voucherBenefit.neededForNext.toLocaleString("vi-VN")}đ</strong> để nhận voucher</span>
              <ArrowRight className="size-3" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
