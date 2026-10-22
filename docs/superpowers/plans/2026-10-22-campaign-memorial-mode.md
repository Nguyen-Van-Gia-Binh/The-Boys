# Campaign Memorial & Archive Mode Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform the "The Boys - Hành Trình Dòng Nước Về Nguồn" web application into an elegant Memorial & Hall of Fame archive that disables new orders and bank transfers while preserving all memories, product showcase, donor leaderboard, certificates, and order history.

**Architecture:** 
- Centralize closure state with `isEnded: true` and archive metadata in `CAMPAIGN_INFO` (`src/data/campaign.ts`).
- Introduce a celebratory top banner (`MemorialBanner.tsx`) announcing successful campaign completion on 17/10/2026.
- Convert `ProductCard.tsx` into exhibition/memory mode with disabled ordering, and update `CartDrawer.tsx` to announce closed checkout while guiding users to order lookup.
- Transform `DonationSection.tsx` into a pure Hall of Fame & Certificate hub by removing the QR/bank details and payment form while keeping the leaderboard and certificate generator 100% active.
- Protect `/api/orders` and `/api/donate` with backend submission guards.

**Tech Stack:** Next.js 14 (App Router), React, TypeScript, Tailwind CSS, Lucide React, Google Apps Script integration.

**Spec:** User consultation on 2026-10-22 agreeing to "Lưu niệm hoàn thiện" (Memorial Mode) instead of only blanking out bank account numbers.

---

## Global Constraints

- Never break existing order lookup functionality (`/api/orders/lookup` and `OrderLookup.tsx`).
- Preserve donor leaderboard data fetching (`/api/donate` GET) from Google Sheets so donors still see their names on the Hall of Fame.
- Keep certificate generation (`DonationCertificateModal.tsx`) intact for donors to download their keepsake certificates.
- Do not introduce broken images (VietQR URLs must not be called with empty/invalid account details).
- All changes must pass `npm run build` with zero TypeScript or Next.js build errors.

---

### Task 1: Campaign Configuration & Types

**Files:**
- Modify: `src/data/campaign.ts:3-52`
- Modify: `src/types/index.ts:1-25`

**Interfaces:**
- Consumes: None
- Produces: `CAMPAIGN_INFO.isEnded: boolean`, `CAMPAIGN_INFO.archiveInfo: object`

- [ ] **Step 1: Update `CAMPAIGN_INFO` in `src/data/campaign.ts`**

Add `isEnded` flag and `archiveInfo` to `CAMPAIGN_INFO`:

```typescript
export const CAMPAIGN_INFO = {
  title: "Hành Trình Dòng Nước Về Nguồn",
  slogan: "Góp nắng gửi yêu thương, tri ân ngàn người lính",
  groupName: "The Boys Project — Sinh viên ĐH FPT",
  launchDate: "13/10/2026",
  mainEventDate: "17/10/2026",
  isEnded: true,
  archiveInfo: {
    statusText: "Chiến dịch đã hoàn thành xuất sắc",
    completionDate: "17/10/2026",
    headline: "Hành trình tri ân đã khép lại trọn vẹn yêu thương!",
    message:
      "Toàn bộ hoạt động bán hàng gây quỹ và chương trình trực tiếp trao tặng 20 phần quà tri ân đến các chú thương binh nhiễm chất độc da cam đã hoàn tất tốt đẹp vào ngày 17/10/2026. Website hiện được lưu giữ như một không gian kỷ niệm và tri ân những tấm lòng vàng đã đồng hành cùng The Boys.",
    thankYou: "The Boys xin gửi lời cảm ơn chân thành nhất đến Quý thầy cô, các bạn sinh viên và Quý nhà hảo tâm!",
  },
  orderTarget: 100,
  // ... rest of fields
```

- [ ] **Step 2: Add type definitions in `src/types/index.ts`**

Ensure `CampaignArchiveInfo` is defined or accepted in campaign types:

```typescript
export interface CampaignArchiveInfo {
  statusText: string;
  completionDate: string;
  headline: string;
  message: string;
  thankYou: string;
}
```

- [ ] **Step 3: Verify TypeScript compilation**

Run: `npx tsc --noEmit`
Expected: PASS with 0 errors.

