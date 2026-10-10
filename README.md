# 🌾 Dự Án "Hành Trình Dòng Nước Về Nguồn" — The Boys Project (ĐH FPT)

Website giới thiệu chiến dịch thiện nguyện và thu nhận đơn đặt hàng trực tuyến cho nhóm sinh viên The Boys (Đại học FPT TP.HCM). Lấy cảm hứng và tiêu chuẩn trải nghiệm tương tự trang thiện nguyện [Nắng Ấm](https://nangamproject.vercel.app/).

---

## 🌟 Tính Năng Nổi Bật

1. **Giao Diện Chuẩn Responsive:**
   - Tone màu mộc mạc, ấm áp (kem be, xanh rừng `#315444`, cam nắng `#df8143`).
   - Hỗ trợ chế độ Sáng / Tối (**Dark / Light Mode**).
   - Hiển thị hoàn hảo trên cả điện thoại di động và máy tính bàn.
2. **Gian Hàng Đa Dạng (Đúng 100% Nội Dung Của Nhóm):**
   - 🥖 **Đồ ăn vặt:** Bánh tráng xì ke (6k), Bánh tráng trộn (8k), Bánh tráng giòn sa tế tôm (12k).
   - ☕ **Đồ uống & Cafe:** Cafe đen (12k), Cafe sữa (nhỏ 15k, lớn 18k), Trà tắc Lipton (10k).
   - 🌸 **Hoa tươi 20/10:** 1 bông (19k), 3 bông (49k), 5 bông (79k).
   - 🎁 **Combo Workshop 17/10:** Combo Trải Nghiệm (69k), Combo Yêu Thương (89k), Combo Mùi Mẫn (109k), Combo Hạnh Phúc (169k).
3. **Ưu Đãi Đặt Sớm (Early-Bird Vouchers):**
   - Đơn từ 59k: Tặng voucher 10% Combo Trải Nghiệm.
   - Đơn từ 89k: Tặng voucher 10% tất cả combo ngày 17/10.
   - Đơn từ 149k: Tặng voucher 15% VIP.
   - Giỏ hàng tự động gợi ý tiến độ để khách mua thêm nhận voucher!
4. **Slide-over Cart Drawer Chuẩn Ảnh Mẫu:**
   - Đổi số lượng `[ - 1 + ]`, tính tổng tiền realtime.
   - Form thông tin nhận hàng: Họ tên, Email, SĐT, Địa chỉ, Ghi chú, Ngày nhận, Địa điểm nhận (FPT HCM, KTX, Vinhomes), Khung giờ nhận.
   - Thanh toán: **Tiền mặt khi nhận** hoặc **Chuyển khoản VietQR** (tự động tạo mã QR có số tiền và nội dung `[Họ tên] - [SĐT]`).
   - Tab **Đơn đã đặt** giúp khách xem lại lịch sử đơn hàng trên máy của họ.
5. **Tự Động Lưu Đơn Vào Google Sheets:**
   - Tích hợp qua Google Apps Script Webhook miễn phí, tiện lợi để cả nhóm mở xem và đi ship hàng.

---

## 🚀 Hướng Dẫn Cài Đặt & Chạy Website

### 1. Chạy trên máy tính (Local)
```bash
# Cài đặt các thư viện (nếu chưa cài)
npm install

# Khởi động server phát triển
npm run dev
```
Truy cập: [http://localhost:3000](http://localhost:3000)

### 2. Kết nối Google Sheet (Chỉ mất 1 phút)
1. Mở trang Google Sheet của nhóm, tạo dòng tiêu đề hàng 1 với các cột:
   - `Mã đơn` | `Thời gian` | `Họ tên` | `SĐT` | `Email` | `Ngày nhận` | `Khung giờ` | `Địa điểm` | `Địa chỉ chi tiết` | `Món đặt` | `Tạm tính` | `Giảm giá` | `Tổng thanh toán` | `Phương thức thanh toán` | `Ghi chú` | `Trạng thái`
2. Vào **Tiện ích mở rộng (Extensions)** -> **Apps Script**.
3. Mở file [scripts/google-apps-script.js](file:///c:/Users/admin/Documents/A_FPT/Tempory_Project/TheBoys/scripts/google-apps-script.js), copy toàn bộ nội dung và dán vào Apps Script.
4. Bấm **Triển khai (Deploy)** -> **Triển khai dưới dạng ứng dụng web (New deployment -> Web app)**.
   - Ai có quyền truy cập: Chọn **Bất kỳ ai (Anyone)**.
5. Copy đường dẫn Web App URL nhận được và dán vào file `.env.local`:
   ```env
   GOOGLE_SHEET_WEBHOOK_URL="https://script.google.com/macros/s/xxxx/exec"
   ```

### 3. Deploy lên Vercel để lấy link gửi cho khách
1. Đẩy code lên GitHub repository của bạn.
2. Đăng nhập [vercel.com](https://vercel.com) -> Bấm **Add New Project** -> Chọn repo GitHub.
3. Trong mục **Environment Variables**, thêm biến `GOOGLE_SHEET_WEBHOOK_URL`.
4. Bấm **Deploy**. Sau 1 phút bạn sẽ có link dạng `https://ten-du-an.vercel.app` để gửi cho mọi người!
