"use client";

import React, { useState } from "react";
import { MapPin, Calendar, Sparkles, Coffee, UtensilsCrossed, Flower2, Gift } from "lucide-react";
import { PRODUCTS, CAMPAIGN_INFO } from "@/data/campaign";
import { ProductCard } from "@/components/ProductCard";
import { ProductCategory } from "@/types";

export default function ShopSection() {
  const [activeTab, setActiveTab] = useState<ProductCategory>("all");

  const categories = [
    { id: "all", label: "Tất cả món", icon: Sparkles },
    { id: "snack", label: "Ăn vặt & Bánh tráng", icon: UtensilsCrossed },
    { id: "drink", label: "Đồ uống & Cafe", icon: Coffee },
    { id: "flower", label: "Hoa tươi tự gói", icon: Flower2 },
    { id: "combo", label: "Combo 17/10", icon: Gift },
  ];

  const filteredProducts =
    activeTab === "all"
      ? PRODUCTS
      : PRODUCTS.filter((item) => item.category === activeTab);

  return (
    <section id="shop" className="mx-auto max-w-7xl w-full overflow-hidden px-5 py-16 md:px-10 lg:py-24">
      {/* Title & Delivery Notice */}
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-[#df8143]">
            Gian hàng sẻ chia
          </p>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-[var(--brand-heading)] font-serif">
            Mua một món nhỏ,<br />
            <span className="text-[#df8143]">góp một công lớn.</span>
          </h2>
        </div>

        {/* Delivery / Closure Notice Card */}
        <aside
          aria-label="Lưu ý gian hàng"
          className="flex max-w-md items-start gap-3.5 rounded-2xl border border-[var(--brand-border)] bg-[var(--brand-surface-alt)] p-4 text-xs sm:text-sm leading-relaxed text-[var(--brand-heading)] shadow-sm"
        >
          {CAMPAIGN_INFO.isEnded ? (
            <>
              <Calendar className="mt-0.5 size-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
              <div>
                <p className="font-semibold">
                  Hoạt động bán hàng gây quỹ đã <strong>hoàn tất</strong> vào ngày 17/10/2026.
                </p>
                <p className="mt-1 text-xs text-[var(--brand-muted)]">
                  Nguồn lực thu được từ các đơn hàng sẽ được tổng hợp để cùng Câu lạc bộ thực hiện hoạt động tri ân.
                </p>
              </div>
            </>
          ) : (
            <>
              <MapPin className="mt-0.5 size-5 shrink-0 text-[#df8143]" />
              <div>
                <p>
                  Chỉ giao hàng tại khuôn viên trường <strong>Đại học FPT cơ sở TP.HCM</strong>.
                </p>
                <p className="mt-1 text-xs text-[var(--brand-muted)] flex items-center gap-1">
                  <Calendar className="size-3.5 text-[#315444]" />
                  Mở bán đợt 1: <strong>13/10/2026</strong> · Sự kiện chính: <strong>17/10/2026</strong>.
                </p>
              </div>
            </>
          )}
        </aside>
      </div>

      {/* Category Filter Tabs */}
      <div className="mb-8 flex flex-wrap gap-2 sm:gap-2.5 overflow-x-auto pb-2">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isActive = activeTab === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveTab(cat.id as ProductCategory)}
              className={`inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-xs sm:text-sm font-semibold transition active:scale-95 ${
                isActive
                  ? "bg-[#315444] text-white shadow-md shadow-[#315444]/20"
                  : "border border-[var(--brand-border)] bg-[var(--brand-surface)] text-[var(--brand-muted)] hover:border-[#315444] hover:text-[var(--brand-heading)]"
              }`}
            >
              <Icon className={`size-4 ${isActive ? "text-[#e6b057]" : "text-[#df8143]"}`} />
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Combo Special Pre-order Callout */}
      {activeTab === "combo" && (
        <div className="mb-8 overflow-hidden rounded-3xl border border-[#df8143]/30 bg-gradient-to-r from-[#fff4eb] via-[#fdf6ec] to-[#f4ebe1] dark:from-[#2a1d17] dark:via-[#222720] dark:to-[#1a251f] p-5 sm:p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <span className="flex size-11 items-center justify-center rounded-2xl bg-[#df8143] text-white shadow-md shadow-[#df8143]/30 shrink-0">
                <Gift className="size-6" />
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <span className="rounded-md bg-[#df8143]/20 px-2 py-0.5 text-[11px] font-extrabold uppercase tracking-wide text-[#b93815] dark:text-[#f39c5b]">
                    Đặc Quyền Đặt Trước 17/10
                  </span>
                  <span className="text-xs text-[var(--brand-muted)] font-medium">Số lượng quà có hạn</span>
                </div>
                <h3 className="mt-1 text-base sm:text-lg font-bold text-[var(--brand-heading)]">
                  Đặt trước Combo — Tặng ngay đến <span className="text-[#df8143]">3 Bịch Bánh Tráng Ngũ Vị</span>!
                </h3>
                <p className="mt-1 text-xs sm:text-sm text-[var(--brand-muted)] leading-relaxed">
                  • <strong>Combo 1 &amp; 2:</strong> Tặng kèm <strong>2 bịch bánh tráng ngũ vị</strong> thơm ngon.<br className="hidden sm:inline" />
                  {" "}• <strong>Combo 3 &amp; 4:</strong> Tặng kèm <strong>3 bịch bánh tráng ngũ vị</strong> thơm ngon.
                </p>
              </div>
            </div>
            <div className="shrink-0 self-end sm:self-center">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--brand-border)] bg-[var(--brand-surface)] px-3 py-1.5 text-xs font-semibold text-[var(--brand-muted)] shadow-sm">
                💡 Nhận quà tặng trực tiếp khi giao hàng
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Products Grid */}
      <div className="grid gap-5 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
