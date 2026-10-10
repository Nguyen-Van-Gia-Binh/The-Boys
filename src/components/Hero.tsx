"use client";

import React from "react";
import { ArrowRight, Heart, Sparkles, ShieldCheck, Gift, Calendar } from "lucide-react";
import { CAMPAIGN_INFO } from "@/data/campaign";

export default function Hero() {
  return (
    <section id="top" className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 pb-20 pt-10 md:px-10 lg:grid-cols-[1fr_1fr] lg:gap-16 lg:pb-28 lg:pt-16">
      {/* Background Decorative Ambient Glows */}
      <div className="pointer-events-none absolute left-1/4 top-10 -z-10 size-96 rounded-full bg-[#df8143]/10 blur-3xl" />
      <div className="pointer-events-none absolute right-10 top-20 -z-10 size-96 rounded-full bg-[#315444]/15 blur-3xl" />

      {/* Left Column: Headline & Action */}
      <div className="max-w-xl">
        {/* Project Tag */}
        <div className="mb-6 inline-flex items-center gap-2.5 rounded-full border border-[var(--brand-border)] bg-[var(--brand-surface)] px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-[#df8143] shadow-sm">
          <span className="size-2 rounded-full bg-[#df8143] animate-ping" />
          Dự án sinh viên FPT · The Boys
        </div>

        {/* Hero Heading - Flawless Typography */}
        <h1 className="text-4xl font-extrabold leading-[1.12] tracking-tight text-[var(--brand-heading)] sm:text-6xl lg:text-[4.2rem]">
          Góp nắng yêu thương,<br />
          <span className="font-serif italic font-normal text-[#df8143] tracking-normal">
            tri ân ngàn người lính.
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mt-6 text-base sm:text-lg leading-relaxed text-[var(--brand-muted)] max-w-lg font-normal">
          Lợi nhuận từ mỗi món bạn mua sẽ được gom góp thành <strong>20 phần quà đặc biệt</strong> (sữa Ensure Gold, bánh Solite, sữa Nutifood &amp; những bức thư tri ân viết tay) gửi đến các chú thương binh nhiễm chất độc da cam.
        </p>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <a
            href="#shop"
            className="inline-flex items-center gap-3 rounded-full bg-[#315444] px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-[#315444]/25 transition hover:bg-[#243e33] hover:gap-4 active:scale-95"
          >
            Ghé gian hàng <ArrowRight className="size-4" />
          </a>
          <a
            href="#journey"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--brand-heading)] underline decoration-[#df8143] underline-offset-4 hover:text-[#df8143] transition"
          >
            Hành trình thiện nguyện
          </a>
        </div>

        {/* Social Proof Counter */}
        <div className="mt-12 flex items-center gap-4 pt-2 border-t border-[var(--brand-border)]">
          <div className="flex -space-x-2.5">
            <span className="flex size-9 items-center justify-center rounded-full border-2 border-[var(--brand-bg)] bg-[#e0a16e] text-[11px] font-extrabold text-white shadow-sm">
              T
            </span>
            <span className="flex size-9 items-center justify-center rounded-full border-2 border-[var(--brand-bg)] bg-[#a8bf9e] text-[11px] font-extrabold text-white shadow-sm">
              H
            </span>
            <span className="flex size-9 items-center justify-center rounded-full border-2 border-[var(--brand-bg)] bg-[#d2b49e] text-[11px] font-extrabold text-white shadow-sm">
              V
            </span>
            <span className="flex size-9 items-center justify-center rounded-full border-2 border-[var(--brand-bg)] bg-[#315444] text-[11px] font-extrabold text-white shadow-sm">
              +
            </span>
          </div>
          <span className="text-xs sm:text-sm leading-snug text-[var(--brand-muted)]">
            Đã có <strong className="text-[var(--brand-heading)] font-bold text-[#df8143]">68+ đơn hàng</strong> đã chung tay góp sức
          </span>
        </div>
      </div>

      {/* Right Column: Warm Heartfelt Visual Collage */}
      <div className="relative mx-auto w-full max-w-xl">
        {/* Soft Background Blob */}
        <div className="absolute -right-6 -top-6 size-40 rounded-full bg-[#e6b057]/30 blur-2xl" />

        {/* Main Photo Card */}
        <div className="relative aspect-[1.15/1] overflow-hidden rounded-[2.5rem] rounded-br-[7rem] bg-[#dfd3c3] shadow-2xl border-4 border-white dark:border-white/10">
          <img
            src="https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=1000&auto=format&fit=crop&q=80"
            alt="Nụ cười ấm áp của các cụ già và hoạt động sẻ chia"
            className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          
          {/* Inner Badge Overlay */}
          <div className="absolute bottom-6 left-6 right-6 text-white">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#315444]/95 px-3 py-1 text-xs font-bold backdrop-blur-md text-[#f8f5ef]">
              <Calendar className="size-3.5 text-[#e6b057]" />
              Sự kiện chính 17/10/2026
            </span>
            <p className="mt-2 text-xl font-bold font-serif leading-snug">Hành Trình Dòng Nước Về Nguồn</p>
            <p className="text-xs text-white/85">Một buổi sống cùng anh hùng trong thời bình</p>
          </div>
        </div>

        {/* Floating Mini Badge Bottom: 20 Phần quà */}
        <div className="absolute -bottom-6 left-4 sm:-left-4 rounded-2xl border border-[var(--brand-border)] bg-[var(--brand-surface)]/95 p-3.5 shadow-xl backdrop-blur-md transition-transform hover:scale-105">
          <div className="flex items-center gap-3">
            <span className="flex size-11 items-center justify-center rounded-full bg-[#df8143]/15 text-[#df8143]">
              <Heart className="size-6 fill-[#df8143]" />
            </span>
            <div>
              <p className="text-sm font-bold text-[var(--brand-heading)]">20 Phần quà nghĩa tình</p>
              <p className="text-xs text-[var(--brand-muted)]">Tri ân các chú thương binh da cam</p>
            </div>
          </div>
        </div>

        {/* Floating Mini Badge Top: Early-Bird Ticket */}
        <div className="absolute -top-4 right-2 sm:right-4 rounded-2xl border border-[var(--brand-border)] bg-[var(--brand-surface)]/95 px-4 py-2.5 shadow-lg backdrop-blur-md flex items-center gap-2.5 transition-transform hover:scale-105">
          <span className="flex size-7 items-center justify-center rounded-full bg-[#e6b057]/20 text-[#df8143]">
            <Sparkles className="size-4 text-[#df8143]" />
          </span>
          <div>
            <p className="text-xs font-bold text-[var(--brand-heading)]">Ưu Đãi Ngày 13/10</p>
            <p className="text-[11px] font-semibold text-[#df8143]">Giảm 10% — 15% Combo</p>
          </div>
        </div>
      </div>
    </section>
  );
}
