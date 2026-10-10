"use client";

import React from "react";
import { Sparkles, ArrowRight, Gift } from "lucide-react";
import { useCart } from "@/context/CartContext";

export default function VoucherBanner() {
  const { voucherBenefit, subtotal, setIsCartOpen } = useCart();

  return (
    <section id="vouchers" className="bg-gradient-to-r from-[#df8143]/15 via-[#e6b057]/15 to-[#315444]/15 border-b border-[var(--brand-border)] py-3 px-4">
      <div className="mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-3 text-xs sm:text-sm">
        <div className="flex items-center gap-2.5 flex-wrap justify-center sm:justify-start">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#df8143] px-2.5 py-1 text-[11px] font-bold text-white shadow-sm">
            <Sparkles className="size-3.5" />
            ƯU ĐÃI DEBUT 13/10
          </span>
          <span className="font-semibold text-[var(--brand-heading)]">
            Đặt sớm nhận Voucher giảm 10% — 15% cho ngày Workshop 17/10:
          </span>
          <span className="text-[var(--brand-muted)] hidden lg:inline">
            Đơn từ 59k (giảm 10%), từ 89k (giảm 10% mọi combo), từ 149k (giảm 15% VIP).
          </span>
        </div>

        {/* Voucher Status pill */}
        <div className="flex items-center gap-2">
          {voucherBenefit.current ? (
            <button
              onClick={() => setIsCartOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-full bg-[#315444] px-3 py-1 font-semibold text-white text-xs hover:bg-[#243e33] transition"
            >
              <Gift className="size-3.5 text-[#e6b057]" />
              {voucherBenefit.current.title}
              <ArrowRight className="size-3" />
            </button>
          ) : (
            <button
              onClick={() => setIsCartOpen(true)}
              className="inline-flex items-center gap-1 text-[var(--brand-accent)] font-semibold text-xs hover:underline"
            >
              Mua thêm {voucherBenefit.neededForNext.toLocaleString("vi-VN")}đ nhận voucher
              <ArrowRight className="size-3" />
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