- [ ] **Step 4: Commit**

```bash
git add src/data/campaign.ts src/types/index.ts
git commit -m "feat(campaign): add isEnded flag and archive metadata"
```

---

### Task 2: Backend Submission Protection (API Guards)

**Files:**
- Modify: `src/app/api/orders/route.ts:1-25`
- Modify: `src/app/api/donate/route.ts:100-120`

**Interfaces:**
- Consumes: `CAMPAIGN_INFO.isEnded` from `@/data/campaign`
- Produces: HTTP 403 response on POST attempts when campaign is closed

- [ ] **Step 1: Guard `POST /api/orders`**

In `src/app/api/orders/route.ts`, check `CAMPAIGN_INFO.isEnded` at the start of the POST handler:

```typescript
import { CAMPAIGN_INFO } from "@/data/campaign";

export async function POST(req: NextRequest) {
  try {
    if (CAMPAIGN_INFO.isEnded) {
      return NextResponse.json(
        {
          success: false,
          message: "Chiến dịch đã kết thúc thành công tốt đẹp! Hệ thống đã dừng tiếp nhận đơn hàng mới. Cảm ơn bạn đã luôn quan tâm và đồng hành cùng The Boys.",
        },
        { status: 403 }
      );
    }
    // ... rest of order processing code
```

- [ ] **Step 2: Guard `POST /api/donate`**

In `src/app/api/donate/route.ts`, check `CAMPAIGN_INFO.isEnded` at the start of the POST handler:

```typescript
import { CAMPAIGN_INFO } from "@/data/campaign";

export async function POST(req: NextRequest) {
  try {
    if (CAMPAIGN_INFO.isEnded) {
      return NextResponse.json(
        {
          success: false,
          message: "Chiến dịch gây quỹ đã hoàn thành trọn vẹn và đạt mục tiêu! Hệ thống đã dừng tiếp nhận các lượt ủng hộ mới. Cảm ơn tấm lòng vàng của bạn!",
        },
        { status: 403 }
      );
    }
    // ... rest of donation processing code
```

- [ ] **Step 3: Verify TypeScript compilation**

Run: `npx tsc --noEmit`
Expected: PASS with 0 errors.

- [ ] **Step 4: Commit**

```bash
git add src/app/api/orders/route.ts src/app/api/donate/route.ts
git commit -m "feat(api): guard orders and donate endpoints when campaign is closed"
```

---

### Task 3: Memorial Announcement Banner

**Files:**
- Create: `src/components/MemorialBanner.tsx`
- Modify: `src/app/page.tsx:1-44`
- Modify: `src/components/Hero.tsx:35-58`

**Interfaces:**
- Consumes: `CAMPAIGN_INFO`
- Produces: Top-of-page interactive memorial ribbon and updated Hero CTA buttons

- [ ] **Step 1: Create `src/components/MemorialBanner.tsx`**

A stylish, celebratory banner with emerald/amber gradient, confetti icon, achievement summary, and quick links:

```tsx
"use client";

import React, { useState } from "react";
import { Sparkles, Trophy, Heart, Award, X, CheckCircle2 } from "lucide-react";
import { CAMPAIGN_INFO } from "@/data/campaign";

export default function MemorialBanner() {
  const [dismissed, setDismissed] = useState(false);

  if (!CAMPAIGN_INFO.isEnded || dismissed) return null;

  return (
    <div className="relative isolate overflow-hidden bg-gradient-to-r from-[#1f372c] via-[#315444] to-[#254135] text-white px-4 py-3 sm:py-3.5 shadow-md border-b border-[#df8143]/30">
      <div className="mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
        <div className="flex items-center gap-3">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-[#df8143]/20 border border-[#df8143]/40 text-[#df8143]">
            <Trophy className="size-5 text-[#f39c5b]" />
          </span>
          <div>
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-[#df8143] px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-white">
                <CheckCircle2 className="size-3" /> Hoàn thành
              </span>
              <p className="text-xs sm:text-sm font-bold text-white">
                Chiến dịch &ldquo;Hành Trình Dòng Nước Về Nguồn&rdquo; đã hoàn thành xuất sắc!
              </p>
            </div>
            <p className="text-[11px] sm:text-xs text-[#d3e2d8] mt-0.5 line-clamp-1">
              {CAMPAIGN_INFO.archiveInfo.headline} Trang web hiện được lưu giữ làm không gian kỷ niệm &amp; vinh danh tri ân.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <a
            href="#donate"
            className="inline-flex items-center gap-1.5 rounded-full bg-[#df8143] px-3.5 py-1.5 text-xs font-bold text-white shadow-sm hover:bg-[#c96e32] transition active:scale-95"
          >
            <Heart className="size-3.5 fill-current" />
            <span>Bảng vàng tri ân</span>
          </a>
          <button
            type="button"
            onClick={() => setDismissed(true)}
            className="p-1 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition"
            title="Đóng thông báo"
          >
            <X className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Mount `MemorialBanner` in `src/app/page.tsx`**

Place `MemorialBanner` directly under `<Header />` inside the main layout.

- [ ] **Step 3: Update Hero CTAs in `src/components/Hero.tsx`**

When `CAMPAIGN_INFO.isEnded` is true:
- First button: "Xem menu kỷ niệm" (links to `#shop`) with Store/Eye icon.
- Second button: "Bảng vàng tri ân" (links to `#donate`) with Heart/Trophy icon.
- Third button: "Kỷ niệm 17/10" (links to `#journey` or `#about`).

