"use client";

import React from "react";
import { Flame, Gift } from "lucide-react";

export default function VoucherBanner() {
  return (
    <div className="relative z-30 border-b border-[#e4d5be] dark:border-[#27382c] bg-[#f5ecdd] dark:bg-[#1a261f] py-2 px-4 transition-colors">
      <div className="mx-auto flex max-w-7xl items-center justify-center flex-wrap gap-x-3 gap-y-1.5 text-center text-xs sm:text-sm">
        {/* Badge */}
        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#df8143] px-2.5 py-0.5 text-[11px] font-bold text-white shadow-sm shrink-0">
          <Flame className="size-3 fill-white" />
          HOT 17/10
        </span>

        {/* Text */}
        <span className="font-medium text-[var(--brand-heading)]">
          Đặt trước Combo: <strong className="text-[#b93815] dark:text-[#f39c5b]">Tặng 2 — 3 bịch Bánh Tráng Trộn</strong> · Món lẻ từ 59k: <strong>Giảm 10% — 15%</strong>!
        </span>

        {/* Chips */}
        <div className="hidden md:flex items-center gap-1.5 text-[11px]">
          <span className="rounded-md bg-[#df8143]/15 px-2 py-0.5 font-bold text-[#b93815] dark:text-[#f39c5b] flex items-center gap-1">
            <Gift className="size-3" />
            Combo 1-2: +2 Bịch
          </span>
          <span className="rounded-md bg-[#df8143]/15 px-2 py-0.5 font-bold text-[#b93815] dark:text-[#f39c5b] flex items-center gap-1">
            <Gift className="size-3" />
            Combo 3-4: +3 Bịch
          </span>
          <span className="rounded-md bg-black/5 dark:bg-white/10 px-2 py-0.5 font-semibold text-[#8b4513] dark:text-[#f0c985]">
            Món lẻ &gt;59k: -10%
          </span>
          <span className="rounded-md bg-black/5 dark:bg-white/10 px-2 py-0.5 font-semibold text-[#8b4513] dark:text-[#f0c985]">
            Món lẻ &gt;149k: -15% VIP
          </span>
        </div>
      </div>
    </div>
  );
}
