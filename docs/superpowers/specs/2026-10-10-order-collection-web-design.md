# Thiết Kế Chi Tiết Website Thu Đơn: Dự Án "Hành Trình Dòng Nước Về Nguồn"

## 1. Giới thiệu & Mục tiêu Dự Án
- **Tên dự án / Chiến dịch:** *Hành trình dòng nước về nguồn* (Khởi xướng bởi nhóm sinh viên The Boys).
- **Sứ mệnh & Mục đích từ thiện:**
  - Gây quỹ để chuẩn bị **20 phần quà tri ân** (trị giá 150.000đ/phần) trao tận tay các cô chú thương binh bị nhiễm chất độc da cam, có tỷ lệ thương tật cơ thể nặng, không còn người thân chăm sóc.
  - Mỗi phần quà gồm:
    1. 01 Hộp sữa Ensure pha sẵn (68k)
    2. 01 Hộp bánh bông lan Solite 18 cái (53k)
    3. 01 Lốc sữa Nutifood ít đường (36k)
    4. 01 Bức thư tri ân viết tay từ tấm lòng của sinh viên
  - Tổ chức 01 ngày thiện nguyện: *"Một buổi sống cùng anh hùng trong thời bình"*, sinh hoạt ngoài trời cùng câu lạc bộ và trực tiếp đọc thư tri ân gửi tặng các chiến sĩ.
- **Mục tiêu website:**
  - Giới thiệu câu chuyện ý nghĩa, lan tỏa tinh thần "Uống nước nhớ nguồn".
  - Thu nhận đơn đặt hàng trực tuyến từ ngày **13/10 (Debut)** và đặt trước combo sự kiện **17/10 (Workshop & 20/10)**.
  - Đơn hàng tự động lưu về **Google Sheets** của nhóm.

---

## 2. Danh Mục Sản Phẩm (Menu) & Chính Sách Giá

### 2.1. Đồ Ăn Vặt (Snacks)
1. **Bánh tráng xì ke:** 6.000đ / gói (vị muối tỏi cay thơm cuốn hút).
2. **Bánh tráng trộn:** 8.000đ / bịch (đầy đủ gia vị đậm đà).
3. **Bánh tráng giòn sa tế tôm:** 12.000đ / bịch (giòn rụm thơm lừng sa tế tôm).

### 2.2. Đồ Uống Giải Nhiệt (Drinks & Cafe)
4. **Cafe đen đậm vị:** 12.000đ / ly.
5. **Cafe sữa thơm béo:**
   - Size vừa: 15.000đ / ly
   - Size lớn: 18.000đ / ly
6. **Trà tắc Lipton mát lạnh:** 10.000đ / ly (thanh nhiệt sảng khoái).

### 2.3. Hoa Tươi Yêu Thương (Flowers - Dành tặng 20/10)
7. **1 bông hoa tươi:** 19.000đ
8. **3 bông hoa tươi:** 49.000đ
9. **5 bông hoa tươi:** 79.000đ
*(Có gói 10 bông 149.000đ tư vấn riêng nếu khách có nhu cầu đặt trước)*

### 2.4. Combo Workshop Làm Thiệp & Chụp Ảnh (Sự kiện ngày 17/10)
10. **Combo Trải Nghiệm (69.000đ):**
    - Đi chụp hình + Trải nghiệm làm thiệp handmade.
    - Bao gồm: 01 ảnh in trực tiếp + 01 thiệp để khách tự tay decor và viết thư ngỏ gửi người thương.
11. **Combo Yêu Thương (89.000đ):**
    - Gồm: 01 ảnh in + 01 thiệp handmade + 01 bông hoa tươi.
12. **Combo Mùi Mẫn (109.000đ):**
    - Gồm: 01 ảnh in + 01 file ảnh chất lượng cao + 01 bông hoa tươi + 01 thiệp handmade + 01 bình thủy tinh trồng cây thủy sinh + 01 túi giấy sang trọng.
13. **Combo Hạnh Phúc (169.000đ - Best Choice):**
    - Gồm: 01 ảnh in + 02 file ảnh gốc + 01 thiệp handmade + 01 bình thủy tinh trồng thủy sinh + 05 bông hoa tươi rực rỡ + 01 túi giấy cao cấp.

---

