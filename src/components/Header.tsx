"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Sun, Moon, ShoppingBag, Menu, X, Heart, Search, User, Package } from "lucide-react";
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
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 md:px-10">
        {/* Logo */}
        <a href="#top" className="flex items-center gap-2.5 group">
          <span className="flex size-10 items-center justify-center rounded-full bg-[#315444] text-[#f4f7f5] shadow-sm transition-transform group-hover:scale-105">
            <Heart className="size-5 fill-[#e6b057] text-[#e6b057]" />
          </span>
          <span className="flex flex-col">
            <span className="text-lg font-bold tracking-tight text-[var(--brand-heading)] flex items-center">
              Dòng Nước Về Nguồn<span className="text-[#df8143]">.</span>
            </span>
            <span className="text-[11px] font-medium text-[var(--brand-muted)] tracking-wide">
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
          <button
            type="button"
            onClick={() => setIsOrdersDrawerOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#315444]/10 text-[#315444] dark:text-[#a8bf9e] hover:bg-[#315444]/20 font-semibold transition"
          >
            <Package className="size-3.5" />
            <span>{customerPhone ? `Đơn của tôi (${customerPhone.slice(-4)})` : "Đơn của tôi"}</span>
          </button>
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="flex size-10 items-center justify-center rounded-full border border-[var(--brand-border)] bg-[var(--brand-surface)] text-[var(--brand-heading)] transition hover:bg-[var(--brand-surface-alt)] shadow-sm"
            aria-label="Đổi giao diện sáng/tối"
            title={isDark ? "Chuyển sang giao diện sáng" : "Chuyển sang giao diện tối"}
          >
            {isDark ? <Sun className="size-4 text-[#e6b057]" /> : <Moon className="size-4 text-[#315444]" />}
          </button>

          {/* User / My Orders Button (Hiện cả Mobile và Desktop) */}
          <button
            onClick={() => setIsOrdersDrawerOpen(true)}
            className="relative flex h-10 items-center gap-1.5 rounded-full border border-[var(--brand-border)] bg-[var(--brand-surface)] px-2.5 sm:px-3.5 text-xs sm:text-sm font-semibold text-[var(--brand-heading)] hover:bg-[var(--brand-surface-alt)] shadow-sm active:scale-95 transition"
            aria-label="Đơn hàng của tôi"
            title="Đơn hàng của tôi"
          >
            <User className="size-4 text-[#315444] dark:text-[#a8bf9e]" />
            <span className="hidden sm:inline">
              {customerPhone ? "Đơn của tôi" : "Đăng nhập"}
            </span>
            {customerPhone && (
              <span className="flex size-2 rounded-full bg-emerald-500 animate-pulse" title="Đã lưu SĐT" />
            )}
          </button>

          {/* Cart Button */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative flex h-10 items-center gap-2 rounded-full bg-[#315444] px-3.5 sm:px-4 text-sm font-semibold text-[#f8f5ef] transition hover:bg-[#243e33] shadow-md hover:shadow-lg active:scale-95"
            aria-label="Giỏ hàng"
          >
            <ShoppingBag className="size-4" />
            <span className="hidden sm:inline">Giỏ hàng</span>
            {totalQuantity > 0 && (
              <span className="flex size-5 items-center justify-center rounded-full bg-[#df8143] text-[11px] font-bold text-white shadow-sm animate-pulse">
                {totalQuantity}
              </span>
            )}
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex md:hidden size-10 items-center justify-center rounded-full border border-[var(--brand-border)] bg-[var(--brand-surface)] text-[var(--brand-heading)]"
            aria-label="Menu"
          >
            {mobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[var(--brand-border)] bg-[var(--brand-surface)] px-4 py-4 space-y-2.5 animate-in slide-in-from-top-2 duration-200">
          {/* Nút Đơn hàng của tôi nổi bật trên mobile menu */}
          <button
            type="button"
            onClick={() => {
              setMobileMenuOpen(false);
              setIsOrdersDrawerOpen(true);
            }}
            className="w-full flex items-center justify-between rounded-xl p-3 text-sm font-bold text-[#315444] dark:text-[#a8bf9e] bg-[#315444]/10 hover:bg-[#315444]/20 transition"
          >
            <span className="flex items-center gap-2">
              <Package className="size-4 text-[#df8143]" />
              <span>Đơn hàng của tôi {customerPhone ? `(${customerPhone})` : ""}</span>
            </span>
            <span className="text-xs bg-[#315444] text-white px-2.5 py-1 rounded-full font-semibold">
              Xem ngay
            </span>
          </button>

          <a
            href="#about"
            onClick={() => setMobileMenuOpen(false)}
            className="block rounded-lg px-3 py-2 text-sm font-medium text-[var(--brand-text)] hover:bg-[var(--brand-surface-alt)]"
          >
            Về dự án
          </a>
          <a
            href="#shop"
            onClick={() => setMobileMenuOpen(false)}
            className="block rounded-lg px-3 py-2 text-sm font-medium text-[var(--brand-text)] hover:bg-[var(--brand-surface-alt)]"
          >
            Gian hàng sẻ chia
          </a>
          <a
            href="#journey"
            onClick={() => setMobileMenuOpen(false)}
            className="block rounded-lg px-3 py-2 text-sm font-medium text-[var(--brand-text)] hover:bg-[var(--brand-surface-alt)]"
          >
            Hành trình tri ân
          </a>
          <a
            href="#contact"
            onClick={() => setMobileMenuOpen(false)}
            className="block rounded-lg px-3 py-2 text-sm font-medium text-[var(--brand-text)] hover:bg-[var(--brand-surface-alt)]"
          >
            Liên hệ nhóm
          </a>

          <Link
            href="/tra-cuu"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-[var(--brand-muted)] hover:bg-[var(--brand-surface-alt)] border-t border-[var(--brand-border)] pt-3"
          >
            <Search className="size-4" />
            <span>Trang tra cứu đơn hàng chi tiết</span>
          </Link>
        </div>
      )}
    </header>
  );
}
