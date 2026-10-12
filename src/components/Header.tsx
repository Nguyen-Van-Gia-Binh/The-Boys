"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Sun, Moon, ShoppingBag, Menu, X, Heart, Search, User, Sparkles, Store, Calendar, PhoneCall } from "lucide-react";
import { useCart } from "@/context/CartContext";

export default function Header() {
  const {
    totalQuantity,
    setIsCartOpen,
    customerPhone,
    setIsOrdersDrawerOpen,
  } = useCart();
  const [isDark, setIsDark] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const isDarkTheme = document.documentElement.classList.contains("dark");
    setIsDark(isDarkTheme);
  }, []);

  const toggleTheme = () => {
    const newDark = !isDark;
    setIsDark(newDark);
    if (newDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-[var(--brand-surface-glass)] border-b border-[var(--brand-border)] transition-colors">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 md:px-10 py-3.5 sm:py-4">
        {/* Logo */}
        <a href="#top" className="flex items-center gap-2 sm:gap-2.5 group min-w-0">
          <span className="flex size-9 sm:size-10 items-center justify-center rounded-full bg-[#315444] text-[#f4f7f5] shadow-sm transition-transform group-hover:scale-105 shrink-0">
            <Heart className="size-4.5 sm:size-5 fill-[#e6b057] text-[#e6b057]" />
          </span>
          <span className="flex flex-col min-w-0">
            <span className="text-base sm:text-lg font-bold tracking-tight text-[var(--brand-heading)] flex items-center truncate">
              Dòng Nước Về Nguồn<span className="text-[#df8143]">.</span>
            </span>
            <span className="text-[10px] sm:text-[11px] font-medium text-[var(--brand-muted)] tracking-wide truncate">
              The Boys Project · FPTU
            </span>
          </span>
        </a>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-[var(--brand-muted)]">
          <a href="#about" className="transition hover:text-[#df8143]">
            Về dự án
          </a>
          <a href="#shop" className="transition hover:text-[#df8143]">
            Gian hàng sẻ chia
          </a>
          <a href="#journey" className="transition hover:text-[#df8143]">
            Hành trình tri ân
          </a>
          <a href="#contact" className="transition hover:text-[#df8143]">
            Liên hệ
          </a>
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Theme Toggle (Hiện cả mobile và desktop) */}
          <button
            onClick={toggleTheme}
            className="flex size-9 sm:size-10 items-center justify-center rounded-full border border-[var(--brand-border)] bg-[var(--brand-surface)] text-[var(--brand-heading)] transition hover:bg-[var(--brand-surface-alt)] shadow-sm active:scale-95"
            aria-label="Đổi giao diện sáng/tối"
            title={isDark ? "Chuyển sang giao diện sáng" : "Chuyển sang giao diện tối"}
          >
            {isDark ? <Sun className="size-4 text-[#e6b057]" /> : <Moon className="size-4 text-[#315444]" />}
          </button>

          {/* User / My Orders Button (CHỈ HIỆN TRÊN DESKTOP: hidden md:flex) */}
          <button
            onClick={() => setIsOrdersDrawerOpen(true)}
            className="hidden md:flex relative h-10 items-center gap-1.5 rounded-full border border-[var(--brand-border)] bg-[var(--brand-surface)] px-3.5 text-sm font-semibold text-[var(--brand-heading)] hover:bg-[var(--brand-surface-alt)] shadow-sm active:scale-95 transition"
            aria-label="Đơn hàng của tôi"
            title="Đơn hàng của tôi"
          >
            <User className="size-4 text-[#315444] dark:text-[#a8bf9e]" />
            <span>
              {customerPhone ? "Đơn của tôi" : "Đăng nhập"}
            </span>
            {customerPhone && (
              <span className="flex size-2 rounded-full bg-emerald-500 animate-pulse" title="Đã lưu SĐT" />
            )}
          </button>

          {/* Cart Button (CHỈ HIỆN TRÊN DESKTOP: hidden md:flex) */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="hidden md:flex relative h-10 items-center gap-2 rounded-full bg-[#315444] px-4 text-sm font-semibold text-[#f8f5ef] transition hover:bg-[#243e33] shadow-md hover:shadow-lg active:scale-95"
            aria-label="Giỏ hàng"
          >
            <ShoppingBag className="size-4" />
            <span>Giỏ hàng</span>
            {totalQuantity > 0 && (
              <span className="flex size-5 items-center justify-center rounded-full bg-[#df8143] text-[11px] font-bold text-white shadow-sm animate-pulse">
                {totalQuantity}
              </span>
            )}
          </button>

          {/* Mobile Menu Toggle (Chỉ hiện trên Mobile: flex md:hidden) */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex md:hidden size-9 sm:size-10 items-center justify-center rounded-full border border-[var(--brand-border)] bg-[var(--brand-surface)] text-[var(--brand-heading)] hover:bg-[var(--brand-surface-alt)] transition active:scale-95"
            aria-label="Menu"
          >
            {mobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[var(--brand-border)] bg-[var(--brand-surface)] px-4 py-3.5 space-y-1.5 animate-in slide-in-from-top-2 duration-200 shadow-xl">
          {/* Card trạng thái khách hàng nếu đã lưu SĐT */}
          {customerPhone && (
            <div className="flex items-center justify-between rounded-xl bg-emerald-500/10 border border-emerald-500/20 px-3.5 py-2.5 text-xs font-semibold text-emerald-800 dark:text-emerald-300 mb-2">
              <span className="flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Đã kết nối: <strong>{customerPhone}</strong></span>
              </span>
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  setIsOrdersDrawerOpen(true);
                }}
                className="text-[11px] font-bold underline text-[#315444] dark:text-[#a8bf9e]"
              >
                Mở đơn hàng →
              </button>
            </div>
          )}

          <a
            href="#about"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-semibold text-[var(--brand-heading)] hover:bg-[var(--brand-surface-alt)] active:bg-[var(--brand-border)] transition"
          >
            <Sparkles className="size-4 text-[#df8143]" />
            <span>Về dự án thiện nguyện</span>
          </a>
          <a
            href="#shop"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-semibold text-[var(--brand-heading)] hover:bg-[var(--brand-surface-alt)] active:bg-[var(--brand-border)] transition"
          >
            <Store className="size-4 text-[#315444] dark:text-[#a8bf9e]" />
            <span>Gian hàng sẻ chia</span>
          </a>
          <a
            href="#journey"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-semibold text-[var(--brand-heading)] hover:bg-[var(--brand-surface-alt)] active:bg-[var(--brand-border)] transition"
          >
            <Calendar className="size-4 text-[#df8143]" />
            <span>Hành trình tri ân 17/10</span>
          </a>
          <a
            href="#contact"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-semibold text-[var(--brand-heading)] hover:bg-[var(--brand-surface-alt)] active:bg-[var(--brand-border)] transition"
          >
            <PhoneCall className="size-4 text-[#315444] dark:text-[#a8bf9e]" />
            <span>Liên hệ nhóm The Boys</span>
          </a>

          <div className="border-t border-[var(--brand-border)] pt-2 mt-2">
            <Link
              href="/tra-cuu"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-[var(--brand-muted)] hover:bg-[var(--brand-surface-alt)]"
            >
              <Search className="size-3.5" />
              <span>Trang tra cứu đơn hàng chi tiết</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
