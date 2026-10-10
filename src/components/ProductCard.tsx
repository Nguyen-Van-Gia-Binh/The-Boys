"use client";

import React, { useState } from "react";
import { Plus, Check, Sparkles } from "lucide-react";
import { Product } from "@/types";
import { useCart } from "@/context/CartContext";

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

  const handleAdd = () => {
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
        {product.isCombo && (
          <span className="absolute right-3 top-3 rounded-full bg-[#315444] px-2.5 py-1 text-[11px] font-bold text-white shadow-md">
            Workshop 17/10
          </span>
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

        {/* Size Selector if exists */}
        {hasSizes && (
          <div className="mt-3 flex items-center gap-2">
            <span className="text-[11px] font-semibold text-[var(--brand-muted)]">Chọn size:</span>
            <div className="flex gap-1.5">
              {product.options!.sizes!.map((size, idx) => (
                <button
                  key={size.name}
                  type="button"
                  onClick={() => setSelectedSizeIdx(idx)}
                  className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
                    selectedSizeIdx === idx
                      ? "bg-[#315444] text-white shadow-sm"
                      : "border border-[var(--brand-border)] bg-[var(--brand-surface-alt)] text-[var(--brand-text)] hover:border-[#315444]"
                  }`}
                >
                  {size.name} ({size.price.toLocaleString("vi-VN")}đ)
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Add to Cart button */}
        <div className="mt-5 pt-2">
          <button
            type="button"
            onClick={handleAdd}
            className={`flex w-full items-center justify-center gap-2 rounded-2xl py-3 text-sm font-semibold transition active:scale-95 ${
              isAdded
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
        </div>
      </div>
    </div>
  );
}
export default ProductCard;
