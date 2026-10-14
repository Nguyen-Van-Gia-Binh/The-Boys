/**
 * =========================================================================
 * GOOGLE APPS SCRIPT ĐỒNG BỘ ĐƠN HÀNG, ỦNG HỘ & MÃ GIẢM GIÁ
 * CHIẾN DỊCH: "HÀNH TRÌNH DÒNG NƯỚC VỀ NGUỒN" — THE BOYS FPT
 * =========================================================================
 * 
 * HỆ THỐNG 3 TABS ĐỘC LẬP TRÊN GOOGLE SPREADSHEET:
 * 
 * 📑 TAB 1: "Đơn hàng" (16 cột A đến P - dành riêng cho món ăn, hoa, combo):
 *    A: Mã đơn hàng | B: Thời gian đặt | C: Họ và tên | D: Số điện thoại | 
 *    E: Email | F: Ngày nhận | G: Khung giờ nhận | H: Địa điểm nhận | 
 *    I: Địa chỉ chi tiết | J: Danh sách món | K: Tạm tính | L: Giảm giá | 
 *    M: Tổng thanh toán | N: Phương thức thanh toán | O: Ghi chú | P: Trạng thái
 * 
 * 💖 TAB 2: "Donations" (8 cột A đến H - DÀNH RIÊNG CHO QUỸ ỦNG HỘ TRI ÂN):
 *    A: Mã ủng hộ (DNxxxx) | B: Thời gian | C: Tên người ủng hộ | D: Số tiền (đ) | 
 *    E: Số điện thoại | F: Lời chúc tri ân | G: Ẩn danh (TRUE/FALSE) | H: Trạng thái
 *    ⚡ Script tự động tạo tab này và format giao diện chuẩn nếu chưa có!
 * 
 * 🎟️ TAB 3: "Vouchers" (8 cột A đến H - QUẢN LÝ MÃ GIẢM GIÁ TRỰC TIẾP):
 *    A: Mã giảm giá | B: Phần trăm giảm (%) | C: Giảm tối đa (đ) | D: Đơn tối thiểu (đ) | 
 *    E: Ngành hàng áp dụng | F: Hạn sử dụng | G: Kích hoạt (Checkbox) | H: Mô tả
 *    ⚡ Tích hợp sẵn 5 mã mặc định, tự tạo Checkbox tick chọn và Dropdown ngành hàng!
 * 
 * 🎁 MENU QUẢN TRỊ TRÊN GOOGLE SHEETS:
 *    Tự động xuất hiện menu "🎁 THE BOYS QUẢN TRỊ" trên thanh công cụ của Sheet:
 *    - 🚀 Khởi tạo toàn bộ Hệ thống (3 Tab tự động)
 *    - 🎟️ Cài đặt lại Tab Vouchers & Dữ liệu mẫu
 *    - ➕ Thêm Mã Giảm Giá mới (hộp thoại nhập nhanh)
 *    - 💖 Cài đặt lại Tab Donations
 *    - 📊 Xem thống kê nhanh Quỹ & Đơn hàng
 * 
 * HƯỚNG DẪN CÀI ĐẶT / DEPLOY:
 * 1. Mở file Google Sheet của dự án.
 * 2. Vào Extensions (Tiện ích mở rộng) -> Apps Script.
 * 3. Dán toàn bộ nội dung file này vào (thay thế mã cũ).
 * 4. Bấm "Triển khai" (Deploy) -> "Quản lý bản triển khai" (Manage deployments).
 * 5. Bấm icon Bút chì (Edit) -> Chọn "Phiên bản mới" (New version) -> Bấm "Triển khai" (Deploy).
 * =========================================================================
 */

// Helper tìm cột linh hoạt theo danh sách tên gọi hoặc vị trí mặc định
function findColumnIndex(headers, names, defaultIndex) {
  for (var i = 0; i < headers.length; i++) {
    var h = String(headers[i] || "").trim().toLowerCase();
    for (var j = 0; j < names.length; j++) {
      if (h === names[j].toLowerCase()) return i;
    }
  }
  return defaultIndex;
}

// Helper bóc tách số an toàn chống lỗi NaN do format chuỗi tiền tệ (ví dụ 150.000đ)
function safeNumber(val) {
  if (typeof val === "number") return val;
  var str = String(val || "").replace(/[^\d]/g, "");
  return Number(str) || 0;
}

