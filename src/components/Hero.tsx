"use client";

import React from "react";
import { ArrowRight, Heart, Sparkles } from "lucide-react";
import { CAMPAIGN_INFO } from "@/data/campaign";

export default function Hero() {
  return (
    <section id="top" className="relative mx-auto grid max-w-7xl w-full items-center gap-12 px-5 pb-20 pt-8 sm:pt-10 md:px-10 lg:grid-cols-[1fr_1fr] lg:gap-16 lg:pb-28 lg:pt-16 overflow-hidden">
      {/* Soft Ambient Glows */}
      <div className="pointer-events-none absolute -left-10 top-10 -z-10 size-80 rounded-full bg-[#df8143]/10 blur-3xl" />
      <div className="pointer-events-none absolute right-10 top-20 -z-10 size-96 rounded-full bg-[#315444]/15 blur-3xl" />

      {/* Left Column: Heading & Info */}
      <div className="max-w-xl w-full">
        {/* Project Tag */}
        <div className="mb-6 sm:mb-7 inline-flex items-center gap-3 text-xs font-bold uppercase tracking-[0.18em] text-[#df8143]">
          <span className="h-px w-8 sm:w-10 bg-[#df8143]" />
          <span>Dự án sinh viên FPT · The Boys</span>
          <span className="h-px w-8 sm:w-10 bg-[#df8143]" />
        </div>

        {/* Hero Heading */}
        <h1 className="text-[2.2rem] sm:text-5xl lg:text-[4.4rem] font-bold leading-[1.14] tracking-tight text-[var(--brand-heading)] break-words font-serif">
          Góp nắng yêu thương,<br />
          <em className="font-normal italic text-[#df8143]">
            tri ân ngàn người lính.
          </em>
        </h1>

        {/* Subtitle */}
        <p className="mt-7 max-w-md text-base leading-7 text-[var(--brand-muted)]">
          Lợi nhuận từ mỗi món bạn mua sẽ được gom góp thành <strong>20 phần quà đặc biệt</strong> (sữa Ensure Gold, bánh Solite, sữa Nutifood &amp; những bức thư tri ân viết tay) gửi đến các chú thương binh nhiễm chất độc da cam.
        </p>

        {/* Action Buttons */}
        <div className="mt-9 flex flex-wrap items-center gap-5">
          <a
            href="#shop"
            className="inline-flex items-center gap-3 rounded-full bg-[#315444] px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-[#315444]/20 transition hover:bg-[#243e33] active:scale-95"
          >
            Ghé gian hàng <ArrowRight className="size-4" />
          </a>
          <a
            href="#journey"
            className="text-sm font-semibold text-[var(--brand-heading)] underline decoration-[#df8143] underline-offset-4 hover:text-[#df8143] transition"
          >
            Hành trình thiện nguyện
          </a>
        </div>

        {/* Social Proof Counter */}
        <div className="mt-14 flex items-center gap-4">
          <div className="flex -space-x-2">
            <span className="flex size-8 items-center justify-center rounded-full border-2 border-[var(--brand-bg)] bg-[#e0a16e] text-[10px] font-bold text-white shadow-sm">
              T
            </span>
            <span className="flex size-8 items-center justify-center rounded-full border-2 border-[var(--brand-bg)] bg-[#a8bf9e] text-[10px] font-bold text-white shadow-sm">
              H
            </span>
            <span className="flex size-8 items-center justify-center rounded-full border-2 border-[var(--brand-bg)] bg-[#d2b49e] text-[10px] font-bold text-white shadow-sm">
              V
            </span>
          </div>
          <span className="text-xs leading-4 text-[var(--brand-muted)]">
            Đã có <strong className="text-[var(--brand-heading)] font-bold text-[#df8143]">68+ đơn hàng</strong><br />
            đã chung tay góp sức
          </span>
        </div>
      </div>

      {/* Right Column: Hero Visual Showcase */}
      <div className="relative mx-auto w-full max-w-xl">
        {/* Soft Background glow behind card */}
        <div className="absolute -right-8 -top-8 size-48 rounded-full bg-[#f0dca8]/60 blur-2xl" />

        {/* Main Photo: Rounded artistic shape */}
        <div className="relative aspect-[1.12/1] overflow-hidden rounded-[2.5rem] rounded-br-[7.5rem] bg-[#d9c0a8] shadow-2xl shadow-[#315444]/15 border-4 border-white dark:border-white/10">
          <img
            src="https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=1000&auto=format&fit=crop&q=80"
            alt="Hoạt động sẻ chia ấm áp và gắn kết yêu thương"
            className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
          />
        </div>

        {/* Floating Bottom Left Badge: 20 Phần quà */}
        <div className="absolute -bottom-6 left-3 sm:-left-4 rounded-2xl border border-white/80 dark:border-white/10 bg-[var(--brand-surface)] p-4 shadow-xl shadow-[#315444]/15">
          <div className="flex items-center gap-3">
            <span className="flex size-11 items-center justify-center rounded-full bg-[#f1d899] text-[#7d632a]">
              <Heart className="size-5 fill-[#df8143] text-[#df8143]" />
            </span>
            <div>
              <p className="text-base font-bold text-[var(--brand-heading)]">20 Phần quà nghĩa tình</p>
              <p className="text-xs text-[var(--brand-muted)]">Trao tận tay các chú thương binh</p>
            </div>
          </div>
        </div>

        {/* Floating Top Right Badge */}
        <div className="absolute -top-4 right-3 sm:right-4 rounded-full border border-white/80 dark:border-white/10 bg-[var(--brand-surface)] px-4 py-2 shadow-lg flex items-center gap-2">
          <span className="flex size-2 rounded-full bg-[#df8143] animate-ping" />
          <span className="text-xs font-bold text-[var(--brand-heading)]">
            Chiến dịch 13/10 — 17/10
          </span>
        </div>
      </div>
    </section>
  );
}
