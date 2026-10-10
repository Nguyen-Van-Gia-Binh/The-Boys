/**
 * =========================================================================
 * GOOGLE APPS SCRIPT ĐỒNG BỘ ĐƠN HÀNG "HÀNH TRÌNH DÒNG NƯỚC VỀ NGUỒN"
 * =========================================================================
 * 
 * HƯỚNG DẪN CÀI ĐẶT NHANH (MẤT 1 PHÚT):
 * 1. Mở một trang Google Sheet mới (hoặc file có sẵn của nhóm).
 * 2. Đặt tên trang tính sheet đầu tiên là: "DonHang" (hoặc "Trang tính1" tuỳ ý).
 * 3. Tạo dòng tiêu đề hàng 1 gồm các cột:
 *    A: Mã đơn hàng | B: Thời gian đặt | C: Họ và tên | D: Số điện thoại | 
 *    E: Email | F: Ngày nhận | G: Khung giờ nhận | H: Địa điểm nhận | 
 *    I: Địa chỉ chi tiết | J: Danh sách món | K: Tạm tính | L: Giảm giá | 
 *    M: Tổng thanh toán | N: Phương thức thanh toán | O: Ghi chú | P: Trạng thái
 * 
 * 4. Vào menu: Tiện ích mở rộng (Extensions) -> Apps Script.
 * 5. Xóa hết code cũ, Dán toàn bộ nội dung file này vào.
 * 6. Bấm nút "Triển khai" (Deploy) -> "Triển khai dưới dạng ứng dụng web" (New deployment -> Web app).
 *    - Mô tả: "Don Hang Webhook"
 *    - Thực thi dưới quyền: "Tôi" (Me)
 *    - Ai có quyền truy cập: "Bất kỳ ai" (Anyone) -> RẤT QUAN TRỌNG ĐỂ WEB GỬI ĐƯỢC ĐƠN.
 * 7. Bấm Triển khai -> Cấp quyền (Authorize) -> Copy đường link "URL ứng dụng web" (Web app URL).
 * 8. Dán URL đó vào file .env.local trong dự án web:
 *    GOOGLE_SHEET_WEBHOOK_URL="https://script.google.com/macros/s/xxxx/exec"
 */

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000);

  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = JSON.parse(e.postData.contents);

    // Thêm 1 dòng mới vào Google Sheet
    sheet.appendRow([
      data.orderId || "",
      data.createdAt || new Date().toLocaleString("vi-VN"),
      data.customerName || "",
      "'" + (data.phone || ""), // Thêm nháy đơn để giữ số 0 ở đầu số điện thoại
      data.email || "",
      data.pickupDate || "",
      data.pickupTime || "",
      data.pickupLocation || "",
      data.address || "",
      data.items || "",
      data.subtotal || 0,
      data.discount || 0,
      data.total || 0,
      data.paymentMethod || "",
      data.note || "",
      data.status || "Chờ xác nhận"
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ result: "success", orderId: data.orderId }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ result: "error", error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

function doGet(e) {
  return ContentService.createTextOutput("Google Apps Script Webhook is active and running!");
}