// =========================================================================
// 1. TỰ ĐỘNG TẠO & ĐỊNH DẠNG TAB 1: "Đơn hàng" (16 Cột)
// =========================================================================
function getOrCreateOrderSheet(ss) {
  var sheet = ss.getSheetByName("Đơn hàng") ||
    ss.getSheetByName("Orders") ||
    ss.getSheetByName("don_hang") ||
    ss.getSheetByName("Sheet1") ||
    ss.getSheetByName("Trang tính1") ||
    ss.getSheets()[0];

  if (!sheet) {
    sheet = ss.insertSheet("Đơn hàng");
  }

  // Nếu sheet còn trống hoàn toàn, thêm tiêu đề chuẩn
  if (sheet.getLastRow() === 0) {
    sheet.appendRow([
      "Mã đơn hàng",
      "Thời gian đặt",
      "Họ và tên",
      "Số điện thoại",
      "Email",
      "Ngày nhận",
      "Khung giờ nhận",
      "Địa điểm nhận",
      "Địa chỉ chi tiết",
      "Danh sách món",
      "Tạm tính (đ)",
      "Giảm giá (đ)",
      "Tổng thanh toán (đ)",
      "Phương thức thanh toán",
      "Ghi chú",
      "Trạng thái"
    ]);

    var header = sheet.getRange(1, 1, 1, 16);
    header.setBackground("#1F2937"); // Xám than đậm sang trọng
    header.setFontColor("#FFFFFF");
    header.setFontWeight("bold");
    sheet.setFrozenRows(1);

    sheet.setColumnWidth(1, 130); // Mã
    sheet.setColumnWidth(2, 150); // Thời gian
    sheet.setColumnWidth(3, 160); // Họ tên
    sheet.setColumnWidth(4, 130); // SĐT
    sheet.setColumnWidth(5, 180); // Email
    sheet.setColumnWidth(6, 120); // Ngày nhận
    sheet.setColumnWidth(7, 130); // Giờ nhận
    sheet.setColumnWidth(8, 160); // Điểm nhận
    sheet.setColumnWidth(9, 200); // Địa chỉ
    sheet.setColumnWidth(10, 260); // Món
    sheet.setColumnWidth(11, 110); // Tạm tính
    sheet.setColumnWidth(12, 110); // Giảm giá
    sheet.setColumnWidth(13, 130); // Tổng thanh toán
    sheet.setColumnWidth(14, 180); // Phương thức
    sheet.setColumnWidth(15, 200); // Ghi chú
    sheet.setColumnWidth(16, 170); // Trạng thái
  }

  return sheet;
}

// =========================================================================
// 2. TỰ ĐỘNG TẠO & ĐỊNH DẠNG TAB 2: "Donations" (8 Cột)
// =========================================================================
function getOrCreateDonationSheet(ss) {
  var dSheet = ss.getSheetByName("Donations") ||
    ss.getSheetByName("Ủng hộ") ||
    ss.getSheetByName("donations") ||
    ss.getSheetByName("Quyên góp");

  if (!dSheet) {
    dSheet = ss.insertSheet("Donations");
    dSheet.appendRow([
      "Mã ủng hộ",
      "Thời gian",
      "Tên người ủng hộ",
      "Số tiền (đ)",
      "Số điện thoại",
      "Lời chúc tri ân",
      "Ẩn danh",
      "Trạng thái"
    ]);

    var headerRange = dSheet.getRange(1, 1, 1, 8);
    headerRange.setBackground("#315444"); // Xanh rêu Dòng Nước Về Nguồn
    headerRange.setFontColor("#ffffff");
    headerRange.setFontWeight("bold");
    dSheet.setFrozenRows(1);

    dSheet.setColumnWidth(1, 120); // Mã
    dSheet.setColumnWidth(2, 160); // Thời gian
    dSheet.setColumnWidth(3, 180); // Tên
    dSheet.setColumnWidth(4, 130); // Số tiền
    dSheet.setColumnWidth(5, 130); // SĐT
    dSheet.setColumnWidth(6, 320); // Lời chúc
    dSheet.setColumnWidth(7, 90);  // Ẩn danh
    dSheet.setColumnWidth(8, 160); // Trạng thái

    // Format cột số tiền
    dSheet.getRange("D2:D1000").setNumberFormat("#,##0\"đ\"");
  }

  return dSheet;
}

// =========================================================================
// 3. TỰ ĐỘNG TẠO & ĐỊNH DẠNG TAB 3: "Vouchers" (8 Cột)
// =========================================================================
function getOrCreateVoucherSheet(ss) {
  var vSheet = ss.getSheetByName("Vouchers") ||
    ss.getSheetByName("Mã giảm giá") ||
    ss.getSheetByName("vouchers") ||
    ss.getSheetByName("Voucher");

  if (!vSheet) {
    vSheet = ss.insertSheet("Vouchers");

    // Header 8 cột
    vSheet.appendRow([
      "Mã giảm giá",
      "Phần trăm giảm (%)",
      "Giảm tối đa (đ)",
      "Đơn tối thiểu (đ)",
      "Ngành hàng áp dụng",
      "Hạn sử dụng",
      "Kích hoạt",
      "Mô tả"
    ]);

    var headerRange = vSheet.getRange(1, 1, 1, 8);
    headerRange.setBackground("#1B4332"); // Xanh ngọc đậm sang trọng
    headerRange.setFontColor("#FFFFFF");
    headerRange.setFontWeight("bold");
    vSheet.setFrozenRows(1);

    vSheet.setColumnWidth(1, 140); // Mã
    vSheet.setColumnWidth(2, 150); // % Giảm
    vSheet.setColumnWidth(3, 140); // Giảm tối đa
    vSheet.setColumnWidth(4, 140); // Đơn tối thiểu
    vSheet.setColumnWidth(5, 160); // Ngành hàng
    vSheet.setColumnWidth(6, 130); // Hạn sử dụng
    vSheet.setColumnWidth(7, 100); // Kích hoạt
    vSheet.setColumnWidth(8, 380); // Mô tả

    // Thêm 5 mã giảm giá mẫu khởi điểm cho chiến dịch
    var defaultVouchers = [
      ["THEBOYS10", 10, 20000, 50000, "all", "2026-10-25", true, "Giảm 10% tối đa 20.000đ cho đơn từ 50.000đ"],
      ["K20FPT", 15, 25000, 60000, "all", "2026-10-25", true, "Ưu đãi K20 FPTU: Giảm 15% tối đa 25.000đ cho đơn từ 60.000đ"],
      ["TRIAN20", 20, 30000, 100000, "combo", "2026-10-25", true, "Tri ân mùa hoa: Giảm 20% tối đa 30.000đ khi đặt Combo từ 100.000đ"],
      ["HOAYEUTHUONG", 10, 15000, 70000, "flower", "2026-10-25", true, "Giảm 10% tối đa 15.000đ cho sản phẩm Hoa tươi từ 70.000đ"],
      ["BANHTRANG", 10, 10000, 30000, "snack", "2026-10-25", true, "Giảm 10% tối đa 10.000đ cho Đồ ăn vặt từ 30.000đ"]
    ];

    for (var i = 0; i < defaultVouchers.length; i++) {
      vSheet.appendRow(defaultVouchers[i]);
    }

    // Định dạng số cho Cột C (Giảm tối đa) và D (Đơn tối thiểu)
    vSheet.getRange("C2:D100").setNumberFormat("#,##0\"đ\"");
    vSheet.getRange("B2:B100").setNumberFormat("0\"%\"");

    // Cài đặt Checkbox tự động cho cột G (Kích hoạt)
    var checkboxRule = SpreadsheetApp.newDataValidation().requireCheckbox().build();
    vSheet.getRange("G2:G100").setDataValidation(checkboxRule);

    // Cài đặt Dropdown chọn ngành hàng cho cột E
    var categoryRule = SpreadsheetApp.newDataValidation()
      .requireValueInList(["all", "combo", "flower", "snack", "drink"], true)
      .setAllowInvalid(false)
      .build();
    vSheet.getRange("E2:E100").setDataValidation(categoryRule);
  }

  return vSheet;
}

