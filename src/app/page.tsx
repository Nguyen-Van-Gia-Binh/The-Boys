"use client";

import React from "react";
import { CartProvider } from "@/context/CartContext";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import ShopSection from "@/components/ShopSection";
import AboutSection from "@/components/AboutSection";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import CustomerOrdersDrawer from "@/components/CustomerOrdersDrawer";

export default function Home() {
  return (
    <CartProvider>
      <div className="min-h-screen bg-[var(--brand-bg)] text-[var(--brand-text)] flex flex-col selection:bg-[#df8143] selection:text-white">
        {/* Navigation Bar */}
        <Header />

        {/* Main Content Sections */}
        <main className="flex-1">
          <Hero />
          <ShopSection />
          <AboutSection />
        </main>

        {/* Footer */}
        <Footer />

        {/* Cart & Checkout Slide-over Drawer */}
        <CartDrawer />

        {/* Customer Orders Slide-over Drawer */}
        <CustomerOrdersDrawer />
      </div>
    </CartProvider>
  );
}
