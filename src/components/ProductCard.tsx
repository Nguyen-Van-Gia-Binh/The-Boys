"use client";

import React, { useState } from "react";
import { Plus, Check, Sparkles, Gift, ChevronDown, Calendar, MapPin, CheckCircle2 } from "lucide-react";
import { Product } from "@/types";
import { useCart } from "@/context/CartContext";
import { CAMPAIGN_INFO } from "@/data/campaign";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const [selectedSizeIdx, setSelectedSizeIdx] = useState<number>(0);
  const [isAdded, setIsAdded] = useState(false);

  const hasSizes = product.options?.sizes && product.options.sizes.length > 0;
  const currentSize = hasSizes ? product.options!.sizes![selectedSizeIdx] : undefined;
  const displayPrice = currentSize ? currentSize.price : product.price;

  const isFlowerOrCombo = product.category === "flower" || product.category === "combo" || product.isCombo;

  const handleAdd = () => {
    if (CAMPAIGN_INFO.isEnded) return;
    addToCart(product, currentSize);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1200);
  };

  return (
    <div className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-[var(--brand-border)] bg-[var(--brand-surface)] p-3.5 sm:p-4 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      {/* Product Image Box */}
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-[var(--brand-surface-alt)]">
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />

        {/* Badge */}
        {product.badge && (
          <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-[#df8143] px-2.5 py-1 text-[11px] font-bold text-white shadow-md">
            <Sparkles className="size-3" />
            {product.badge}
          </span>
        )}

        {/* Combo indicator */}
        {product.isCombo ? (
          <span className="absolute right-3 top-3 rounded-full bg-[#315444] px-2.5 py-1 text-[11px] font-bold text-white shadow-md">
            Combo 17/10
          </span>
        ) : product.category === "flower" ? (
          <span className="absolute right-3 top-3 rounded-full bg-[#df8143] px-2.5 py-1 text-[11px] font-bold text-white shadow-md">
            Nhận 17/10
          </span>
        ) : null}

        {/* Combo pre-order gift ribbon */}
        {product.comboGift && (
          <div className="absolute bottom-2 inset-x-2 rounded-xl bg-gradient-to-r from-[#c44719] via-[#df8143] to-[#c44719] px-2 py-1.5 text-center text-[11px] font-extrabold text-white shadow-lg backdrop-blur-sm flex items-center justify-center gap-1.5 animate-pulse">
            <Gift className="size-3.5 shrink-0" />
            <span>ĐẶT TRƯỚC: TẶNG {product.comboGift.quantity} BỊCH BÁNH TRÁNG NGŨ VỊ</span>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="mt-4 flex flex-1 flex-col">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-base sm:text-lg font-bold text-[var(--brand-heading)] leading-snug group-hover:text-[#df8143] transition">
            {product.name}
          </h3>
          <span className="shrink-0 text-base sm:text-lg font-extrabold text-[#df8143]">
            {displayPrice.toLocaleString("vi-VN")}đ
          </span>
        </div>

        {/* Note / Description */}
        <p className="mt-2 text-xs leading-relaxed text-[var(--brand-muted)] line-clamp-3">
          {product.note}
        </p>

        {/* Thông tin nhận hàng đặc thù cho Hoa & Combo */}
        {isFlowerOrCombo && (
          <div className="mt-2.5 flex items-center gap-1.5 rounded-xl border border-rose-200/80 dark:border-rose-900/50 bg-rose-50/70 dark:bg-rose-950/30 px-2.5 py-1.5 text-[11px] font-semibold text-rose-700 dark:text-rose-300">
            <Calendar className="size-3.5 shrink-0 text-rose-500" />
            <span>Nhận <strong>17/10</strong> tại <strong>Sảnh lầu 2</strong> (từ 8h sáng)</span>
          </div>
        )}

        {/* Combo Pre-Order Benefit Box */}
        {product.comboGift && (
          <div className="mt-3 rounded-2xl border border-[#df8143]/30 bg-[#df8143]/10 dark:bg-[#df8143]/15 p-2.5 text-xs text-[var(--brand-heading)]">
            <div className="flex items-center gap-1.5 font-bold text-[#b93815] dark:text-[#f39c5b]">
              <Gift className="size-3.5 shrink-0" />
              <span>Đặc quyền đặt trước 17/10:</span>
            </div>
            <p className="mt-1 text-[11.5px] leading-relaxed text-[var(--brand-text)] font-medium">
              Tặng kèm <strong className="font-extrabold text-[#b93815] dark:text-[#f39c5b]">+{product.comboGift.quantity} bịch Bánh tráng ngũ vị</strong> (thơm lừng đậm đà, ăn vặt siêu cuốn)!
            </p>
          </div>
        )}

        {/* Size / Option Selector if exists */}
        {hasSizes && (
          <div className="mt-3 space-y-1.5">
            <label className="block text-[11px] font-semibold text-[var(--brand-muted)]">
              Chọn biến thể / số bông:
            </label>
            {product.options!.sizes!.length <= 2 ? (
              <div className="grid grid-cols-2 gap-2">
                {product.options!.sizes!.map((size, idx) => (
                  <button
                    key={size.name}
                    type="button"
                    onClick={() => setSelectedSizeIdx(idx)}
                    className={`rounded-xl py-2 px-2 text-xs font-semibold text-center transition ${selectedSizeIdx === idx
                        ? "bg-[#315444] text-white shadow-sm ring-1 ring-[#315444]"
                        : "border border-[var(--brand-border)] bg-[var(--brand-surface-alt)] text-[var(--brand-text)] hover:border-[#315444]"
                      }`}
                  >
                    <span className="block truncate">{size.name}</span>
                    <span className="block text-[11px] font-bold mt-0.5 opacity-90">
                      {size.price.toLocaleString("vi-VN")}đ
                    </span>
                  </button>
                ))}
              </div>
            ) : (
              <div className="relative">
                <select
                  value={selectedSizeIdx}
                  onChange={(e) => setSelectedSizeIdx(Number(e.target.value))}
                  className="w-full appearance-none rounded-xl border border-[var(--brand-border)] bg-[var(--brand-surface-alt)] py-2.5 pl-3 pr-8 text-xs font-semibold text-[var(--brand-heading)] outline-none focus:border-[#315444] focus:ring-1 focus:ring-[#315444] transition cursor-pointer"
                >
                  {product.options!.sizes!.map((size, idx) => (
                    <option key={size.name} value={idx}>
                      {size.name} — {size.price.toLocaleString("vi-VN")}đ
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2.5 text-[var(--brand-muted)]">
                  <ChevronDown className="size-4" />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Add to Cart button */}
        <div className="mt-5 pt-2">
          {CAMPAIGN_INFO.isEnded ? (
            <div className="flex w-full items-center justify-center gap-1.5 rounded-2xl py-3 px-3 border border-[var(--brand-border)] bg-[var(--brand-surface-alt)] text-xs font-semibold text-[var(--brand-muted)] select-none">
              <CheckCircle2 className="size-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>Chiến dịch đã khép lại</span>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleAdd}
              className={`flex w-full items-center justify-center gap-2 rounded-2xl py-3 text-sm font-semibold transition active:scale-95 ${isAdded
                  ? "bg-[#315444] text-white shadow-md"
                  : "border border-[var(--brand-border)] bg-[var(--brand-surface-alt)] text-[var(--brand-heading)] hover:border-[#315444] hover:bg-[#315444] hover:text-white"
                }`}
            >
              {isAdded ? (
                <>
                  <Check className="size-4" />
                  Đã thêm vào giỏ!
                </>
              ) : (
                <>
                  <Plus className="size-4" />
                  Thêm vào giỏ
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
export default ProductCard;