// =========================================================================
// 4. doPost: XỬ LÝ GỬI ĐƠN HÀNG, ĐƠN ỦNG HỘ HOẶC THÊM VOUCHER
// =========================================================================
function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000);

  try {
    if (!e || !e.postData || !e.postData.contents) {
      return responseJson({ success: false, message: "No post data received" });
    }

    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var data = JSON.parse(e.postData.contents);

    // -----------------------------------------------------------------------
    // Nhánh A: Thêm mã giảm giá mới từ xa qua API
    // -----------------------------------------------------------------------
    if (data.type === "voucher" || data.action === "add_voucher") {
      var vSheet = getOrCreateVoucherSheet(ss);
      var code = String(data.code || "").trim().toUpperCase();
      if (!code) {
        return responseJson({ success: false, message: "Mã giảm giá không hợp lệ" });
      }

      var percent = Number(data.discountPercent) || 0;
      var maxDisc = Number(data.maxDiscount) || 0;
      var minSpend = Number(data.minSpend) || 0;
      var cat = String(data.applicableCategory || "all").toLowerCase();
      var exp = String(data.expiryDate || "2026-10-25");
      var active = data.active !== false;
      var desc = String(data.description || ("Giảm " + percent + "%"));

      vSheet.appendRow([code, percent, maxDisc, minSpend, cat, exp, active, desc]);

      return responseJson({
        success: true,
        type: "voucher",
        code: code,
        message: "Đã thêm mã giảm giá thành công"
      });
    }

    // -----------------------------------------------------------------------
    // Nhánh B: Ghi Đơn Ủng Hộ Tri Ân vào Tab "Donations" riêng biệt
    // -----------------------------------------------------------------------
    var isDonation = (data.type === "donation") ||
      (String(data.donationId || data.orderId || "").toUpperCase().indexOf("DN") === 0) ||
      (String(data.items || "").toLowerCase().indexOf("ủng hộ") !== -1 && !data.pickupLocation);

    if (isDonation) {
      var dSheet = getOrCreateDonationSheet(ss);
      var donationId = data.donationId || data.orderId || ("DN" + Math.floor(10000 + Math.random() * 90000));
      var donorName = data.donorName || data.customerName || "Nhà hảo tâm giấu tên";
      var donorAmount = Number(data.amount || data.total || data.subtotal) || 0;
      var donorPhone = data.phone ? ("'" + String(data.phone).replace(/^'/, "")) : "";
      var donorMsg = data.message || data.note || "Gửi gắm yêu thương tri ân các anh hùng thời bình ❤️";
      var isAnon = data.isAnonymous ? "TRUE" : "FALSE";
      var dStatus = data.status || "Đã chuyển khoản (VietQR)";

      dSheet.appendRow([
        donationId,
        data.createdAt || new Date().toLocaleString("vi-VN"),
        donorName,
        donorAmount,
        donorPhone,
        donorMsg,
        isAnon,
        dStatus
      ]);

      var dNewRow = dSheet.getLastRow();
      var dStatusCell = dSheet.getRange(dNewRow, 8);
      dStatusCell.setBackground("#d1e7dd"); // Xanh ngọc nhạt
      dStatusCell.setFontColor("#0f5132");
      dStatusCell.setFontWeight("bold");

      return responseJson({
        success: true,
        result: "success",
        type: "donation",
        donationId: donationId,
        sheet: dSheet.getName(),
        row: dNewRow
      });
    }

    // -----------------------------------------------------------------------
    // Nhánh C: Ghi Đơn Hàng Mua Món Ăn/Hoa/Combo vào Tab "Đơn hàng" (16 Cột)
    // -----------------------------------------------------------------------
    var orderSheet = getOrCreateOrderSheet(ss);
    var isBankTransfer = (data.paymentMethod || "").indexOf("VietQR") !== -1 || (data.paymentMethod || "").indexOf("Chuyển khoản") !== -1;
    var status = data.status || (isBankTransfer ? "Chờ chuyển khoản (VietQR)" : "Chờ xác nhận (Tiền mặt)");

    // Định dạng cột giảm giá có kèm mã voucher nếu có (vd: 20000 (Mã: THEBOYS10))
    var discountValue = Number(data.discount || data.discountAmount) || 0;
    var discountDisplay = discountValue;
    if (data.voucherCode && discountValue > 0) {
      discountDisplay = discountValue + " (Mã: " + data.voucherCode + ")";
    }

    orderSheet.appendRow([
      data.orderId || "",
      data.createdAt || new Date().toLocaleString("vi-VN"),
      data.customerName || "",
      "'" + (data.phone || ""),
      data.email || "",
      data.pickupDate || "",
      data.pickupTime || "",
      data.pickupLocation || "",
      data.address || "",
      data.items || "",
      data.subtotal || 0,
      discountDisplay,
      data.total || 0,
      data.paymentMethod || "",
      data.note || "",
      status
    ]);

    var newRow = orderSheet.getLastRow();
    var statusCell = orderSheet.getRange(newRow, 16);

    if (isBankTransfer) {
      statusCell.setBackground("#fff3cd"); // Vàng nhạt
      statusCell.setFontColor("#664d03");
      statusCell.setFontWeight("bold");
    } else {
      statusCell.setBackground("#f8f9fa"); // Xám nhạt
      statusCell.setFontColor("#333333");
    }

    return responseJson({
      success: true,
      result: "success",
      type: "order",
      orderId: data.orderId,
      sheet: orderSheet.getName(),
      row: newRow
    });

  } catch (error) {
    Logger.log("Error in doPost: " + error.toString());
    return responseJson({ success: false, error: error.toString() });
  } finally {
    lock.releaseLock();
  }
}

// =========================================================================
// 5. doGet: API ĐỌC VOUCHERS, QUYÊN GÓP, TRA CỨU ĐA TAB
// =========================================================================
function doGet(e) {
  var action = (e.parameter.action || "").trim();
  var ss = SpreadsheetApp.getActiveSpreadsheet();

  // =========================================================================
  // ACTION: vouchers - Đọc danh sách mã giảm giá từ Tab "Vouchers"
  // =========================================================================
  if (action === "vouchers") {
    var vSheet = getOrCreateVoucherSheet(ss);
    var vData = vSheet.getDataRange().getValues();

    var voucherList = [];

    if (vData && vData.length >= 2) {
      var vHeaders = vData[0];
      var vCodeCol = findColumnIndex(vHeaders, ["Mã", "Mã giảm giá", "Code", "Voucher Code"], 0);
      var vPercentCol = findColumnIndex(vHeaders, ["Phần trăm", "Phần trăm giảm", "Percent", "% Giảm", "%"], 1);
      var vMaxCol = findColumnIndex(vHeaders, ["Giảm tối đa", "Max Discount", "Tối đa"], 2);
      var vMinSpendCol = findColumnIndex(vHeaders, ["Đơn tối thiểu", "Min Spend", "Tối thiểu"], 3);
      var vCategoryCol = findColumnIndex(vHeaders, ["Ngành hàng", "Danh mục", "Category"], 4);
      var vExpiryCol = findColumnIndex(vHeaders, ["Hạn sử dụng", "Hạn dùng", "Expiry Date", "Expiry"], 5);
      var vActiveCol = findColumnIndex(vHeaders, ["Kích hoạt", "Trạng thái", "Active", "Status"], 6);
      var vDescCol = findColumnIndex(vHeaders, ["Mô tả", "Description", "Chi tiết"], 7);

      for (var r = 1; r < vData.length; r++) {
        var rawCode = String(vData[r][vCodeCol] || "").trim().toUpperCase();
        if (!rawCode) continue;

        // Xử lý giá trị checkbox hoặc chuỗi active
        var rawActive = vData[r][vActiveCol];
        var isActive = true;
        if (typeof rawActive === "boolean") {
          isActive = rawActive;
        } else {
          var strActive = String(rawActive || "").trim().toUpperCase();
          isActive = (strActive === "TRUE" || strActive === "1" || strActive === "BẬT" || strActive === "HOẠT ĐỘNG" || strActive === "");
        }

        // Xử lý hạn sử dụng (nếu Google Sheet tự parse Date object)
        var rawExpiry = vData[r][vExpiryCol];
        var cleanExpiry = "2026-10-25";
        if (rawExpiry instanceof Date) {
          cleanExpiry = Utilities.formatDate(rawExpiry, "GMT+7", "yyyy-MM-dd");
        } else if (rawExpiry) {
          cleanExpiry = String(rawExpiry).trim();
        }

        var rawPercent = Number(vData[r][vPercentCol]) || 0;
        var rawMax = Number(vData[r][vMaxCol]) || 0;
        var rawMinSpend = Number(vData[r][vMinSpendCol]) || 0;
        var rawCategory = String(vData[r][vCategoryCol] || "all").trim().toLowerCase();
        var rawDesc = String(vData[r][vDescCol] || "").trim();

        if (!rawDesc) {
          rawDesc = "Giảm " + rawPercent + "%" +
            (rawMax > 0 ? (" tối đa " + rawMax.toLocaleString("vi-VN") + "đ") : "") +
            (rawMinSpend > 0 ? (" cho đơn từ " + rawMinSpend.toLocaleString("vi-VN") + "đ") : "");
        }

        voucherList.push({
          code: rawCode,
          discountPercent: rawPercent,
          maxDiscount: rawMax,
          minSpend: rawMinSpend,
          applicableCategory: rawCategory || "all",
          expiryDate: cleanExpiry,
          active: isActive,
          description: rawDesc
        });
      }
    }

    return responseJson({
      success: true,
      count: voucherList.length,
      sheet: vSheet.getName(),
      vouchers: voucherList
    });
  }

  // =========================================================================
  // ACTION: donations - Đọc trực tiếp từ Tab "Donations" riêng biệt
  // =========================================================================
  if (action === "donations") {
    var dSheet = getOrCreateDonationSheet(ss);
    var list = [];

    // 1. Đọc từ Tab "Donations"
    var dData = dSheet.getDataRange().getValues();
    if (dData && dData.length >= 2) {
      var dHeaders = dData[0];
      var dIdCol = findColumnIndex(dHeaders, ["Mã", "Mã ủng hộ", "Donation ID", "ID"], 0);
      var dDateCol = findColumnIndex(dHeaders, ["Thời gian", "Ngày", "Timestamp", "Date"], 1);
      var dNameCol = findColumnIndex(dHeaders, ["Tên người ủng hộ", "Họ tên", "Tên", "Name"], 2);
      var dAmountCol = findColumnIndex(dHeaders, ["Số tiền (đ)", "Số tiền", "Amount"], 3);
      var dNoteCol = findColumnIndex(dHeaders, ["Lời chúc tri ân", "Lời chúc", "Ghi chú", "Message", "Note"], 5);
      var dAnonCol = findColumnIndex(dHeaders, ["Ẩn danh", "Anonymous"], 6);
      var dStatusCol = findColumnIndex(dHeaders, ["Trạng thái", "Status"], 7);

      for (var i = 1; i < dData.length; i++) {
        var rowId = String(dData[i][dIdCol] || "").trim().toUpperCase();
        var rawAmt = safeNumber(dData[i][dAmountCol]);
        if (!rowId || rawAmt <= 0) continue;

        var isAnon = String(dData[i][dAnonCol] || "").trim().toUpperCase() === "TRUE";
        var cleanName = isAnon ? "Nhà hảo tâm giấu tên" : (String(dData[i][dNameCol] || "Nhà hảo tâm giấu tên").trim());
        var cleanNote = String(dData[i][dNoteCol] || "Gửi gắm yêu thương tri ân các anh hùng thời bình ❤️").trim();
        var rawDate = String(dData[i][dDateCol] || "").split(" ")[0] || "14/10/2026";
        var rowStatus = String(dData[i][dStatusCol] || "Đã ghi nhận").trim();

        list.push({
          id: rowId,
          name: cleanName || "Nhà hảo tâm giấu tên",
          amount: rawAmt,
          message: cleanNote,
          createdAt: rawDate,
          isAnonymous: isAnon,
          status: rowStatus
        });
      }
    }

    // 2. Dự phòng: Quét thêm các đơn ủng hộ cũ từng lưu ở Sheet Đơn hàng nếu tab Donations chưa có dữ liệu
    if (list.length === 0) {
      var legacySheet = getOrCreateOrderSheet(ss);
      var lData = legacySheet.getDataRange().getValues();
      if (lData && lData.length >= 2) {
        var lHeaders = lData[0];
        var lIdCol = findColumnIndex(lHeaders, ["Mã đơn", "Mã đơn hàng", "Order ID"], 0);
        var lDateCol = findColumnIndex(lHeaders, ["Thời gian", "Thời gian đặt"], 1);
        var lNameCol = findColumnIndex(lHeaders, ["Họ tên", "Họ và tên", "Name"], 2);
        var lItemsCol = findColumnIndex(lHeaders, ["Món đặt", "Sản phẩm", "Items"], 9);
        var lTotalCol = findColumnIndex(lHeaders, ["Tổng thanh toán", "Tổng tiền", "Total"], 12);
        var lNoteCol = findColumnIndex(lHeaders, ["Ghi chú", "Note"], 14);
        var lStatusCol = findColumnIndex(lHeaders, ["Trạng thái", "Status"], 15);

        for (var j = 1; j < lData.length; j++) {
          var legId = String(lData[j][lIdCol] || "").trim().toUpperCase();
          var legItems = String(lData[j][lItemsCol] || "").toLowerCase();
          var legTotal = safeNumber(lData[j][lTotalCol]);

          if ((legId.indexOf("DN") === 0 || legItems.indexOf("ủng hộ") !== -1) && legTotal > 0) {
            list.push({
              id: legId,
              name: String(lData[j][lNameCol] || "Nhà hảo tâm giấu tên").replace(/^\[DONATION\]\s*/i, "").trim(),
              amount: legTotal,
              message: String(lData[j][lNoteCol] || "").replace(/^\[LỜI CHÚC TRI ÂN\]:\s*"?/i, "").replace(/"$/, "").trim(),
              createdAt: String(lData[j][lDateCol] || "").split(" ")[0] || "14/10/2026",
              status: String(lData[j][lStatusCol] || "Đã ghi nhận")
            });
          }
        }
      }
    }

    // Sắp xếp theo số tiền ủng hộ từ cao xuống thấp
    list.sort(function (a, b) {
      return b.amount - a.amount;
    });

    return responseJson({
      success: true,
      count: list.length,
      donations: list,
      sheet: dSheet.getName()
    });
  }

  // =========================================================================
  // ACTION: lookup - Tra cứu thông minh đa tab (Đơn hàng DH & Đơn ủng hộ DN)
  // =========================================================================
  if (action === "lookup") {
    var orderId = (e.parameter.orderId || "").trim().toUpperCase();
    var phone = (e.parameter.phone || "").trim();

    if (!orderId && !phone) {
      return responseJson({ success: false, message: "Cần cung cấp orderId hoặc phone" });
    }

    var cleanPhoneQuery = phone ? phone.replace(/[^\d]/g, "") : "";
    var results = [];

    function isPhoneMatch(rawPhone) {
      if (!cleanPhoneQuery) return false;
      var clean = String(rawPhone || "").replace(/[^\d]/g, "");
      return clean && (clean === cleanPhoneQuery || clean.endsWith(cleanPhoneQuery) || clean.indexOf(cleanPhoneQuery) !== -1);
    }

    // 1. Tra cứu trong Tab "Donations"
    var shouldCheckDonations = (orderId.indexOf("DN") === 0) || (cleanPhoneQuery.length > 0) || (!orderId && phone) || (orderId && orderId.indexOf("DH") !== 0);

    if (shouldCheckDonations) {
      var dLookupSheet = getOrCreateDonationSheet(ss);
      var dDataLookup = dLookupSheet.getDataRange().getValues();
      if (dDataLookup && dDataLookup.length >= 2) {
        var dHeadersLookup = dDataLookup[0];
        var dIdCol = findColumnIndex(dHeadersLookup, ["Mã", "Mã ủng hộ", "Donation ID"], 0);
        var dDateCol = findColumnIndex(dHeadersLookup, ["Thời gian", "Ngày"], 1);
        var dNameCol = findColumnIndex(dHeadersLookup, ["Tên người ủng hộ", "Họ tên", "Tên"], 2);
        var dAmountCol = findColumnIndex(dHeadersLookup, ["Số tiền (đ)", "Số tiền"], 3);
        var dPhoneCol = findColumnIndex(dHeadersLookup, ["Số điện thoại", "SĐT"], 4);
        var dNoteCol = findColumnIndex(dHeadersLookup, ["Lời chúc tri ân", "Lời chúc", "Ghi chú"], 5);
        var dStatusCol = findColumnIndex(dHeadersLookup, ["Trạng thái", "Status"], 7);

        for (var di = 1; di < dDataLookup.length; di++) {
          var rowDnId = String(dDataLookup[di][dIdCol] || "").trim().toUpperCase();
          var rowDnPhone = String(dDataLookup[di][dPhoneCol] || "");

          var isMatchDn = false;
          if (orderId && (rowDnId === orderId || rowDnId.indexOf(orderId) !== -1)) isMatchDn = true;
          if (cleanPhoneQuery && isPhoneMatch(rowDnPhone)) isMatchDn = true;

          if (isMatchDn) {
            results.push({
              orderId: rowDnId,
              customerName: dDataLookup[di][dNameCol] || "Nhà hảo tâm giấu tên",
              phone: rowDnPhone.replace(/^'/, ""),
              status: dDataLookup[di][dStatusCol] || "Đã vào quỹ tri ân",
              createdAt: dDataLookup[di][dDateCol] || "",
              pickupDate: "Ủng hộ trực tiếp",
              pickupTime: "N/A",
              pickupLocation: "Quỹ Dòng Nước Về Nguồn",
              items: "❤️ Ủng hộ Quỹ Quà Tặng Tri Ân",
              total: safeNumber(dDataLookup[di][dAmountCol]),
              paymentMethod: "Chuyển khoản VietQR",
              note: dDataLookup[di][dNoteCol] || "",
              isDonation: true
            });
          }
        }
      }
    }

    // 2. Tra cứu trong Tab "Đơn hàng"
    var shouldCheckOrders = (orderId.indexOf("DH") === 0) || (cleanPhoneQuery.length > 0) || (!orderId && phone) || (orderId && orderId.indexOf("DN") !== 0);

    if (shouldCheckOrders) {
      var orderLookupSheet = getOrCreateOrderSheet(ss);
      var oData = orderLookupSheet.getDataRange().getValues();

      if (oData && oData.length >= 2) {
        var oHeaders = oData[0];
        var oIdCol = findColumnIndex(oHeaders, ["Mã đơn", "Mã đơn hàng", "Order ID"], 0);
        var oDateCol = findColumnIndex(oHeaders, ["Thời gian", "Thời gian đặt"], 1);
        var oNameCol = findColumnIndex(oHeaders, ["Họ tên", "Họ và tên", "Name"], 2);
        var oPhoneCol = findColumnIndex(oHeaders, ["SĐT", "Số điện thoại", "Phone"], 3);
        var oPickupDateCol = findColumnIndex(oHeaders, ["Ngày nhận", "Pickup Date"], 5);
        var oPickupTimeCol = findColumnIndex(oHeaders, ["Khung giờ", "Khung giờ nhận"], 6);
        var oPickupLocCol = findColumnIndex(oHeaders, ["Địa điểm", "Địa điểm nhận"], 7);
        var oItemsCol = findColumnIndex(oHeaders, ["Món đặt", "Sản phẩm", "Items"], 9);
        var oTotalCol = findColumnIndex(oHeaders, ["Tổng thanh toán", "Tổng tiền", "Total"], 12);
        var oPaymentCol = findColumnIndex(oHeaders, ["Phương thức", "Phương thức thanh toán"], 13);
        var oNoteCol = findColumnIndex(oHeaders, ["Ghi chú", "Note"], 14);
        var oStatusCol = findColumnIndex(oHeaders, ["Trạng thái", "Status"], 15);

        for (var oi = 1; oi < oData.length; oi++) {
          var rowDhId = String(oData[oi][oIdCol] || "").trim().toUpperCase();
          var rowDhPhone = String(oData[oi][oPhoneCol] || "");
          var rowDhItems = String(oData[oi][oItemsCol] || "");

          var isMatchDh = false;
          if (orderId && (rowDhId === orderId || rowDhId.indexOf(orderId) !== -1)) isMatchDh = true;
          if (cleanPhoneQuery && isPhoneMatch(rowDhPhone)) isMatchDh = true;

          if (isMatchDh) {
            results.push({
              orderId: rowDhId,
              customerName: oData[oi][oNameCol] || "",
              phone: rowDhPhone.replace(/^'/, ""),
              status: oData[oi][oStatusCol] || "Chờ xử lý",
              createdAt: oData[oi][oDateCol] || "",
              pickupDate: oData[oi][oPickupDateCol] || "",
              pickupTime: oData[oi][oPickupTimeCol] || "",
              pickupLocation: oData[oi][oPickupLocCol] || "",
              items: rowDhItems,
              total: safeNumber(oData[oi][oTotalCol]),
              paymentMethod: oData[oi][oPaymentCol] || "",
              note: oData[oi][oNoteCol] || "",
              isDonation: false
            });
          }
        }
      }
    }

    return responseJson({
      success: true,
      count: results.length,
      orders: results
    });
  }

  // Mặc định: Health check
  return responseJson({
    status: "active",
    campaign: "Hành Trình Dòng Nước Về Nguồn - The Boys",
    tabs: ["Đơn hàng", "Donations", "Vouchers"],
    timestamp: new Date().toLocaleString("vi-VN")
  });
}

function responseJson(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

// =========================================================================
// 6. MENU QUẢN TRỊ TRÊN GOOGLE SHEETS ("🎁 THE BOYS QUẢN TRỊ")
// =========================================================================

/**
 * Tự động tạo Menu khi mở file Google Sheets
 */
function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu("🎁 THE BOYS QUẢN TRỊ")
    .addItem("🚀 Khởi tạo toàn bộ Hệ thống (3 Tabs)", "menuInitAllSheets")
    .addSeparator()
    .addItem("🎟️ Cài đặt lại Tab Vouchers & 5 Mã Mẫu", "menuInitVouchers")
    .addItem("➕ Thêm Mã Giảm Giá Mới...", "menuAddNewVoucher")
    .addSeparator()
    .addItem("💖 Cài đặt lại Tab Donations (Ủng hộ)", "menuInitDonations")
    .addItem("📦 Cài đặt lại Tab Đơn Hàng", "menuInitOrders")
    .addSeparator()
    .addItem("📊 Xem Thống Kê Nhanh Quỹ & Đơn Hàng", "menuShowStats")
    .addToUi();
}

/**
 * 1 Click khởi tạo cả 3 tab
 */
function menuInitAllSheets() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  getOrCreateOrderSheet(ss);
  getOrCreateDonationSheet(ss);
  getOrCreateVoucherSheet(ss);

  SpreadsheetApp.getUi().alert(
    "✅ THÀNH CÔNG!",
    "Đã khởi tạo và đồng bộ đầy đủ 3 Tab:\n" +
    "1. 📑 Đơn hàng (16 cột)\n" +
    "2. 💖 Donations (8 cột)\n" +
    "3. 🎟️ Vouchers (8 cột kèm 5 mã mẫu & checkbox)\n\n" +
    "Hệ thống đã sẵn sàng kết nối với Website The Boys!",
    SpreadsheetApp.getUi().ButtonSet.OK
  );
}

/**
 * Cài đặt lại Tab Vouchers
 */
function menuInitVouchers() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var vSheet = getOrCreateVoucherSheet(ss);
  SpreadsheetApp.getUi().alert(
    "🎟️ TAB VOUCHERS SẴN SÀNG",
    "Tab '" + vSheet.getName() + "' đã được cài đặt với 8 cột chuẩn, 5 mã giảm giá mẫu, checkbox bật/tắt và dropdown ngành hàng.\n\n" +
    "Bạn có thể tick/bỏ tick ô ở cột 'Kích hoạt' để bật/tắt mã giảm giá thời gian thực!",
    SpreadsheetApp.getUi().ButtonSet.OK
  );
}

/**
 * Hộp thoại thêm mã giảm giá nhanh trực tiếp trên Google Sheets
 */
function menuAddNewVoucher() {
  var ui = SpreadsheetApp.getUi();
  var promptCode = ui.prompt("➕ Thêm Voucher", "Nhập Mã Giảm Giá mới (VD: TRIANK20):", ui.ButtonSet.OK_CANCEL);
  if (promptCode.getSelectedButton() !== ui.Button.OK) return;
  var code = promptCode.getResponseText().trim().toUpperCase();
  if (!code) {
    ui.alert("Lỗi: Mã giảm giá không được để trống!");
    return;
  }

  var promptPercent = ui.prompt("➕ % Giảm", "Nhập phần trăm giảm (VD: 15 cho 15%):", ui.ButtonSet.OK_CANCEL);
  if (promptPercent.getSelectedButton() !== ui.Button.OK) return;
  var percent = Number(promptPercent.getResponseText().replace("%", "").trim()) || 10;

  var promptMax = ui.prompt("➕ Giảm tối đa (đ)", "Nhập số tiền giảm tối đa (VD: 25000):", ui.ButtonSet.OK_CANCEL);
  if (promptMax.getSelectedButton() !== ui.Button.OK) return;
  var maxDiscount = Number(promptMax.getResponseText().replace(/[^\d]/g, "")) || 20000;

  var promptMin = ui.prompt("➕ Đơn tối thiểu (đ)", "Nhập giá trị đơn hàng tối thiểu (VD: 50000):", ui.ButtonSet.OK_CANCEL);
  if (promptMin.getSelectedButton() !== ui.Button.OK) return;
  var minSpend = Number(promptMin.getResponseText().replace(/[^\d]/g, "")) || 50000;

  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var vSheet = getOrCreateVoucherSheet(ss);

  var desc = "Giảm " + percent + "% tối đa " + maxDiscount.toLocaleString("vi-VN") + "đ cho đơn từ " + minSpend.toLocaleString("vi-VN") + "đ";

  vSheet.appendRow([code, percent, maxDiscount, minSpend, "all", "2026-10-25", true, desc]);

  ui.alert("🎉 ĐÃ THÊM THÀNH CÔNG!", "Mã giảm giá [" + code + "] đã được thêm vào tab Vouchers và kích hoạt ngay!", ui.ButtonSet.OK);
}

/**
 * Cài đặt lại Tab Donations
 */
function menuInitDonations() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var dSheet = getOrCreateDonationSheet(ss);
  SpreadsheetApp.getUi().alert(
    "💖 TAB DONATIONS SẴN SÀNG",
    "Tab '" + dSheet.getName() + "' đã được cài đặt 8 cột chuẩn chuyên biệt cho Quỹ Tri Ân.\n" +
    "Các khoản ủng hộ từ Website sẽ được lưu tự động vào đây!",
    SpreadsheetApp.getUi().ButtonSet.OK
  );
}

