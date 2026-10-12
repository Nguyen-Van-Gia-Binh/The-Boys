/**
 * =========================================================================
 * GOOGLE APPS SCRIPT ĐỒNG BỘ ĐƠN HÀNG & TỰ ĐỘNG ĐỐI SOÁT SEPAY.VN
 * CHIẾN DỊCH: "HÀNH TRÌNH DÒNG NƯỚC VỀ NGUỒN" — THE BOYS FPT
 * =========================================================================
 * 
 * HỆ THỐNG GỒM 2 TÍNH NĂNG TỰ ĐỘNG:
 * 1. Tiếp nhận đơn hàng mới từ Website Next.js -> Ghi dòng mới vào Sheet.
 * 2. Tiếp nhận Webhook từ SePay khi có biến động tài khoản ngân hàng SHB ->
 *    Tự động tìm mã đơn hàng (ví dụ: DH1082) và đổi trạng thái sang "Đã thanh toán (SePay)" + tô màu xanh lá!
 * 
 * -------------------------------------------------------------------------
 * HƯỚNG DẪN CÀI ĐẶT NHANH (MẤT 2 PHÚT):
 * -------------------------------------------------------------------------
 * BƯỚC 1: GOOGLE SHEET
 * 1. Mở trang Google Sheet của nhóm:
 *    Tạo dòng tiêu đề tại Hàng 1 gồm 16 cột (A đến P):
 *    A: Mã đơn hàng | B: Thời gian đặt | C: Họ và tên | D: Số điện thoại | 
 *    E: Email | F: Ngày nhận | G: Khung giờ nhận | H: Địa điểm nhận | 
 *    I: Địa chỉ chi tiết | J: Danh sách món | K: Tạm tính | L: Giảm giá | 
 *    M: Tổng thanh toán | N: Phương thức thanh toán | O: Ghi chú | P: Trạng thái
 * 
 * BƯỚC 2: CÀI ĐẶT APPS SCRIPT
 * 2. Vào menu: Tiện ích mở rộng (Extensions) -> Apps Script.
 * 3. Xóa sạch code cũ, Copy & Dán toàn bộ nội dung file này vào.
 * 4. Bấm "Lưu" (Save - biểu tượng đĩa mềm hoặc Ctrl+S).
 * 
 * BƯỚC 3: TRIỂN KHAI ỨNG DỤNG WEB (DEPLOY)
 * 5. Bấm nút "Triển khai" (Deploy) ở góc trên bên phải -> Chọn "Triển khai mới" (New deployment).
 * 6. Chọn loại: "Ứng dụng web" (Web app):
 *    - Mô tả: "The Boys Webhook + SePay"
 *    - Thực thi dưới quyền: "Tôi" (Me)
 *    - Ai có quyền truy cập: "Bất kỳ ai" (Anyone)  <--- BẮT BUỘC ĐỂ NHẬN ĐƯỢC WEBHOOK
 * 7. Bấm "Triển khai" (Deploy) -> "Ủy quyền truy cập" (Authorize access) -> Chọn tài khoản Google của bạn -> Bấm "Advanced" -> "Go to ... (unsafe)" -> "Allow".
 * 8. Copy đường link "URL ứng dụng web" (Web app URL) có dạng:
 *    https://script.google.com/macros/s/AKfycbx.../exec
 * 
 * BƯỚC 4: KẾT NỐI
 * 9. Dán URL này vào:
 *    a) File .env.local trên dự án Next.js (và Vercel Environment Variables):
 *       GOOGLE_SHEET_WEBHOOK_URL="https://script.google.com/macros/s/AKfycbx.../exec"
 *    b) Trang quản trị SePay.vn:
 *       Vào menu "Tích hợp Webhook" -> Bấm "Thêm Webhook" ->
 *       Dán URL Apps Script trên vào ô "Webhook URL" -> Chọn Tài khoản SHB của bạn -> Bấm Lưu.
 * =========================================================================
 */

function doPost(e) {
  var lock = LockService.getScriptLock();
  // Đợi tối đa 10 giây để tránh xung đột ghi đè dòng
  lock.tryLock(10000);

  try {
    if (!e || !e.postData || !e.postData.contents) {
      return responseJson({ success: false, message: "No post data received" });
    }

    var data = JSON.parse(e.postData.contents);
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

    // KIỂM TRA NẾU ĐÂY LÀ WEBHOOK TỪ SEPAY
    // SePay gửi payload có gateway, transferType, transferAmount, transactionDate, content,...
    var isSePay = !!(
      data.gateway || 
      data.transferType || 
      data.transactionDate || 
      (data.transferAmount !== undefined && (data.content || data.transactionContent || data.description))
    );

    if (isSePay) {
      return handleSePayWebhook(sheet, data);
    } else {
      return handleNewOrder(sheet, data);
    }

  } catch (error) {
    Logger.log("Error in doPost: " + error.toString());
    return responseJson({ success: false, error: error.toString() });
  } finally {
    lock.releaseLock();
  }
}