## 3. Chính Sách Ưu Đãi Đặt Sớm (Early-Bird Vouchers)
- Hiển thị banner thông báo nổi bật trên web:
  - **Đơn từ 59.000đ:** Tặng voucher giảm **10%** cho Combo Trải Nghiệm (ngày 17/10).
  - **Đơn từ 89.000đ:** Tặng voucher giảm **10%** cho TẤT CẢ các combo ngày 17/10.
  - **Đơn từ 149.000đ:** Tặng voucher giảm **15%** cho TẤT CẢ các combo ngày 17/10.
- Hệ thống giỏ hàng tự động gợi ý tiến độ nhận ưu đãi (ví dụ: *"Mua thêm 14.000đ để nhận voucher 10%"*).

---

## 4. Kiến Trúc Giao Diện & Trải Nghiệm Người Dùng (UI/UX)

1. **Header:** Logo dự án "Dòng Nước Về Nguồn" + Navigation cuộn nhanh + Theme Toggle + Giỏ hàng có badge đếm số lượng.
2. **Hero Section:**
   - Tiêu đề: *Góp nắng gửi yêu thương, Tri ân ngàn người lính.*
   - Giới thiệu mục tiêu trao tặng 20 phần quà cho các thương binh nhiễm chất độc da cam.
   - Thống kê tự động: Bộ đếm số đơn hàng đã đặt.
3. **Banner Ưu Đãi Ngày 13/10 (Debut):**
   - Đếm ngược / thông báo ưu đãi voucher cho ngày 17/10.
4. **Khu Vực Gian Hàng (Filter Tabs):**
   - Tab phân loại: *Tất cả*, *Đồ ăn vặt*, *Đồ uống*, *Hoa tươi*, *Combo Workshop 17/10*.
   - Card sản phẩm: Ảnh sắc nét, tag giá, mô tả chi tiết từng món quà trong combo, nút `+ Thêm vào giỏ`.
5. **Section "Hành Trình Dòng Nước Về Nguồn":**
   - Kể câu chuyện tri ân các chú thương binh nhiễm chất độc da cam, chi tiết các phần quà và buổi sinh hoạt ý nghĩa.
6. **Drawer Giỏ Hàng & Checkout (Đúng mẫu ảnh chụp):**
   - Điều chỉnh số lượng `[ - 1 + ]`, tự động tính tổng tiền.
   - Form nhận hàng: Họ tên, Email, SĐT, Địa chỉ, Ghi chú, Ngày nhận (13/10, 17/10...), Địa điểm nhận (Sảnh trường ĐH FPT, KTX, v.v.), Khung giờ nhận.
   - Phương thức thanh toán:
     - `Tiền mặt khi nhận hàng`
     - `Chuyển khoản VietQR`: Tự động tạo mã QR có số tiền và cú pháp `[Họ tên] - [SĐT]`.
7. **Footer:** Thông tin nhóm, hotline, tài khoản ngân hàng hỗ trợ.

---

## 5. Tích Hợp Google Sheets

- **Kiến trúc:** Next.js Route Handler `/api/orders` chuyển tiếp dữ liệu an toàn đến Google Apps Script Webhook.
- **Dữ liệu mỗi đơn ghi vào Sheet:**
  1. `Mã đơn hàng`
  2. `Thời gian đặt`
  3. `Họ tên khách`
  4. `Số điện thoại`
  5. `Email`
  6. `Ngày & Khung giờ nhận`
  7. `Địa điểm nhận`
  8. `Địa chỉ chi tiết / Ghi chú`
  9. `Chi tiết món đặt` (Số lượng, phân loại size, combo)
  10. `Tổng tiền (VNĐ)`
  11. `Phương thức thanh toán`
  12. `Trạng thái` (*Chờ xử lý*)
- Kèm theo file script Google Apps Script mẫu trong thư mục `scripts/google-apps-script.js` để nhóm dán vào Google Sheet là hoạt động ngay.

---

## 6. Kế Hoạch Triển Khai Kỹ Thuật

- **Bước 1:** Khởi tạo dự án Next.js (TypeScript, Tailwind CSS, Lucide Icons).
- **Bước 2:** Xây dựng module dữ liệu (`src/data/menu.ts`) chuẩn hóa toàn bộ các món, combo, chính sách voucher từ nội dung của nhóm.
- **Bước 3:** Xây dựng hệ thống UI Components (Header, Hero, ProductGrid, Filter Tabs, About Journey Section, Footer).
- **Bước 4:** Xây dựng Giỏ hàng (Cart Drawer) + VietQR generator + Form Validation.
- **Bước 5:** Xây dựng API `/api/orders` tích hợp Google Sheet Webhook + Fallback Local.
- **Bước 6:** Hướng dẫn kết nối Google Sheet và kiểm thử toàn diện.