/**
 * Cài đặt lại Tab Đơn hàng
 */
function menuInitOrders() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var oSheet = getOrCreateOrderSheet(ss);
  SpreadsheetApp.getUi().alert(
    "📦 TAB ĐƠN HÀNG SẴN SÀNG",
    "Tab '" + oSheet.getName() + "' đã được cài đặt 16 cột chuẩn chuyên biệt cho đơn mua món ăn, hoa và combo!",
    SpreadsheetApp.getUi().ButtonSet.OK
  );
}

/**
 * Xem nhanh báo cáo thống kê
 */
function menuShowStats() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var ui = SpreadsheetApp.getUi();

  // Đếm đơn hàng
  var oSheet = ss.getSheetByName("Đơn hàng") || ss.getSheets()[0];
  var oRows = Math.max(0, oSheet.getLastRow() - 1);
  var oTotalRevenue = 0;
  if (oRows > 0) {
    var oVals = oSheet.getRange(2, 13, oRows, 1).getValues();
    for (var r = 0; r < oVals.length; r++) {
      oTotalRevenue += safeNumber(oVals[r][0]);
    }
  }

  // Đếm quyên góp
  var dSheet = ss.getSheetByName("Donations") || ss.getSheetByName("Ủng hộ");
  var dRows = dSheet ? Math.max(0, dSheet.getLastRow() - 1) : 0;
  var dTotalAmount = 0;
  if (dSheet && dRows > 0) {
    var dVals = dSheet.getRange(2, 4, dRows, 1).getValues();
    for (var d = 0; d < dVals.length; d++) {
      dTotalAmount += safeNumber(dVals[d][0]);
    }
  }

  // Đếm voucher
  var vSheet = ss.getSheetByName("Vouchers") || ss.getSheetByName("Mã giảm giá");
  var vRows = vSheet ? Math.max(0, vSheet.getLastRow() - 1) : 0;

  ui.alert(
    "📊 BÁO CÁO NHANH CHIẾN DỊCH THE BOYS",
    "--------------------------------------------------\n" +
    "💖 QUỸ ỦNG HỘ TRI ÂN (Donations):\n" +
    "  • Số lượt ủng hộ: " + dRows + " lượt\n" +
    "  • Tổng tiền quyên góp: " + dTotalAmount.toLocaleString("vi-VN") + " VNĐ\n" +
    "--------------------------------------------------\n" +
    "📦 ĐƠN MUA HÀNG (Món ăn / Hoa / Combo):\n" +
    "  • Số đơn hàng: " + oRows + " đơn\n" +
    "  • Tổng doanh thu: " + oTotalRevenue.toLocaleString("vi-VN") + " VNĐ\n" +
    "--------------------------------------------------\n" +
    "🎟️ MÃ GIẢM GIÁ (Vouchers):\n" +
    "  • Tổng số voucher trong kho: " + vRows + " mã\n" +
    "--------------------------------------------------",
    ui.ButtonSet.OK
  );
}
