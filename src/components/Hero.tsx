"use client";

import React from "react";
import { ArrowRight, Heart, Users, Sparkles, ShieldCheck } from "lucide-react";
import { CAMPAIGN_INFO } from "@/data/campaign";

export default function Hero() {
  return (
    <section id="top" className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 pb-16 pt-8 md:px-10 lg:grid-cols-[1fr_1fr] lg:gap-16 lg:pb-24 lg:pt-14">
      {/* Left Column */}
      <div className="max-w-xl">
        {/* Project Tag */}
        <div className="mb-6 inline-flex items-center gap-3 text-xs font-bold uppercase tracking-[0.2em] text-[#df8143]">
          <span className="h-px w-8 bg-[#df8143]"></span>
          Dự án sinh viên FPT · The Boys
        </div>

        {/* Hero Heading */}
        <h1 className="text-4xl font-extrabold leading-[1.08] tracking-tight text-[var(--brand-heading)] sm:text-6xl lg:text-[4.2rem] font-serif">
          Góp nắng yêu thương,<br />
          <em className="font-normal italic text-[#df8143]">tri ân ngàn người lính.</em>
        </h1>

        {/* Subtitle */}
        <p className="mt-6 text-base leading-7 text-[var(--brand-muted)] max-w-lg">
          Toàn bộ lợi nhuận từ gian hàng được chuyển thành <strong>20 phần quà đặc biệt</strong> (sữa Ensure, bánh Solite, sữa Nutifood &amp; thư tri ân viết tay) gửi tặng các cô chú thương binh nhiễm chất độc da cam.
        </p>

        {/* CTA Buttons */}
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <a
            href="#shop"
            className="inline-flex items-center gap-3 rounded-full bg-[#315444] px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-[#315444]/20 transition hover:bg-[#243e33] hover:gap-4 active:scale-95"
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

        {/* Social Proof */}
        <div className="mt-12 flex items-center gap-4">
          <div className="flex -space-x-2.5">
            <span className="flex size-9 items-center justify-center rounded-full border-2 border-[var(--brand-bg)] bg-[#e0a16e] text-[11px] font-bold text-white shadow-sm">
              T
            </span>
            <span className="flex size-9 items-center justify-center rounded-full border-2 border-[var(--brand-bg)] bg-[#a8bf9e] text-[11px] font-bold text-white shadow-sm">
              H
            </span>
            <span className="flex size-9 items-center justify-center rounded-full border-2 border-[var(--brand-bg)] bg-[#d2b49e] text-[11px] font-bold text-white shadow-sm">
              V
            </span>
            <span className="flex size-9 items-center justify-center rounded-full border-2 border-[var(--brand-bg)] bg-[#315444] text-[11px] font-bold text-white shadow-sm">
              +
            </span>
          </div>
          <span className="text-xs leading-5 text-[var(--brand-muted)]">
            Đã có <strong className="text-[var(--brand-heading)] font-bold text-sm text-[#df8143]">68+ đơn hàng</strong><br />
            cùng sinh viên chung tay đóng góp
          </span>
        </div>
      </div>

      {/* Right Column: Visual Showcase */}
      <div className="relative mx-auto w-full max-w-xl">
        {/* Soft Background glow */}
        <div className="absolute -right-8 -top-8 size-44 rounded-full bg-[#df8143]/20 blur-3xl" />
        <div className="absolute -bottom-10 -left-10 size-44 rounded-full bg-[#315444]/20 blur-3xl" />

        {/* Main Hero Card */}
        <div className="relative aspect-[1.12/1] overflow-hidden rounded-[2.5rem] rounded-br-[7rem] bg-[#dfd3c3] shadow-2xl border-4 border-white/50 dark:border-white/10">
          <img
            src="https://images.unsplash.com/photo-1593113598332-cd288d649433?w=1000&auto=format&fit=crop&q=80"
            alt="Hoạt động thiện nguyện tri ân các anh hùng thương binh"
            className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <div className="absolute bottom-6 left-6 right-6 text-white">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#315444]/90 px-3 py-1 text-xs font-semibold backdrop-blur-md">
              <ShieldCheck className="size-3.5 text-[#e6b057]" />
              Chiến dịch 13/10 — 17/10/2026
            </span>
            <p className="mt-2 text-lg font-bold">Hành Trình Dòng Nước Về Nguồn</p>
            <p className="text-xs text-white/80">Sống cùng anh hùng thời bình &amp; gửi trọn lòng tri ân</p>
          </div>
        </div>

        {/* Floating Mini Badge 1 */}
        <div className="absolute -bottom-6 left-2 sm:-left-6 rounded-2xl border border-[var(--brand-border)] bg-[var(--brand-surface)]/95 p-3.5 shadow-xl backdrop-blur-md">
          <div className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-full bg-[#e6b057]/20 text-[#df8143]">
              <Heart className="size-5 fill-[#df8143]" />
            </span>
            <div>
              <p className="text-xs font-bold text-[var(--brand-heading)]">20 Phần quà nghĩa tình</p>
              <p className="text-[11px] text-[var(--brand-muted)]">Trao tận tay các chú thương binh</p>
            </div>
          </div>
        </div>

        {/* Floating Mini Badge 2 */}
        <div className="hidden sm:flex absolute -top-5 right-4 rounded-2xl border border-[var(--brand-border)] bg-[var(--brand-surface)]/95 px-3.5 py-2.5 shadow-lg backdrop-blur-md items-center gap-2">
          <Sparkles className="size-4 text-[#e6b057]" />
          <span className="text-xs font-semibold text-[var(--brand-heading)]">
            Voucher 10% - 15% cho ngày 17/10
          </span>
        </div>
      </div>
    </section>
  );
}
