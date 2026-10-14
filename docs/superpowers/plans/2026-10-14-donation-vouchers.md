# Kế Hoạch Triển Khai: Tính Năng Donation & Áp Mã Giảm Giá (Vouchers)

- **Chiến dịch**: Hành Trình Dòng Nước Về Nguồn — The Boys FPT
- **Thời gian thực hiện**: 14/10/2026
- **Trạng thái**: Đang triển khai (In Progress)

---

## 1. Mục tiêu (Goal Description)
Triển khai hoàn chỉnh hai tính năng chính:
1. **Hệ thống Mã giảm giá (Voucher System)**:
   - Quản lý linh hoạt qua Google Sheet (tab `Vouchers`).
   - Hỗ trợ giảm theo %, min spend, hạn sử dụng, phân loại ngành hàng áp dụng (`all`, `combo`, `flower`, `snack`, `drink`).
   - Tích hợp trực tiếp vào `CartContext`, `CartDrawer`, tự động cập nhật VietQR Code và lưu vết vào Google Sheet.
2. **Nâng cấp tính năng Donation (Ủng hộ tri ân)**:
   - Modal popup "Chứng Nhận Tấm Lòng Vàng" trang trọng sau khi ủng hộ, hỗ trợ tải ảnh PNG chia sẻ mạng xã hội.
   - Nâng cấp trang tra cứu `/tra-cuu` để hiển thị chuyên biệt cho mã ủng hộ `DNxxxx`.
   - Kết nối dữ liệu sao kê thời gian thực từ Google Sheet và hiển thị số phần quà tri ân đã đạt được.

---

## 2. Các Bước Triển Khai Chi Tiết

### Bước 1: Mở rộng Types (`src/types/index.ts`)
- Thêm interface `Voucher`, `VoucherValidationResult`.
- Mở rộng `OrderPayload` để chứa `voucherCode` và `discountAmount`.

### Bước 2: Cập nhật Google Apps Script (`scripts/google-apps-script.js`)
- Thêm action `vouchers` trong `doGet`: đọc sheet `Vouchers`, fallback về bộ mã mẫu nếu sheet chưa tạo.
- Hoàn thiện action `lookup` để tìm kiếm và trả về đầy đủ các trường của đơn ủng hộ `DNxxxx`.
- Thêm hướng dẫn thiết lập tab `Vouchers` ở đầu file.

### Bước 3: Tạo API Validate Voucher (`src/app/api/vouchers/validate/route.ts`)
- Kiểm tra tính hợp lệ của mã: hạn dùng, min spend, ngành hàng áp dụng, tỷ lệ % và trần giảm tối đa.
- Hỗ trợ fallback offline nếu Google Apps Script gặp sự cố mạng.

### Bước 4: Tích hợp Voucher vào `CartContext.tsx` & `CartDrawer.tsx`
- State `appliedVoucher` trong `CartContext`.
- Tự động tính toán `discountAmount` và cập nhật `total = Math.max(0, subtotal - discountAmount)`.
- UI nhập mã voucher trong `CartDrawer`, thông báo lỗi rõ ràng, badge giảm giá xanh lá khi thành công.
- Cập nhật URL ảnh VietQR theo `total` mới.

### Bước 5: Tạo Component Chứng Nhận Tri Ân (`DonationCertificateModal.tsx`)
- Hiển thị thông tin người ủng hộ, số tiền, ngày, mã `DNxxxx`, lời chúc.
- Canvas render ảnh chứng nhận độ phân giải cao (1200x675 hoặc 1080x1080), nút bấm "Tải ảnh về máy" (.png).
- Nút "Tra cứu lượt ủng hộ" dẫn tới `/tra-cuu?code=DNxxxx`.

### Bước 6: Tích hợp vào `DonationSection.tsx`
- Khi `handleSubmitDonation` hoàn tất -> mở `DonationCertificateModal`.
- Tối ưu fetch realtime donations từ Google Sheet.

### Bước 7: Nâng cấp `OrderLookup.tsx` cho mã `DNxxxx`
- Nhận diện đơn ủng hộ (`orderId` bắt đầu bằng `DN` hoặc có chữ "ủng hộ").
- Hiển thị card riêng biệt với màu sắc tri ân, thông điệp cảm ơn và trạng thái rõ ràng.

### Bước 8: Kiểm thử & Xác minh (Verification)
- Chạy `npm run build` để kiểm tra toàn bộ TypeScript và Next.js build.
- Kiểm tra luồng áp mã voucher:
  - Mã không tồn tại / hết hạn -> báo lỗi đúng.
  - Mã chưa đủ đơn tối thiểu -> báo lỗi kèm số tiền thiếu.
  - Áp mã thành công -> hiển thị số tiền giảm, cập nhật tổng thanh toán và URL QR code.
- Kiểm tra luồng ủng hộ và tạo chứng nhận tri ân.
- Kiểm tra tra cứu đơn `DHxxxx` và `DNxxxx`.