- [ ] **Step 4: Verify in browser / TypeScript**

Run: `npx tsc --noEmit`
Expected: PASS with 0 errors.

- [ ] **Step 5: Commit**

```bash
git add src/components/MemorialBanner.tsx src/app/page.tsx src/components/Hero.tsx
git commit -m "feat(ui): add memorial announcement banner and update hero CTAs"
```

---

### Task 4: Product Showcase in Archive Mode

**Files:**
- Modify: `src/components/ProductCard.tsx:23-28`, `src/components/ProductCard.tsx:151-174`
- Modify: `src/components/ShopSection.tsx:1-40`

**Interfaces:**
- Consumes: `CAMPAIGN_INFO.isEnded`
- Produces: Read-only product cards with "Chiến dịch đã khép lại" badges instead of active cart buttons

- [ ] **Step 1: Update `ProductCard.tsx`**

Import `CAMPAIGN_INFO` from `@/data/campaign`.
When `CAMPAIGN_INFO.isEnded` is true:
- In `handleAdd`: disable addition (or no-op).
- In the button section (lines 151-174):
  Instead of "Thêm vào giỏ", render:
  ```tsx
  {CAMPAIGN_INFO.isEnded ? (
    <div className="flex w-full items-center justify-center gap-1.5 rounded-2xl py-2.5 px-3 border border-[var(--brand-border)] bg-[var(--brand-surface-alt)] text-xs font-semibold text-[var(--brand-muted)] select-none">
      <CheckCircle2 className="size-3.5 text-emerald-600 dark:text-emerald-400" />
      <span>Chiến dịch đã kết thúc</span>
    </div>
  ) : (
    <button
      type="button"
      onClick={handleAdd}
      // ... existing button code
    </button>
  )}
  ```

- [ ] **Step 2: Update `ShopSection.tsx` description**

If `CAMPAIGN_INFO.isEnded` is true, update the section subtitle to indicate this is the commemorative menu that contributed to the 20 charity gifts.

- [ ] **Step 3: Verify TypeScript compilation**

