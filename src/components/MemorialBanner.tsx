"use client";

import React, { useState } from "react";
import { X } from "lucide-react";
import { CAMPAIGN_INFO } from "@/data/campaign";

export default function MemorialBanner() {
  const [dismissed, setDismissed] = useState(false);

  if (!CAMPAIGN_INFO.isEnded || dismissed) return null;

  return (
    <aside
      aria-label="Thông báo chiến dịch"
      className="relative z-30 border-b border-[#df8143]/20 bg-[#16271e] text-white/90 py-2 sm:py-2.5 px-8 sm:px-12 transition-colors"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-center text-center text-xs">
        {/* Centered Content: Badge + Message + Link */}
        <div className="flex flex-wrap items-center justify-center gap-x-2.5 gap-y-1 text-center">
          <span className="inline-flex items-center rounded-full bg-[#df8143]/20 border border-[#df8143]/40 px-2.5 py-0.5 text-[10.5px] font-bold text-[#f39c5b] shrink-0">
            Chiến dịch đã khép lại
          </span>

          <span className="text-[12px] sm:text-[12.5px] text-[#e0ece4]">
            Nguồn lực sẽ được nhóm The Boys phối hợp cùng Câu lạc bộ thực hiện hoạt động tri ân thương binh.
          </span>

          <a
            href="#donate"
            className="inline-flex items-center gap-1 text-[11.5px] font-bold text-[#df8143] hover:text-[#f39c5b] hover:underline underline-offset-2 transition shrink-0"
          >
            <span>Bảng Vàng tri ân</span>
            <span>&rarr;</span>
          </a>
        </div>

        {/* Absolute Right: Dismiss Button */}
        <button
          type="button"
          onClick={() => setDismissed(true)}
          className="absolute right-2.5 sm:right-4 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition"
          title="Đóng thông báo"
          aria-label="Đóng thông báo"
        >
          <X className="size-3.5" />
        </button>
      </div>
    </aside>
  );
}
