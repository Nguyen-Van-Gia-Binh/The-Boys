import { Product, EarlyBirdVoucher } from "@/types";

export const CAMPAIGN_INFO = {
  title: "Hành Trình Dòng Nước Về Nguồn",
  slogan: "Góp nắng gửi yêu thương, tri ân ngàn người lính",
  groupName: "The Boys Project — Sinh viên ĐH FPT",
  launchDate: "13/10/2026",
  mainEventDate: "17/10/2026",
  orderTarget: 100,
  charityGoal: {
    giftCount: 20,
    costPerGift: 150000,
    totalCharityBudget: 3000000,
    targetAudience: "Các cô chú thương binh nhiễm chất độc da cam, có chỉ số thương tật nặng, không còn người thân chăm sóc.",
    giftDetails: [
      { name: "Hộp sữa Ensure Gold pha sẵn", price: "68.000đ" },
      { name: "Hộp bánh bông lan Solite (18 cái)", price: "53.000đ" },
      { name: "Lốc sữa dinh dưỡng Nutifood ít đường", price: "36.000đ" },
      { name: "Thư tri ân viết tay từ tấm lòng sinh viên", price: "Vô giá" },
    ],
    activity: "01 ngày thiện nguyện 'Một buổi sống cùng anh hùng trong thời bình', sinh hoạt ngoài trời và trực tiếp đọc thư tri ân gửi tặng các chiến sĩ.",
  },
  pickupLocations: [
    "Khuôn viên Đại học FPT TP.HCM (Sảnh chính)",
    "Khuôn viên Đại học FPT TP.HCM (Khu vực Căn tin)",
    "Khuôn viên Đại học FPT TP.HCM (Giao tận phòng học / Thư viện)",
  ],
  pickupTimeSlots: [
    "08:00 - 09:00",
    "09:00 - 10:00",
    "11:00 - 12:00",
    "13:00 - 14:00",
    "14:00 - 15:00",
    "15:00 - 16:00",
    "16:00 - 17:00",
    "custom",
  ],
  banking: {
    bankId: "SHB", // Ngân hàng TMCP Sài Gòn - Hà Nội
    bankName: "SHB (Sài Gòn - Hà Nội)",
    accountNo: "1314532311",
    accountName: "NGUYEN THE VINH",
    memoPrefix: "THEBOYS",
  },
  contacts: {
    hotline: "0906.xxx.xxx",
    email: "theboysproject.fpt@gmail.com",
    facebook: "fb.com/theboysprojectfpt",
  },
};

