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
 *
 * 🔍 TÍNH NĂNG TRA CỨU ĐƠN HÀNG:
 * - Sau khi update code này, khách có thể truy cập /tra-cuu trên website để xem trạng thái đơn.
 * - Deploy lại (Deploy -> Manage deployments -> Edit -> New version) sau khi cập nhật code.
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
  var action = e.parameter.action;

  // Action: lookup - Tìm đơn hàng theo mã hoặc SĐT
  if (action === "lookup") {
    var orderId = (e.parameter.orderId || "").trim().toUpperCase();
    var phone = (e.parameter.phone || "").trim();

    if (!orderId && !phone) {
      return responseJson({ success: false, message: "Cần cung cấp orderId hoặc phone" });
    }

    // Luôn lấy Sheet đầu tiên (hoặc sheet đang active nếu có dữ liệu)
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheets()[0];
    var data = sheet.getDataRange().getValues();
    if (!data || data.length < 2) {
      return responseJson({ success: true, count: 0, orders: [] });
    }

    var headers = data[0];

    // Helper tìm cột linh hoạt theo nhiều tên gọi hoặc theo vị trí mặc định
    function findCol(names, defaultIndex) {
      for (var i = 0; i < headers.length; i++) {
        var h = String(headers[i] || "").trim().toLowerCase();
        for (var j = 0; j < names.length; j++) {
          if (h === names[j].toLowerCase()) return i;
        }
      }
      return defaultIndex;
    }

    var orderIdCol = findCol(["Mã đơn", "Mã đơn hàng", "Mã đơn #", "Order ID"], 0);
    var dateCol = findCol(["Thời gian", "Thời gian đặt", "Ngày đặt"], 1);
    var nameCol = findCol(["Họ tên", "Họ và tên", "Khách hàng", "Name"], 2);
    var phoneCol = findCol(["SĐT", "Số điện thoại", "Số ĐT", "Phone"], 3);
    var pickupDateCol = findCol(["Ngày nhận", "Pickup Date"], 5);
    var pickupTimeCol = findCol(["Khung giờ", "Khung giờ nhận", "Giờ nhận"], 6);
    var pickupLocCol = findCol(["Địa điểm", "Địa điểm nhận", "Nơi nhận"], 7);
    var itemsCol = findCol(["Món đặt", "Sản phẩm", "Items"], 9);
    var totalCol = findCol(["Tổng thanh toán", "Tổng tiền", "Thành tiền", "Total"], 12);
    var paymentCol = findCol(["Phương thức", "Phương thức thanh toán", "Payment"], 13);
    var statusCol = findCol(["Trạng thái", "Status", "Tình trạng"], 15);

    var results = [];

    // Duyệt từng dòng (bắt đầu từ row 2)
    for (var i = 1; i < data.length; i++) {
      var rowOrderId = String(data[i][orderIdCol] || "").trim().toUpperCase();
      var rawPhone = String(data[i][phoneCol] || "");
      var cleanPhone = rawPhone.replace(/[^\d]/g, "");

      var match = false;
      if (orderId && rowOrderId === orderId) match = true;
      if (phone) {
        var cleanQueryPhone = phone.replace(/[^\d]/g, "");
        if (cleanPhone === cleanQueryPhone || cleanPhone.endsWith(cleanQueryPhone)) match = true;
      }

      if (match) {
        results.push({
          orderId: rowOrderId,
          customerName: data[i][nameCol] || "",
          phone: rawPhone.replace(/^'/, ""),
          status: data[i][statusCol] || "Chờ xử lý",
          createdAt: data[i][dateCol] || "",
          pickupDate: data[i][pickupDateCol] || "",
          pickupTime: data[i][pickupTimeCol] || "",
          pickupLocation: data[i][pickupLocCol] || "",
          items: data[i][itemsCol] || "",
          total: data[i][totalCol] || 0,
          paymentMethod: data[i][paymentCol] || ""
        });
      }
    }

    return responseJson({
      success: true,
      count: results.length,
      orders: results
    });
  }

  // Default: Health check
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
