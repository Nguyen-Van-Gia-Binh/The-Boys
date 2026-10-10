# Order Collection Web ("Hành Trình Dòng Nước Về Nguồn") Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Xây dựng website thu đơn trực tuyến và gây quỹ thiện nguyện cho nhóm sinh viên The Boys, lấy cảm hứng từ Nắng Ấm, hỗ trợ giỏ hàng, form đặt hàng đầy đủ trường, tự động tạo mã VietQR và gửi dữ liệu về Google Sheets.

**Architecture:** Sử dụng Next.js (App Router, TypeScript) kết hợp Tailwind CSS cho giao diện mượt mà và responsive. Giỏ hàng và form đặt hàng dạng slide-over drawer lưu trạng thái trong React state + LocalStorage. Backend Next.js API Routes tiếp nhận đơn, kiểm tra dữ liệu và gửi HTTP POST đến Google Apps Script Webhook để tự động ghi đơn vào Google Sheets.

**Tech Stack:** Next.js 14/15, React, TypeScript, Tailwind CSS, Lucide React, VietQR API (`img.vietqr.io`), Google Apps Script.

**Spec:** [docs/superpowers/specs/2026-10-10-order-collection-web-design.md](file:///c:/Users/admin/Documents/A_FPT/Tempory_Project/TheBoys/docs/superpowers/specs/2026-10-10-order-collection-web-design.md)

## Global Constraints
- Nền tảng: Next.js App Router với TypeScript và Tailwind CSS.
- Thiết kế: Tone màu ấm áp (kem be, xanh rừng `#315444`, cam đất `#df8143`), hỗ trợ Dark/Light mode, bo góc mềm mại.
- Menu và sản phẩm: Đúng 100% dữ liệu người dùng cung cấp (Bánh tráng 6k-12k, Cafe 12k-18k, Trà tắc 10k, Hoa tươi 19k-79k, 4 combo workshop 69k-169k).
- Ưu đãi voucher: 59k (10% combo trải nghiệm), 89k (10% all combo 17/10), 149k (15% all combo 17/10).
- Lưu trữ đơn: Google Sheets Webhook qua `/api/orders` (kèm fallback lưu local để test khi chưa gắn Webhook). Không dùng Telegram.

---

### Task 1: Khởi tạo dự án Next.js & Cấu hình Tailwind CSS, Tokens

**Files:**
- Create: `package.json`, `tsconfig.json`, `tailwind.config.ts`, `postcss.config.mjs`, `next.config.mjs`, `src/app/globals.css`, `src/app/layout.tsx`

**Interfaces:**
- Consumes: Node.js môi trường hiện tại
- Produces: Môi trường Next.js chạy được lệnh `npm run dev`, bộ CSS tokens (font Roboto & Serif, dark/light theme classes).

- [ ] **Step 1: Khởi tạo package.json và cài đặt dependencies**
Cài đặt `next`, `react`, `react-dom`, `lucide-react`, `tailwindcss`, `postcss`, `autoprefixer`, `typescript`, `@types/react`, `@types/node`.

- [ ] **Step 2: Cấu hình Tailwind CSS & PostCSS**
Tạo file `tailwind.config.ts` với bảng màu thương hiệu:
  - `brand-bg`: `#faf6f0` (light) / `#121815` (dark)
  - `brand-primary`: `#315444` (xanh rừng)
  - `brand-accent`: `#df8143` (cam nắng)
  - `brand-surface`: `#ffffff` (light) / `#1a241f` (dark)

- [ ] **Step 3: Thiết lập globals.css & Root Layout**
Tạo `src/app/globals.css` với các CSS variables cho theme sáng/tối và `src/app/layout.tsx` thiết lập tiêu đề "Hành Trình Dòng Nước Về Nguồn — The Boys Project".

- [ ] **Step 4: Kiểm tra ứng dụng khởi động thành công**
Chạy `npm run build` hoặc start test để đảm bảo Next.js không có lỗi biên dịch.

- [ ] **Step 5: Commit**
`git add . && git commit -m "chore: initialize Next.js app with Tailwind and design tokens"`

---

### Task 2: Dữ Liệu Chiến Dịch & Menu Sản Phẩm (Types & Data)

**Files:**
- Create: `src/types/index.ts`
- Create: `src/data/campaign.ts`

**Interfaces:**
- Consumes: Global constraints & spec menu
- Produces: `Product[]`, `CAMPAIGN_INFO`, `EARLY_BIRD_VOUCHERS`, hàm tính voucher `getApplicableVoucher(subtotal: number)`.

- [ ] **Step 1: Định nghĩa Types trong `src/types/index.ts`**
  - `Product`: `{ id, name, price, category, note, image, color, isBestSeller, options? }`
  - `CartItem`: `{ product: Product, quantity: number, selectedSize?: string }`
  - `OrderFormData`: `{ name, email, phone, address?, note?, pickupDate, pickupLocation, pickupTime, customPickupTime?, paymentMethod }`
  - `OrderPayload`: `OrderFormData & { items: CartItem[], total: number, discount: number, finalTotal: number, voucherCode?: string }`

- [ ] **Step 2: Khởi tạo `src/data/campaign.ts`**
  - Toàn bộ sản phẩm:
    - Bánh tráng xì ke (6.000đ), Bánh tráng trộn (8.000đ), Bánh tráng giòn sa tế tôm (12.000đ).
    - Cafe đen (12.000đ), Cafe sữa (nhỏ 15.000đ / lớn 18.000đ), Trà tắc Lipton (10.000đ).
    - Hoa tươi 1 bông (19.000đ), 3 bông (49.000đ), 5 bông (79.000đ).
    - Combo Trải Nghiệm (69.000đ), Combo Yêu Thương (89.000đ), Combo Mùi Mẫn (109.000đ), Combo Hạnh Phúc (169.000đ).
  - Thông tin dự án thiện nguyện, 20 phần quà cho các thương binh nhiễm chất độc da cam.
  - Địa điểm nhận: ĐH FPT cơ sở TP.HCM, Ký túc xá, Vinhomes Grand Park.
  - Các khung giờ nhận chuẩn: 08:00 - 09:00, 09:00 - 10:00, 11:00 - 12:00, 13:00 - 14:00, 15:00 - 16:00, 16:00 - 17:00, Tùy chọn.

- [ ] **Step 3: Viết logic tính ưu đãi đặt sớm (Early-Bird Vouchers)**
  - >= 59.000đ: giảm 10% Combo Trải Nghiệm
  - >= 89.000đ: giảm 10% tất cả combo 17/10
  - >= 149.000đ: giảm 15% tất cả combo 17/10

- [ ] **Step 4: Commit**
`git add src/types/index.ts src/data/campaign.ts && git commit -m "feat: add campaign data, menu and voucher logic"`

---

### Task 3: Header, Hero, Banner Khuyến Mãi & Giới Thiệu Dự Án

**Files:**
- Create: `src/components/Header.tsx`
- Create: `src/components/Hero.tsx`
- Create: `src/components/VoucherBanner.tsx`
- Create: `src/components/AboutSection.tsx`
- Create: `src/components/Footer.tsx`

**Interfaces:**
- Consumes: `CAMPAIGN_INFO`, Theme state, Cart count
- Produces: Header cuộn mượt, Hero ấn tượng có social proof counter, Banner ưu đãi 13/10, Mục kể chuyện thiện nguyện 20 phần quà.

- [ ] **Step 1: Tạo Component Header**
  - Logo "Dòng Nước Về Nguồn." với biểu tượng mặt trời / sóng nước.
  - Anchor menu: Về dự án, Gian hàng, Hành trình, Liên hệ.
  - Nút chuyển Dark/Light mode.
  - Nút Giỏ hàng nổi bật có badge số lượng món.

- [ ] **Step 2: Tạo Component Hero**
  - Tiêu đề: *Góp nắng gửi yêu thương — Hành trình dòng nước về nguồn*.
  - Slogan & thông điệp tri ân thương binh.
  - CTA button "Ghé gian hàng" cuộn xuống `#shop`.
  - Social Proof badge: "Đã có 68+ đơn hàng chung tay góp sức".
  - Bố cục ảnh ghép bo góc nghệ thuật.

- [ ] **Step 3: Tạo Component VoucherBanner**
  - Thông báo nổi bật ưu đãi đặt trước ngày 13/10 cho sự kiện 17/10 (tặng voucher 10% - 15%).

- [ ] **Step 4: Tạo Component AboutSection & Footer**
  - Kể câu chuyện chuyến đi thiện nguyện, chi tiết 20 phần quà cho các thương binh (Sữa Ensure, Bánh Solite, Nutifood, thư tri ân).
  - Footer chứa thông tin liên hệ nhóm sinh viên The Boys, hotline, email.

- [ ] **Step 5: Commit**
`git add src/components && git commit -m "feat: add Header, Hero, VoucherBanner, AboutSection and Footer"`

---

### Task 4: Gian Hàng Sản Phẩm & Bộ Lọc Danh Mục (Shop Grid)

**Files:**
- Create: `src/components/ProductCard.tsx`
- Create: `src/components/ShopSection.tsx`

**Interfaces:**
- Consumes: `Product[]` từ `campaign.ts`, `onAddToCart(product, size?)`
- Produces: Gian hàng sản phẩm với bộ lọc danh mục và thông báo giao nhận.

- [ ] **Step 1: Tạo Component ProductCard**
  - Hiển thị ảnh món, tên, giá bán theo định dạng `xx.000đ`.
  - Hiển thị tag mô tả thành phần / quà tặng trong combo.
  - Nếu món có size (như Cafe sữa), cho phép chọn size trước khi bấm thêm vào giỏ.
  - Nút `+ Thêm vào giỏ` kèm animation nhấp nháy phản hồi.

- [ ] **Step 2: Tạo Component ShopSection**
  - Hộp thông báo giao nhận (địa điểm giao tại ĐH FPT, KTX, Vinhomes; ngày mở bán 13/10 & 17/10).
  - Filter Tabs: *Tất cả*, *Đồ ăn vặt*, *Đồ uống*, *Hoa tươi 20/10*, *Combo Workshop 17/10*.
  - Grid danh sách sản phẩm hiển thị chuẩn đẹp trên cả mobile (1-2 cột) và desktop (3-4 cột).

- [ ] **Step 3: Commit**
`git add src/components/ProductCard.tsx src/components/ShopSection.tsx && git commit -m "feat: add ShopSection and ProductCard with category filtering"`

---

### Task 5: Slide-Over Cart Drawer & Tích Hợp VietQR Chuẩn Ảnh Mẫu

**Files:**
- Create: `src/components/CartDrawer.tsx`
- Create: `src/components/VietQRModal.tsx`
- Create: `src/context/CartContext.tsx`

**Interfaces:**
- Consumes: `CartItem[]`, `OrderFormData`, `getApplicableVoucher`
- Produces: Drawer giỏ hàng trượt từ bên phải (100% khớp ảnh người dùng), Form thông tin nhận hàng, sinh mã QR VietQR tự động, tab "Đơn đã đặt".

- [ ] **Step 1: Tạo `CartContext.tsx`**
  - Quản lý state giỏ hàng: `items`, `addToCart`, `updateQuantity`, `removeFromCart`, `clearCart`, `isCartOpen`, `setIsCartOpen`.
  - Tự động lưu giỏ hàng vào `localStorage` để không mất khi tải lại trang.

- [ ] **Step 2: Dựng giao diện Cart Drawer chuẩn theo ảnh chụp người dùng**
  - Tiêu đề "Giỏ hàng" kèm nút `✕`.
  - Tab chuyển: **Giỏ hàng** & **Đơn đã đặt**.
  - Danh sách món trong giỏ kèm bộ tăng giảm số lượng `[ - 1 + ]`.
  - Tạm tính & Tổng tiền tự động cập nhật.
  - Thanh hiển thị tiến độ voucher (ví dụ: *"Mua thêm 15k để được tặng voucher 10%"*).

- [ ] **Step 3: Dựng Form thông tin nhận hàng trong Drawer**
  - *Họ và tên* (bắt buộc)
  - *Email* (bắt buộc)
  - *Số điện thoại* (bắt buộc)
  - *Địa chỉ chi tiết* (textarea, không bắt buộc)
  - *Ghi chú cho đơn hàng* (textarea, không bắt buộc)
  - *Ngày nhận* (input date: min hôm nay)
  - *Địa điểm nhận* (select: ĐH FPT, Vinhomes, KTX)
  - *Khung giờ nhận* (select các khung giờ: 08:00 - 09:00, 09:00 - 10:00, v.v. hoặc Khác)
  - *Phương thức thanh toán:* Radio `Tiền mặt khi nhận hàng` vs `Chuyển khoản ngân hàng`.

- [ ] **Step 4: Tích hợp mã QR VietQR tự động**
  - Khi chọn Chuyển khoản ngân hàng: Tự động hiển thị mã QR VietQR (`https://img.vietqr.io/image/...`) kèm số tiền chính xác, tên chủ tài khoản và nội dung chuyển khoản bắt buộc `[Họ tên] - [SĐT]`.

- [ ] **Step 5: Tab "Đơn đã đặt"**
  - Hiển thị danh sách các đơn mà khách vừa đặt trên thiết bị này kèm mã đơn, thời gian và trạng thái.

- [ ] **Step 6: Commit**
`git add src/context src/components/CartDrawer.tsx src/components/VietQRModal.tsx && git commit -m "feat: implement CartDrawer with checkout form and VietQR support"`

---

### Task 6: API Route Đặt Hàng & Tích Hợp Google Sheets Webhook

**Files:**
- Create: `src/app/api/orders/route.ts`
- Create: `scripts/google-apps-script.js`
- Create: `.env.example`

**Interfaces:**
- Consumes: `POST /api/orders` với JSON `OrderPayload`
- Produces: Gửi HTTP POST tới Google Apps Script Webhook để lưu vào Google Sheets, trả về mã đơn hàng `DH-XXXXX` cho khách.

- [ ] **Step 1: Xây dựng Route Handler `src/app/api/orders/route.ts`**
  - Kiểm tra tính hợp lệ của dữ liệu (Validate tên, SĐT, danh sách món).
  - Tạo mã đơn hàng duy nhất dạng `DH-[timestamp]-[random]`.
  - Gửi dữ liệu qua fetch POST tới biến môi trường `GOOGLE_SHEET_WEBHOOK_URL`.
  - Nếu chưa cấu hình webhook URL: Ghi log console và lưu vào mock buffer, trả về phản hồi thành công để nhóm test website mượt mà.

- [ ] **Step 2: Viết mã nguồn Google Apps Script mẫu `scripts/google-apps-script.js`**
  - Script xử lý `doPost(e)` nhận JSON và tự động nối 1 dòng mới vào Google Sheet:
    `[Mã đơn, Thời gian, Họ tên, SĐT, Email, Ngày nhận, Khung giờ, Địa điểm, Địa chỉ/Ghi chú, Món đặt, Tổng tiền, Hình thức TT, Trạng thái]`.
  - Hướng dẫn 3 bước copy-paste để nhóm cài đặt trong 1 phút.

- [ ] **Step 3: Commit**
`git add src/app/api/orders scripts/google-apps-script.js .env.example && git commit -m "feat: add order API route and Google Apps Script integration"`

---

### Task 7: Lắp ráp trang chính (`page.tsx`), Kiểm thử & Hoàn thiện tài liệu

**Files:**
- Modify: `src/app/page.tsx`
- Create: `README.md`

**Interfaces:**
- Consumes: Toàn bộ components và context từ các task trước
- Produces: Website hoàn chỉnh hoạt động 100%, tài liệu hướng dẫn nhóm chạy local và deploy Vercel.

- [ ] **Step 1: Lắp ráp `src/app/page.tsx`**
  - Bọc ứng dụng trong `CartProvider`.
  - Render theo thứ tự: `Header` -> `VoucherBanner` -> `Hero` -> `ShopSection` -> `AboutSection` -> `Footer` -> `CartDrawer`.

- [ ] **Step 2: Kiểm thử toàn diện các luồng hoạt động**
  - Thêm sản phẩm vào giỏ, kiểm tra tính toán tổng tiền và gợi ý voucher.
  - Điền form đặt hàng với cả 2 hình thức (Tiền mặt và Chuyển khoản QR).
  - Kiểm tra hiển thị responsive trên giao diện mobile và desktop.
  - Kiểm tra Dark mode và Light mode.

- [ ] **Step 3: Viết tài liệu `README.md`**
  - Hướng dẫn nhóm chạy website: `npm install` và `npm run dev`.
  - Hướng dẫn dán link Google Sheet vào file `.env.local`.
  - Hướng dẫn deploy 1-click lên Vercel để lấy link chia sẻ cho khách.

- [ ] **Step 4: Commit và hoàn tất**
`git add src/app/page.tsx README.md && git commit -m "feat: assemble main page and add comprehensive documentation"`
