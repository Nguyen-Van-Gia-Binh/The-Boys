/**
 * =========================================================================
 * GOOGLE APPS SCRIPT ĐỒNG BỘ ĐƠN HÀNG VÀO GOOGLE SHEETS
 * CHIẾN DỊCH: "HÀNH TRÌNH DÒNG NƯỚC VỀ NGUỒN" — THE BOYS FPT
 * =========================================================================
 * 
 * HƯỚNG DẪN CÀI ĐẶT NHANH (MẤT 1 PHÚT):
 * 1. Mở trang Google Sheet của nhóm.
 * 2. Đặt dòng tiêu đề tại Hàng 1 gồm 16 cột (A đến P):
 *    A: Mã đơn hàng | B: Thời gian đặt | C: Họ và tên | D: Số điện thoại | 
 *    E: Email | F: Ngày nhận | G: Khung giờ nhận | H: Địa điểm nhận | 
 *    I: Địa chỉ chi tiết | J: Danh sách món | K: Tạm tính | L: Giảm giá | 
 *    M: Tổng thanh toán | N: Phương thức thanh toán | O: Ghi chú | P: Trạng thái
 * 
 * 3. Vào menu: Tiện ích mở rộng (Extensions) -> Apps Script.
 * 4. Xóa hết code cũ, Dán toàn bộ nội dung file này vào.
 * 5. Bấm nút "Lưu" (Save - Ctrl+S).
 * 6. Bấm nút "Triển khai" (Deploy) -> "Triển khai mới" (New deployment).
 *    - Chọn loại: "Ứng dụng web" (Web app)
 *    - Mô tả: "Dong Nuoc Ve Nguon - Orders Webhook"
 *    - Thực thi dưới quyền: "Tôi" (Me)
 *    - Ai có quyền truy cập: "Bất kỳ ai" (Anyone) -> BẮT BUỘC ĐỂ WEBSITE GỬI ĐƯỢC ĐƠN
 * 7. Bấm "Triển khai" -> "Ủy quyền truy cập" (Authorize) -> Đăng nhập Google -> Nâng cao (Advanced) -> Đi tới... (Go to... unsafe) -> Cho phép (Allow).
 * 8. Copy đường link "URL ứng dụng web" (Web app URL) có dạng:
 *    https://script.google.com/macros/s/AKfycb.../exec
 * 
 * 9. Dán URL này vào:
 *    - File .env.local trong dự án: GOOGLE_SHEET_WEBHOOK_URL="https://script.google.com/macros/s/.../exec"
 *    - Vercel Dashboard -> Settings -> Environment Variables -> Key: GOOGLE_SHEET_WEBHOOK_URL
 * 
 * 💡 MẸO QUẢN LÝ ĐƠN HÀNG DỄ DÀNG TRÊN GOOGLE SHEET:
 * - Khi khách quét mã QR VietQR, trong nội dung chuyển khoản SHB sẽ có mã: "THEBOYS DHxxxx".
 * - Bạn chỉ cần nhìn mã DHxxxx trên thông báo tài khoản SHB, tra dòng tương ứng trên Sheet và đổi cột P (Trạng thái) thành "Đã thanh toán".
 * =========================================================================
 */

function doPost(e) {
  var lock = LockService.getScriptLock();
  // Đợi tối đa 10 giây để chống xung đột ghi đồng thời
  lock.tryLock(10000);

  try {
    if (!e || !e.postData || !e.postData.contents) {
      return responseJson({ success: false, message: "No post data received" });
    }

    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = JSON.parse(e.postData.contents);

    var isBankTransfer = (data.paymentMethod || "").indexOf("VietQR") !== -1 || (data.paymentMethod || "").indexOf("Chuyển khoản") !== -1;
    var status = data.status || (isBankTransfer ? "Chờ chuyển khoản (VietQR)" : "Chờ xác nhận (Tiền mặt)");

    // Thêm 1 dòng mới vào Google Sheet (Cột A đến P)
    sheet.appendRow([
      data.orderId || "",
      data.createdAt || new Date().toLocaleString("vi-VN"),
      data.customerName || "",
      "'" + (data.phone || ""), // Nháy đơn để bảo toàn số 0 ở đầu số điện thoại
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
      status
    ]);

    var newRow = sheet.getLastRow();
    var statusCell = sheet.getRange(newRow, 16);

    // Tô màu trạng thái ban đầu để phân biệt trực quan
    if (isBankTransfer) {
      statusCell.setBackground("#fff3cd"); // Vàng nhạt (Chờ chuyển khoản)
      statusCell.setFontColor("#664d03");
      statusCell.setFontWeight("bold");
    } else {
      statusCell.setBackground("#f8f9fa"); // Xám nhạt (Tiền mặt)
      statusCell.setFontColor("#333333");
    }

    return responseJson({
      success: true,
      result: "success",
      orderId: data.orderId,
      row: newRow
    });

  } catch (error) {
    Logger.log("Error in doPost: " + error.toString());
    return responseJson({ success: false, error: error.toString() });
  } finally {
    lock.releaseLock();
  }
}

function doGet(e) {
  return responseJson({
    status: "active",
    campaign: "Hành Trình Dòng Nước Về Nguồn - The Boys",
    timestamp: new Date().toLocaleString("vi-VN")
  });
}

function responseJson(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
