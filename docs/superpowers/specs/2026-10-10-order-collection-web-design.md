# Thiết Kế Hệ Thống Web Thu Đơn Nhóm (The Boys Project)

## 1. Giới thiệu & Mục tiêu
- **Mục tiêu:** Xây dựng website thu đơn và giới thiệu dự án cho nhóm sinh viên, lấy cảm hứng và tiêu chuẩn trải nghiệm tương tự website thiện nguyện [Nắng Ấm](https://nangamproject.vercel.app/).
- **Phạm vi chức năng:**
  - Landing page giới thiệu dự án, câu chuyện, tôn chỉ hoạt động.
  - Gian hàng trực quan hiển thị danh sách sản phẩm/dịch vụ (nước, đồ ăn, quà lưu niệm, v.v.).
  - Giỏ hàng (Slide-over Cart Drawer) chuẩn xác theo giao diện mẫu người dùng cung cấp.
  - Form đặt hàng đầy đủ các trường (Họ tên, SĐT, Email, Địa chỉ, Ghi chú, Ngày nhận, Địa điểm nhận, Khung giờ nhận, Hình thức thanh toán).
  - Tự động sinh mã VietQR chuyển khoản ngân hàng theo giá trị đơn hàng và thông tin khách.
  - Tự động lưu thông tin đơn hàng về **Google Sheets** của nhóm.
  - Hỗ trợ Dark Mode / Light Mode, thiết kế Responsive toàn diện trên Mobile và Desktop.

---

## 2. Kiến Trúc Kỹ Thuật (Tech Stack)

| Thành phần | Công nghệ lựa chọn | Lý do |
| :--- | :--- | :--- |
| **Framework** | Next.js (App Router, React 19/18, TypeScript) | Chuẩn mực web hiện đại, hỗ trợ SSR, API Routes an toàn, tương thích tuyệt đối khi deploy Vercel |
| **Styling** | Tailwind CSS + CSS Variables | Dễ dàng tùy biến bảng màu ấm áp, bo tròn bo góc, dark/light mode tương thích |
| **Icons** | Lucide React | Bộ icon phong phú, giao diện sạch đẹp như Nắng Ấm |
| **Lưu trữ đơn hàng** | Google Sheets qua Webhook (Google Apps Script) | Miễn phí, tiện dụng, cả nhóm mở trên điện thoại xem trực tiếp theo thời gian thực |
| **Thanh toán QR** | Chuẩn VietQR API (`img.vietqr.io`) | Tự động tạo mã QR kèm số tiền và cú pháp chuẩn `[Tên khách] - [SĐT]` |

---

## 3. Kiến Trúc Giao Diện (UI Layout & Components)

### 3.1. Header / Navbar
- **Logo:** Biểu tượng mặt trời / năng động + Tên dự án (`The Boys Project.` hoặc tùy biến).
- **Navigation Menu:** Cuộn mượt (Smooth Scroll) tới các section:
  - *Về dự án* (`#about`)
  - *Gian hàng* (`#shop`)
  - *Hành trình* (`#journey`)
  - *Liên hệ* (`#contact`)
- **Theme Toggle:** Nút chuyển đổi giao diện Sáng / Tối.
- **Cart Button:** Nút nổi bật hiển thị icon giỏ hàng và số lượng món đã chọn (ví dụ: `0 món` hoặc badge đỏ khi có món).

### 3.2. Hero Section
- Tag dự án: `— DỰ ÁN SINH VIÊN`
- Tiêu đề lớn ấn tượng: Tông màu ấm + chữ nghiêng tạo điểm nhấn.
- Mô tả mục đích thu đơn / gây quỹ của nhóm.
- Nút CTA: `Ghé gian hàng` (dẫn xuống mục Shop) và `Tìm hiểu thêm`.
- Social Proof Badge: Hiển thị bộ đếm số đơn hàng đã đặt (ví dụ: *"Đã có 64+ đơn hàng góp sức"*).
- Ảnh ghép nghệ thuật: Bố cục cụm ảnh bo góc lớn bo tròn, badge cảm xúc "Một hành động nhỏ, lan tỏa triệu niềm vui".

### 3.3. Section Câu chuyện & Hành trình (About & Story)
- Nêu rõ hoàn cảnh ra đời của dự án, các thành viên tham gia và cam kết minh bạch tài chính/lợi nhuận.
- Mục Hành trình: Nêu địa điểm/đối tượng nhóm sẽ hướng tới (trường học, mái ấm, sự kiện clb).

### 3.4. Gian Hàng Sẻ Chia (Shop Grid)
- **Hộp lưu ý giao hàng (Delivery Notice):** Thông báo phạm vi nhận đơn (ví dụ: Trường ĐH FPT, KTX, khu vực cụ thể), thời gian bắt đầu mở bán hoặc pre-order.
- **Danh sách sản phẩm (Card Layout):**
  - Ảnh món ăn/nước uống/vật phẩm chất lượng cao.
  - Tên món, đơn giá (định dạng `xx.000đ`).
  - Mô tả thành phần / topping.
  - Nút `+ Thêm vào giỏ` kèm hiệu ứng phản hồi tức thì (toast thông báo nhỏ).

### 3.5. Giỏ Hàng & Form Đặt Hàng (Cart & Checkout Drawer)
Dựng đúng 100% theo ảnh thiết kế người dùng cung cấp:
- **Tiêu đề:** "Giỏ hàng" kèm nút đóng `✕`.
- **Thanh chuyển tab:** `Giỏ hàng` (active) | `Đơn đã đặt` (lưu trong LocalStorage để khách xem lại đơn vừa đặt).
- **Danh sách món trong giỏ:** Tên món, giá, bộ chỉnh số lượng `[ - ] [ 1 ] [ + ]`, nút xóa.
- **Tạm tính / Tổng tiền:** Tính toán tự động theo thời gian thực.
- **Form thông tin nhận hàng:**
  1. *Họ và tên:* Ô nhập văn bản (bắt buộc)
  2. *Email:* Ô nhập email (bắt buộc)
  3. *Số điện thoại:* Ô nhập SĐT (bắt buộc, có regex kiểm tra đầu số VN)
  4. *Địa chỉ chi tiết:* Textarea (không bắt buộc)
  5. *Ghi chú cho đơn hàng:* Textarea (không bắt buộc)
  6. *Ngày nhận:* Date picker (mặc định từ hôm nay trở đi)
  7. *Địa điểm nhận:* Dropdown chọn địa điểm (FPT HCM, KTX, Vinhomes...)
  8. *Khung giờ nhận:* Dropdown chọn khung giờ (08:00 - 09:00, 09:00 - 10:00, v.v. hoặc Khác)
- **Phương thức thanh toán:**
  - *Tiền mặt khi nhận hàng (Cash)*
  - *Chuyển khoản ngân hàng (VietQR / MoMo):* Hiển thị mã QR tự động kèm thông tin STK, Ngân hàng, Chủ tài khoản, cú pháp: `[Họ tên] - [SĐT]`.
- **Nút hành động:** `Xác nhận đặt hàng` (hiển thị trạng thái đang gửi và màn hình thông báo Đặt hàng thành công).

---

## 4. Cơ Chế Thu Thập & Đồng Bộ Dữ Liệu Với Google Sheets

### 4.1. Kiến Trúc Luồng Dữ Liệu
```
[Người dùng đặt hàng] 
         │ 
         ▼
[Frontend Cart Drawer]
         │ (Gửi POST JSON)
         ▼
[Next.js API: /api/orders]
         │ (Kiểm tra dữ liệu hợp lệ)
         ├──> Nếu có cấu hình GOOGLE_SHEET_WEBHOOK_URL:
         │      Gửi HTTP POST sang Google Apps Script Webhook
         │      -> Ghi tự động 1 dòng mới vào Google Sheet
         │
         └──> Nếu chưa điền Webhook:
                Lưu vào bộ nhớ đệm / local file & báo thành công để nhóm test web trước.
```

### 4.2. Các Trường Cột Được Ghi Vào Google Sheets
Mỗi đơn hàng thành công sẽ được thêm thành 1 dòng trên Google Sheet gồm các cột:
1. `Mã đơn hàng` (Order ID: e.g. `DH-10294`)
2. `Thời gian đặt` (Timestamp: e.g. `10/10/2026 14:30:00`)
3. `Họ và tên khách`
4. `Số điện thoại`
5. `Email`
6. `Địa điểm nhận`
7. `Ngày & Khung giờ nhận`
8. `Địa chỉ chi tiết`
9. `Danh sách món đặt` (e.g. `2x Nước cam (40k), 1x Snack lớn (35k)`)
10. `Tổng tiền (VNĐ)`
11. `Phương thức thanh toán` (Tiền mặt / Chuyển khoản)
12. `Ghi chú khách hàng`
13. `Trạng thái đơn` (Mặc định: *Chờ xử lý*)

### 4.3. Script Google Apps Script Mẫu Cho Nhóm
Nhóm chỉ cần mở Google Sheet -> Tiện ích mở rộng -> Apps Script -> Dán đoạn code ngắn (~15 dòng) được cung cấp sẵn trong dự án -> Bấm Triển khai (Deploy as Web App) -> Lấy URL dán vào file `.env.local`.

---

## 5. Dữ Liệu Mẫu (Mock Data) Ban Đầu
Để bạn có thể chạy thử nghiệm và kiểm tra toàn bộ website ngay lập tức, dự án sẽ đi kèm bộ dữ liệu mẫu cấu hình trong file `src/data/config.ts` hoặc `src/data/products.ts`:
- **Thông tin nhóm:** The Boys Project - Dự án sinh viên FPT trao gửi yêu thương.
- **Sản phẩm mẫu:**
  1. *Nước cam tươi nguyên chất* - 20.000đ
  2. *Snack trộn đặc biệt (Cỡ lớn)* - 35.000đ
  3. *Snack trộn cay ngọt (Cỡ nhỏ)* - 30.000đ
  4. *Combo Tiết Kiệm (Snack + Nước cam)* - 45.000đ
  5. *Topping thêm (Khô bò / Khô gà / Trứng cút)* - 15.000đ
- **Thông tin nhận hàng mẫu:**
  - Địa điểm: *Đại học FPT cơ sở TP.HCM*, *Ký túc xá*, *Vinhomes Grand Park*.
  - Khung giờ: 8h-9h, 9h-10h, 11h-12h, 13h-14h, 15h-16h, 16h-17h.
- **Thông tin thanh toán mẫu:** VietQR tích hợp linh hoạt, dễ dàng thay số tài khoản và ngân hàng nhóm trong 1 file cài đặt duy nhất.

---

## 6. Tiêu Chí Nghiệm Thu (Acceptance Criteria)
1. Giao diện sắc nét, chuẩn responsive trên cả điện thoại di động và máy tính bàn.
2. Thêm / bớt sản phẩm vào giỏ hàng mượt mà, lưu giỏ hàng trong localStorage để không bị mất khi reload.
3. Form đặt hàng kiểm tra đầy đủ dữ liệu (Validation), hiển thị mã QR thanh toán chuẩn VietQR.
4. Gửi đơn hàng thành công, hiển thị popup mã đơn và hướng dẫn nhận hàng.
5. Khi kết nối Google Sheet Webhook, đơn hàng xuất hiện ngay lập tức trên bảng tính Google Sheet của nhóm.
6. Cấu trúc code sạch sẽ, chia component rõ ràng theo Next.js App Router, có tài liệu hướng dẫn nhóm thay nội dung và liên kết Google Sheet.
