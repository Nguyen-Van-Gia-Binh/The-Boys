# Kế hoạch: Tra cứu đơn hàng qua Google Sheet

## Context
Khách hàng thanh toán qua VietQR nhưng **không biết đơn đã được xác nhận chưa**. Hiện tại The Boys phải đối soát thủ công trên app ngân hàng rồi cập nhật Google Sheet.

**Mục tiêu**: Cho phép khách tự tra cứu trạng thái đơn hàng bằng mã đơn (DHxxxx) hoặc SĐT, không cần dùng SePay hay bất kỳ service trả phí nào.

---

## Kế hoạch triển khai

### Bước 1: Cập nhật Google Apps Script (Webhook)

**File**: `scripts/google-apps-script.js`

Thêm function `doGet` mới để đọc đơn hàng:

```javascript
function doGet(e) {
  var action = e.parameter.action;

  if (action === "lookup") {
    var orderId = e.parameter.orderId;
    var phone = e.parameter.phone;

    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = sheet.getDataRange().getValues();
    var headers = data[0];

    // Tìm cột tương ứng
    var orderIdCol = headers.indexOf("Mã đơn hàng");
    var phoneCol = headers.indexOf("Số điện thoại");
    // ... các cột khác

    // Duyệt từng dòng, trả về dòng khớp orderId hoặc phone
    // Trả về JSON với thông tin: trạng thái, tổng tiền, ngày nhận...
  }

  return responseJson({...});
}
```

### Bước 2: Thêm API endpoint đọc trạng thái

**File mới**: `src/app/api/orders/lookup/route.ts`

- Nhận query params: `?orderId=DHxxxx` hoặc `?phone=09xx`
- Gọi Google Apps Script với action=lookup
- Parse kết quả, trả về trạng thái đơn hàng
- Error handling: đơn không tìm thấy, Sheet lỗi...

### Bước 3: Tạo component tra cứu

**File mới**: `src/components/OrderLookup.tsx`

- Input: ô nhập mã đơn HOẶC SĐT
- Nút "Tra cứu"
- Hiển thị kết quả: 
  - ✅ "Đã thanh toán" (nền xanh)
  - ⏳ "Chờ chuyển khoản" (nền vàng)
  - ❌ "Đã hủy" (nền đỏ)
- Thông tin đơn: mã, ngày nhận, địa điểm, tổng tiền

### Bước 4: Tích hợp vào website

**Tùy chọn A** - Modal trong CartDrawer (đơn giản):
- Thêm tab/thông tin trong phần "Đơn đã đặt"
- Khi khách chưa có đơn nào local, hiện form tra cứu

**Tùy chọn B** - Trang riêng `/tra-cuu`:
- Link trong footer hoặc email xác nhận
- SEO-friendly

**Gợi ý**: Làm **Tùy chọn B** (trang riêng `/tra-cuu`) vì:
- Khách chưa đặt hàng vẫn tra cứu được
- Có thể gửi link trong thông báo
- Dễ mở rộng sau này

---

## Files cần tạo/sửa

| File | Hành động |
|------|-----------|
| `scripts/google-apps-script.js` | Sửa - thêm function lookup |
| `src/app/api/orders/lookup/route.ts` | Tạo mới - API endpoint |
| `src/app/tra-cuu/page.tsx` | Tạo mới - trang tra cứu |
| `src/components/OrderLookup.tsx` | Tạo mới - component UI |

---

## Verification

1. Deploy Google Apps Script → test thử function `lookup`
2. Test API `/api/orders/lookup?orderId=DH1234`
3. Mở trang `/tra-cuu` → nhập mã đơn → xem kết quả
4. Verify: trạng thái hiển thị đúng theo Google Sheet

---

## Lưu ý

- Google Apps Script Web App đã set "Ai cũng truy cập được" → Không cần auth
- Response từ Sheet có thể chậm (~1-2s) → cần loading state
- Nên cache kết quả lookup trong 5-10 phút để tránh spam API
