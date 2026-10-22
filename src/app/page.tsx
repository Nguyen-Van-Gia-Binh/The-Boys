"use client";

import React from "react";
import { CartProvider } from "@/context/CartContext";
import Header from "@/components/Header";
import MemorialBanner from "@/components/MemorialBanner";
import Hero from "@/components/Hero";
import ShopSection from "@/components/ShopSection";
import DonationSection from "@/components/DonationSection";
import AboutSection from "@/components/AboutSection";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import CustomerOrdersDrawer from "@/components/CustomerOrdersDrawer";
import MobileBottomNav from "@/components/MobileBottomNav";

export default function Home() {
  return (
    <CartProvider>
      <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-[var(--brand-bg)] text-[var(--brand-text)] flex flex-col pb-20 md:pb-0 selection:bg-[#df8143] selection:text-white">
        {/* Navigation Bar */}
        <Header />

        {/* Main Content Sections */}
        <main className="flex-1 w-full max-w-full pt-[62px] sm:pt-[72px]">
          <MemorialBanner />
          <Hero />
          <ShopSection />
          <DonationSection />
          <AboutSection />
        </main>

        {/* Footer */}
        <Footer />

        {/* Fixed Mobile Bottom Navigation Bar */}
        <MobileBottomNav />

        {/* Cart & Checkout Slide-over Drawer */}
        <CartDrawer />

        {/* Customer Orders Slide-over Drawer */}
        <CustomerOrdersDrawer />
      </div>
    </CartProvider>
  );
}