Run: `npx tsc --noEmit`
Expected: PASS with 0 errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/ProductCard.tsx src/components/ShopSection.tsx
git commit -m "feat(shop): switch product cards to exhibition mode when ended"
```

---

### Task 5: Cart Drawer & Mobile Bottom Nav Update

**Files:**
- Modify: `src/components/CartDrawer.tsx`
- Modify: `src/components/MobileBottomNav.tsx`

**Interfaces:**
- Consumes: `CAMPAIGN_INFO.isEnded`
- Produces: Informative cart state and optimized mobile navigation for memory browsing

- [ ] **Step 1: Update `CartDrawer.tsx`**

When `CAMPAIGN_INFO.isEnded` is true:
- Display a prominent notice card inside the drawer:
  ```tsx
  <div className="rounded-2xl border border-amber-300 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/40 p-4 text-xs text-amber-900 dark:text-amber-200">
    <div className="flex items-center gap-2 font-bold text-amber-800 dark:text-amber-300">
      <AlertCircle className="size-4 shrink-0" />
      <span>Cổng đặt hàng đã đóng</span>
    </div>
    <p className="mt-1 text-[11.5px] leading-relaxed">
      Chiến dịch đã khép lại thành công vào ngày 17/10/2026. Quý khách có thể xem lại các đơn hàng đã đặt trước đây tại mục Tra cứu đơn.
    </p>
    <button
      type="button"
      onClick={() => {
        setIsCartOpen(false);
        setIsOrdersDrawerOpen(true);
      }}
      className="mt-2.5 inline-flex items-center gap-1.5 font-bold text-[#df8143] underline underline-offset-2 hover:opacity-80"
    >
      Tra cứu đơn hàng của tôi &rarr;
    </button>
  </div>
  ```
- Disable checkout buttons, and prevent the multi-step checkout form from initiating.

- [ ] **Step 2: Update `MobileBottomNav.tsx`**

When `CAMPAIGN_INFO.isEnded` is true:
- Tab 1: "Trang chủ"
- Tab 2: "Gian hàng"
- Tab 3: "Đơn của tôi" (Keep `setIsOrdersDrawerOpen(true)` so customers can look up past orders)
- Tab 4: Change from "Giỏ hàng" to "Bảng Vàng" (scrolling smoothly to `#donate` with `Heart` icon) to highlight the Hall of Fame.

- [ ] **Step 3: Verify TypeScript compilation**

Run: `npx tsc --noEmit`
Expected: PASS with 0 errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/CartDrawer.tsx src/components/MobileBottomNav.tsx
git commit -m "feat(cart): update cart drawer notice and switch mobile nav tab to leaderboard"
```

---

### Task 6: Donation Section Transformation (Hall of Fame & Certificates)

**Files:**
- Modify: `src/components/DonationSection.tsx`

**Interfaces:**
- Consumes: `CAMPAIGN_INFO.isEnded`, `CAMPAIGN_INFO.archiveInfo`
- Produces: Closed transfer box with thank-you card, retaining full interactive Leaderboard and Certificate download

- [ ] **Step 1: Replace Donation transfer & QR form with Commemorative Completion Card**

In `src/components/DonationSection.tsx`:
When `CAMPAIGN_INFO.isEnded` is true:
- Hide the live donation input steps (Step 1 Chọn số tiền, Step 2 Nhập lời chúc, Step 3 Quét QR VietQR & STK ngân hàng).
- In their place, display a celebratory "Thành Tựu & Tri Ân" card:
  - 100% Goal Reached badge (20/20 Quà tri ân).
  - Total amount raised from donors.
  - Heartfelt thank-you message from The Boys.
  - Button: "Tìm tên & Tải Giấy Chứng Nhận Tri Ân" (which opens the certificate modal or focuses on the leaderboard).

- [ ] **Step 2: Keep Bảng Vàng (Hall of Fame) 100% functional**

Ensure:
- Live fetching from Google Sheets tab `Donations` remains active.
- Donors can search their name/message.
- Clicking on a donor card allows generating and downloading the "Chứng Nhận Tấm Lòng Vàng" PNG via `DonationCertificateModal.tsx`.

- [ ] **Step 3: Verify TypeScript compilation**

Run: `npx tsc --noEmit`
Expected: PASS with 0 errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/DonationSection.tsx
git commit -m "feat(donations): transform donation section into celebratory hall of fame and certificate hub"
```

---

### Task 7: Full Verification & Build Validation

**Files:**
- Entire codebase

- [ ] **Step 1: Run typecheck**

Run: `npx tsc --noEmit`
Expected: 0 errors.

- [ ] **Step 2: Run production Next.js build**

Run: `npm run build`
Expected: Build succeeds with all pages static/dynamic correctly generated.

- [ ] **Step 3: Final verification check**
- Ensure website shows the Memorial Banner.
- Ensure no QR code with missing bank account is shown.
- Ensure products cannot be added to cart.
- Ensure Bảng Vàng and Tra Cứu Đơn are easily accessible.

- [ ] **Step 4: Commit final changes**

```bash
git add .
git commit -m "chore: complete campaign memorial mode setup"
```