export const PRODUCTS: Product[] = [
  // --- ĐỒ ĂN VẶT ---
  {
    id: "snack-xike",
    name: "Bánh tráng xì ke",
    price: 6000,
    category: "snack",
    note: "Vị muối tỏi cay thơm nồng đậm, bánh dẻo mịn cuốn miệng",
    image: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=600&auto=format&fit=crop&q=80",
    badge: "Bán chạy nhất",
    color: "bg-[#e8c7a9]",
  },
  {
    id: "snack-tron",
    name: "Bánh tráng trộn đặc biệt",
    price: 8000,
    category: "snack",
    note: "Bánh tráng trộn thấm vị, topping khô bò, rau răm, tắc chua thanh ngọt",
    image: "https://images.unsplash.com/photo-1541544741938-0af808871cc0?w=600&auto=format&fit=crop&q=80",
    color: "bg-[#d7b6a4]",
  },
  {
    id: "snack-sate-tom",
    name: "Bánh tráng giòn sa tế tôm",
    price: 12000,
    category: "snack",
    note: "Bánh tráng giòn rụm phủ sốt sa tế tôm cay the béo ngậy thơm nức mũi",
    image: "https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=600&auto=format&fit=crop&q=80",
    badge: "Siêu giòn",
    color: "bg-[#f2d985]",
  },

  // --- ĐỒ UỐNG ---
  {
    id: "drink-cafe-den",
    name: "Cafe đen nguyên chất",
    price: 12000,
    category: "drink",
    note: "Pha phin đậm vị mộc, đánh thức năng lượng cho ngày học tập năng động",
    image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop&q=80",
    color: "bg-[#c4a482]",
  },
  {
    id: "drink-cafe-sua",
    name: "Cafe sữa truyền thống",
    price: 15000,
    category: "drink",
    note: "Hòa quyện giữa cafe đắng đậm và sữa đặc béo ngậy chuẩn vị Sài Gòn",
    image: "https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=600&auto=format&fit=crop&q=80",
    badge: "Best Seller",
    color: "bg-[#ddb892]",
    options: {
      sizes: [
        { name: "Size Vừa (M)", price: 15000 },
        { name: "Size Lớn (L)", price: 18000 },
      ],
    },
  },
  {
    id: "drink-tra-tac",
    name: "Trà tắc Lipton mát lạnh",
    price: 10000,
    category: "drink",
    note: "Trà Lipton ủ thơm kết hợp tắc tươi chua ngọt đã khát, giải nhiệt tức thì",
    image: "https://images.unsplash.com/photo-1556881286-fc6915169721?w=600&auto=format&fit=crop&q=80",
    badge: "Giải nhiệt",
    color: "bg-[#f5e08c]",
  },

  // --- HOA TƯƠI 20/10 ---
  {
    id: "flower-1",
    name: "01 Bông hoa tươi tuyển chọn",
    price: 19000,
    category: "flower",
    note: "Hoa tươi thắt nơ tinh tế, thích hợp gửi trao lời chúc nhỏ xinh nhân dịp 20/10",
    image: "https://images.unsplash.com/photo-1526047932273-341f2a7631f9?w=600&auto=format&fit=crop&q=80",
    color: "bg-[#f4c2c2]",
  },
  {
    id: "flower-3",
    name: "03 Bông hoa tình cảm",
    price: 49000,
    category: "flower",
    note: "Bó 3 bông hoa trang nhã bọc giấy mộc phong cách vintage",
    image: "https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=600&auto=format&fit=crop&q=80",
    badge: "Tiết kiệm 8k",
    color: "bg-[#f1a7a7]",
  },
  {
    id: "flower-5",
    name: "05 Bông hoa rực rỡ",
    price: 79000,
    category: "flower",
    note: "Bó hoa 5 bông tươi thắm biểu trưng cho sự trân trọng và biết ơn sâu sắc",
    image: "https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?w=600&auto=format&fit=crop&q=80",
    badge: "Yêu thích nhất",
    color: "bg-[#ea899a]",
  },

  // --- COMBO WORKSHOP 17/10 ---
  {
    id: "combo-trai-nghiem",
    name: "Combo Trải Nghiệm (17/10)",
    price: 69000,
    category: "combo",
    isCombo: true,
    comboGift: {
      name: "Bánh tráng trộn đặc biệt",
      quantity: 2,
      description: "Tặng 2 bịch Bánh tráng trộn khi đặt trước",
    },
    note: "Chụp hình lưu niệm + Làm thiệp handmade (Gồm 01 ảnh in + 01 thiệp tự decor và viết thư)",
    image: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=600&auto=format&fit=crop&q=80",
    badge: "Workshop 17/10",
    color: "bg-[#d8e2dc]",
  },
  {
    id: "combo-yeu-thuong",
    name: "Combo Yêu Thương (17/10)",
    price: 89000,
    category: "combo",
    isCombo: true,
    comboGift: {
      name: "Bánh tráng trộn đặc biệt",
      quantity: 2,
      description: "Tặng 2 bịch Bánh tráng trộn khi đặt trước",
    },
    note: "Trọn vẹn tình cảm: Gồm 01 ảnh in + 01 thiệp handmade tự trang trí + 01 bông hoa tươi",
    image: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=600&auto=format&fit=crop&q=80",
    badge: "Ngọt ngào",
    color: "bg-[#ffe5d9]",
  },
  {
    id: "combo-mui-man",
    name: "Combo Mùi Mẫn (17/10)",
    price: 109000,
    category: "combo",
    isCombo: true,
    comboGift: {
      name: "Bánh tráng trộn đặc biệt",
      quantity: 3,
      description: "Tặng 3 bịch Bánh tráng trộn khi đặt trước",
    },
    note: "Gồm 01 ảnh in + 01 file ảnh gốc + 01 bông hoa + 01 thiệp handmade + 01 bình thủy tinh trồng thủy sinh + 01 túi giấy",
    image: "https://images.unsplash.com/photo-1508746829417-e6f548d8d6ed?w=600&auto=format&fit=crop&q=80",
    badge: "Đặc biệt",
    color: "bg-[#ffcad4]",
  },
  {
    id: "combo-hanh-phuc",
    name: "Combo Hạnh Phúc (17/10)",
    price: 169000,
    category: "combo",
    isCombo: true,
    comboGift: {
      name: "Bánh tráng trộn đặc biệt",
      quantity: 3,
      description: "Tặng 3 bịch Bánh tráng trộn khi đặt trước",
    },
    note: "Set quà tặng cao cấp: 01 ảnh in + 02 file ảnh gốc + 01 thiệp handmade + 01 bình thủy sinh + 05 bông hoa tươi + 01 túi giấy sang trọng",
    image: "https://images.unsplash.com/photo-1513151233558-d860c5398176?w=600&auto=format&fit=crop&q=80",
    badge: "Best Gift Choice",
    color: "bg-[#b7e4c7]",
  },
];

export const EARLY_BIRD_VOUCHERS: EarlyBirdVoucher[] = [
  {
    minSpend: 59000,
    discountPercent: 10,
    title: "Voucher 10% Đồ ăn & Đồ uống",
    description: "Giảm 10% trực tiếp cho món ăn vặt, cafe & hoa tươi (từ 59k, không áp dụng cho Combo)",
    applicableCategory: "individual_items",
  },
  {
    minSpend: 89000,
    discountPercent: 10,
    title: "Voucher 10% Món lẻ",
    description: "Giảm 10% trực tiếp cho món ăn vặt, cafe & hoa tươi (từ 89k, không áp dụng cho Combo)",
    applicableCategory: "individual_items",
  },
  {
    minSpend: 149000,
    discountPercent: 15,
    title: "Voucher 15% VIP Món lẻ",
    description: "Giảm 15% trực tiếp cho món ăn vặt, cafe & hoa tươi (từ 149k, không áp dụng cho Combo)",
    applicableCategory: "individual_items",
  },
];

/**
 * Tính toán voucher ưu đãi dựa trên giá trị các món lẻ hợp lệ (không tính combo)
 */
export function calculateVoucherBenefit(eligibleSubtotal: number) {
  if (eligibleSubtotal >= 149000) {
    return {
      current: EARLY_BIRD_VOUCHERS[2],
      next: null,
      neededForNext: 0,
    };
  }
  if (eligibleSubtotal >= 89000) {
    return {
      current: EARLY_BIRD_VOUCHERS[1],
      next: EARLY_BIRD_VOUCHERS[2],
      neededForNext: 149000 - eligibleSubtotal,
    };
  }
  if (eligibleSubtotal >= 59000) {
    return {
      current: EARLY_BIRD_VOUCHERS[0],
      next: EARLY_BIRD_VOUCHERS[1],
      neededForNext: 89000 - eligibleSubtotal,
    };
  }
  return {
    current: null,
    next: EARLY_BIRD_VOUCHERS[0],
    neededForNext: 59000 - eligibleSubtotal,
  };
}