/**
 * Xử lý webhook thanh toán từ SePay
 */
function handleSePayWebhook(sheet, data) {
  // Chỉ nhận tiền vào (transferType == "in")
  if (data.transferType && data.transferType.toLowerCase() !== "in") {
    return responseJson({ success: true, message: "Ignored transfer out" });
  }

  var rawContent = (data.content || data.transactionContent || data.description || "").toString().toUpperCase();
  
  // Tìm mã đơn hàng DHxxxx trong nội dung chuyển khoản
  // Khớp với các định dạng: THEBOYS DH1082, DH1082, THEBOYS-DH1082,...
  var match = rawContent.match(/DH\s*[-_]?\s*(\d{4,6})/i);
  if (!match) {
    return responseJson({ 
      success: false, 
      message: "Khong tim thay ma don DH trong noi dung: " + rawContent 
    });
  }

  var extractedOrderCode = "DH" + match[1]; // Ví dụ: DH1082
  var lastRow = sheet.getLastRow();
  if (lastRow < 2) {
    return responseJson({ success: false, message: "Sheet chua co du lieu don hang" });
  }

  // Đọc danh sách mã đơn hàng ở Cột A (từ dòng 2)
  var orderIds = sheet.getRange(2, 1, lastRow - 1, 1).getValues();
  var targetRow = -1;

  var cleanTarget = extractedOrderCode.replace(/[^A-Z0-9]/g, "");

  for (var i = 0; i < orderIds.length; i++) {
    var cellValue = (orderIds[i][0] || "").toString().trim().toUpperCase().replace(/[^A-Z0-9]/g, "");
    if (cellValue === cleanTarget || cellValue.indexOf(cleanTarget) !== -1) {
      targetRow = i + 2; // +2 vì bắt đầu từ dòng 2 (dòng 1 là tiêu đề)
      break;
    }
  }

  if (targetRow > 0) {
    // Cột P (cột 16) là Trạng thái -> Đổi thành "Đã thanh toán (SePay)" và tô màu xanh lá
    var statusCell = sheet.getRange(targetRow, 16);
    statusCell.setValue("Đã thanh toán (SePay)");
    statusCell.setBackground("#d1e7dd"); // Xanh lá pastel dễ nhìn
    statusCell.setFontColor("#0f5132");
    statusCell.setFontWeight("bold");

    // Cột O (cột 15) là Ghi chú -> Thêm lịch sử giao dịch SePay
    var noteCell = sheet.getRange(targetRow, 15);
    var currentNote = noteCell.getValue() || "";
    var amountFormatted = Number(data.transferAmount || 0).toLocaleString("vi-VN") + "đ";
    var sePayLog = "[SePay: Đã nhận " + amountFormatted + " lúc " + (data.transactionDate || new Date().toLocaleString("vi-VN")) + "]";
    
    noteCell.setValue(currentNote ? currentNote + " | " + sePayLog : sePayLog);

    return responseJson({
      success: true,
      message: "Xac nhan thanh toan don hang " + extractedOrderCode + " thanh cong!",
      orderId: extractedOrderCode,
      row: targetRow
    });
  } else {
    return responseJson({
      success: false,
      message: "Khong tim thay don hang co ma " + extractedOrderCode + " tren Sheet"
    });
  }
}

/**
 * Xử lý đơn hàng mới gửi từ Website Next.js
 */
function handleNewOrder(sheet, data) {
  var isBankTransfer = (data.paymentMethod || "").indexOf("VietQR") !== -1 || (data.paymentMethod || "").indexOf("Chuyển khoản") !== -1;
  var status = data.status || (isBankTransfer ? "Chờ chuyển khoản (VietQR)" : "Chờ xác nhận (Tiền mặt)");

  sheet.appendRow([
    data.orderId || "",
    data.createdAt || new Date().toLocaleString("vi-VN"),
    data.customerName || "",
    "'" + (data.phone || ""), // Nháy đơn để giữ số 0 ở đầu SĐT
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

  // Định dạng màu trạng thái ban đầu cho dễ theo dõi
  if (isBankTransfer) {
    statusCell.setBackground("#fff3cd"); // Vàng nhạt chờ chuyển khoản
    statusCell.setFontColor("#664d03");
  } else {
    statusCell.setBackground("#f8f9fa"); // Xám nhạt tiền mặt
    statusCell.setFontColor("#333333");
  }

  return responseJson({
    success: true,
    result: "success",
    orderId: data.orderId,
    row: newRow
  });
}

/**
 * Trả về JSON chuẩn cho webhook
 */
function responseJson(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Xử lý GET request (kiểm tra trạng thái hoạt động)
 */
function doGet(e) {
  return responseJson({
    status: "active",
    campaign: "Hành Trình Dòng Nước Về Nguồn - The Boys",
    sePayReady: true,
    timestamp: new Date().toLocaleString("vi-VN")
  });
}
