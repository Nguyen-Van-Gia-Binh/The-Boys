"use client";

import React, { useState } from "react";
import { MapPin, Calendar, Sparkles, Coffee, UtensilsCrossed, Flower2, Gift } from "lucide-react";
import { PRODUCTS } from "@/data/campaign";
import { ProductCard } from "@/components/ProductCard";
import { ProductCategory } from "@/types";

export default function ShopSection() {
  const [activeTab, setActiveTab] = useState<ProductCategory>("all");

  const categories = [
    { id: "all", label: "Tất cả món", icon: Sparkles },
    { id: "snack", label: "Bánh tráng ăn vặt", icon: UtensilsCrossed },
    { id: "drink", label: "Đồ uống & Cafe", icon: Coffee },
    { id: "flower", label: "Hoa tươi 20/10", icon: Flower2 },
    { id: "combo", label: "Combo Workshop 17/10", icon: Gift },
  ];

  const filteredProducts =
    activeTab === "all"
      ? PRODUCTS
      : PRODUCTS.filter((item) => item.category === activeTab);

  return (
    <section id="shop" className="mx-auto max-w-7xl px-5 py-16 md:px-10 lg:py-24">
      {/* Title & Delivery Notice */}
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-[#df8143]">
            Gian hàng sẻ chia
          </p>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[var(--brand-heading)] font-serif">
            Mua một món nhỏ,<br />
            <span className="text-[#df8143]">góp một công lớn.</span>
          </h2>
        </div>

        {/* Delivery Notice Card */}
        <aside
          aria-label="Lưu ý giao hàng"
          className="flex max-w-md items-start gap-3.5 rounded-2xl border border-[var(--brand-border)] bg-[var(--brand-surface-alt)] p-4 text-xs sm:text-sm leading-relaxed text-[var(--brand-heading)] shadow-sm"
        >
          <MapPin className="mt-0.5 size-5 shrink-0 text-[#df8143]" />
          <div>
            <p>
              Nhận giao hàng tại: <strong>ĐH FPT TP.HCM</strong>, <strong>KTX</strong> và <strong>Vinhomes Grand Park</strong>.
            </p>
            <p className="mt-1 text-xs text-[var(--brand-muted)] flex items-center gap-1">
              <Calendar className="size-3.5 text-[#315444]" />
              Mở bán đợt 1: <strong>13/10/2026</strong> · Sự kiện chính: <strong>17/10/2026</strong>.
            </p>
          </div>
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

      {/* Products Grid */}
      <div className="grid gap-5 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
