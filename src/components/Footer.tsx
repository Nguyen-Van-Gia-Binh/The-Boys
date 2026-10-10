"use client";

import React from "react";
import { Heart, Mail, MapPin } from "lucide-react";
import { CAMPAIGN_INFO } from "@/data/campaign";

export default function Footer() {
  return (
    <footer id="contact" className="w-full border-t border-[var(--brand-border)] bg-[var(--brand-surface-alt)]/30 transition-colors">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-5 py-12 md:px-10 lg:flex-row lg:items-end lg:justify-between">
        {/* Brand Info */}
        <div>
          <div className="flex items-center gap-2.5">
            <span className="flex size-9 items-center justify-center rounded-full bg-[#315444] text-white">
              <Heart className="size-4.5 fill-[#e6b057] text-[#e6b057]" />
            </span>
            <span className="text-xl font-bold tracking-tight text-[var(--brand-heading)]">
              Dòng Nước Về Nguồn<span className="text-[#df8143]">.</span>
            </span>
          </div>
          <p className="mt-4 max-w-sm text-sm leading-6 text-[var(--brand-muted)]">
            Một dự án thiện nguyện ấm áp của sinh viên nhóm The Boys — Đại học FPT TP.HCM. Cùng nhau trao nắng, gửi trọn lòng tri ân.
          </p>
        </div>

        {/* Contact Info */}
        <div className="text-sm text-[var(--brand-muted)] lg:text-right space-y-1.5">
          <p className="font-semibold text-[var(--brand-heading)]">Kết nối với chúng mình</p>
          <p className="flex items-center lg:justify-end gap-2 text-xs">
            <Mail className="size-3.5 text-[#df8143]" />
            {CAMPAIGN_INFO.contacts.email}
          </p>
          <p className="flex items-center lg:justify-end gap-2 text-xs">
            <MapPin className="size-3.5 text-[#315444]" />
            Đại học FPT cơ sở TP.HCM (Khu CNC, Long Thạnh Mỹ, TP. Thủ Đức)
          </p>
          <p className="pt-3 text-xs text-[var(--brand-muted)]">
            © 2026 The Boys Project · FPT University
          </p>
        </div>
      </div>
    </footer>
  );
}
