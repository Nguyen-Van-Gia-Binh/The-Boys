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
    "Sảnh Gương — Nơi tổ chức Workshop (Ngày 17/10)",
    "Khuôn viên Đại học FPT TP.HCM (Sảnh chính)",
    "Khuôn viên Đại học FPT TP.HCM (Khu vực Căn tin)",
    "Khuôn viên Đại học FPT TP.HCM (Giao tận phòng học / Thư viện)",
  ],
  pickupTimeSlots: [
    "08:00 - 09:00",
    "09:00 - 10:00",
    "10:00 - 11:00",
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
    id: "snack-ngu-vi",
    name: "Bánh tráng ngũ vị",
    price: 10000,
    category: "snack",
    note: "Bánh tráng ngũ vị thơm lừng đậm đà với 5 vị hấp dẫn: tôm, sa tế bò, rong biển, cua rang me, gà giòn cay cuốn hút",
    image: "/images/banh-trang-ngu-vi.jpg",
    badge: "Món mới 10k",
    color: "bg-[#e8c7a9]",
  },
  {
    id: "snack-thach-trai-cay",
    name: "Thạch sữa chua Yogurt Jelly",
    price: 25000,
    category: "snack",
    note: "Thạch sữa chua Đài Loan vị dâu & vị truyền thống thanh mát dẻo mịn, bổ sung lợi khuẩn giải nhiệt cực đã",
    image: "/images/thach-sua-chua.jpg",
    badge: "Món mới 25k",
    color: "bg-[#fce7f3]",
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

  // --- HOA TỰ GÓI 20/10 ---
  {
    id: "flower-hong-1",
    name: "1 Hoa hồng",
    price: 30000,
    category: "flower",
    note: "01 Bông hoa hồng phớt sang trọng trên túi kraft quai xách mộc mạc, thắt nơ lụa hồng xinh xắn kèm thiệp chúc mừng",
    image: "/images/hoa-hong-1-bong.jpg",
    badge: "Hoa tự gói 30k",
    color: "bg-[#f4c2c2]",
  },
  {
    id: "flower-dong-tien-1",
    name: "1 Hoa đồng tiền",
    price: 35000,
    category: "flower",
    note: "01 Bông hoa đồng tiền hồng pastel gói giấy nón vân nổi trang nhã, thắt nơ lụa đào xinh xắn mang ý nghĩa may mắn và khởi sắc",
    image: "/images/hoa-dong-tien-1-bong.jpg",
    badge: "Hoa tự gói 35k",
    color: "bg-[#ffe5d9]",
  },
  {
    id: "flower-bo-3",
    name: "Bó 3 bông",
    price: 79000,
    category: "flower",
    badge: "Từ 79K",
    note: "Bó 3 bông hoa tự gói trang nhã bọc giấy mộc vintage (+5K cho mỗi bông đồng tiền)",
    image: "https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=600&auto=format&fit=crop&q=80",
    color: "bg-[#f1a7a7]",
    options: {
      sizes: [
        { name: "3 hoa hồng", price: 79000 },
        { name: "2 hồng + 1 đồng tiền", price: 84000 },
        { name: "1 hồng + 2 đồng tiền", price: 89000 },
        { name: "3 hoa đồng tiền", price: 94000 },
      ],
    },
  },
  {
    id: "flower-bo-5",
    name: "Bó 5 bông",
    price: 119000,
    category: "flower",
    badge: "Từ 119K",
    note: "Bó 5 bông hoa tự gói rực rỡ sắc màu tri ân (+5K cho mỗi bông đồng tiền)",
    image: "https://images.unsplash.com/photo-1526047932273-341f2a7631f9?w=600&auto=format&fit=crop&q=80",
    color: "bg-[#ea899a]",
    options: {
      sizes: [
        { name: "5 hoa hồng", price: 119000 },
        { name: "4 hồng + 1 đồng tiền", price: 124000 },
        { name: "3 hồng + 2 đồng tiền", price: 129000 },
        { name: "2 hồng + 3 đồng tiền", price: 134000 },
        { name: "1 hồng + 4 đồng tiền", price: 139000 },
        { name: "5 hoa đồng tiền", price: 144000 },
      ],
    },
  },

  // --- COMBO 17/10 ---
  {
    id: "combo-gui-loi",
    name: "Gửi lời",
    price: 59000,
    category: "combo",
    isCombo: true,
    comboGift: {
      name: "Bánh tráng ngũ vị",
      quantity: 2,
      description: "Tặng 2 bịch Bánh tráng ngũ vị khi đặt trước",
    },
    note: "1 ảnh in + 1 thiệp handmade (Tự trang trí & viết thư tri ân)",
    image: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=600&auto=format&fit=crop&q=80",
    badge: "59K",
    color: "bg-[#d8e2dc]",
  },
  {
    id: "combo-mot-bong-yeu-thuong",
    name: "Một bông yêu thương",
    price: 89000,
    category: "combo",
    isCombo: true,
    comboGift: {
      name: "Bánh tráng ngũ vị",
      quantity: 2,
      description: "Tặng 2 bịch Bánh tráng ngũ vị khi đặt trước",
    },
    note: "1 bông + 1 ảnh in + 1 thiệp (+5K cho mỗi bông đồng tiền)",
    image: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=600&auto=format&fit=crop&q=80",
    badge: "Từ 89K",
    color: "bg-[#ffe5d9]",
    options: {
      sizes: [
        { name: "Hoa hồng", price: 89000 },
        { name: "Hoa đồng tiền", price: 94000 },
      ],
    },
  },
  {
    id: "combo-tu-tay-yeu-thuong",
    name: "Tự tay yêu thương",
    price: 139000,
    category: "combo",
    isCombo: true,
    comboGift: {
      name: "Bánh tráng ngũ vị",
      quantity: 3,
      description: "Tặng 3 bịch Bánh tráng ngũ vị khi đặt trước",
    },
    note: "3 bông + 1 ảnh in + 1 thiệp (+5K cho mỗi bông đồng tiền)",
    image: "https://images.unsplash.com/photo-1508746829417-e6f548d8d6ed?w=600&auto=format&fit=crop&q=80",
    badge: "Từ 139K",
    color: "bg-[#ffcad4]",
    options: {
      sizes: [
        { name: "3 hoa hồng", price: 139000 },
        { name: "2 hồng + 1 đồng tiền", price: 144000 },
        { name: "1 hồng + 2 đồng tiền", price: 149000 },
        { name: "3 hoa đồng tiền", price: 154000 },
      ],
    },
  },
  {
    id: "combo-tu-tay-hanh-phuc",
    name: "Tự tay hạnh phúc",
    price: 179000,
    category: "combo",
    isCombo: true,
    comboGift: {
      name: "Bánh tráng ngũ vị",
      quantity: 3,
      description: "Tặng 3 bịch Bánh tráng ngũ vị khi đặt trước",
    },
    note: "5 bông + 1 ảnh in + 1 thiệp (+5K cho mỗi bông đồng tiền)",
    image: "https://images.unsplash.com/photo-1513151233558-d860c5398176?w=600&auto=format&fit=crop&q=80",
    badge: "Từ 179K",
    color: "bg-[#b7e4c7]",
    options: {
      sizes: [
        { name: "5 hoa hồng", price: 179000 },
        { name: "4 hồng + 1 đồng tiền", price: 184000 },
        { name: "3 hồng + 2 đồng tiền", price: 189000 },
        { name: "2 hồng + 3 đồng tiền", price: 194000 },
        { name: "1 hồng + 4 đồng tiền", price: 199000 },
        { name: "5 hoa đồng tiền", price: 204000 },
      ],
    },
  },
];

export const EARLY_BIRD_VOUCHERS: EarlyBirdVoucher[] = [];

/**
 * Đã bỏ các loại voucher theo yêu cầu của team
 */
export function calculateVoucherBenefit(_subtotal: number) {
  return {
    current: null,
    next: null,
    neededForNext: 0,
  };
}
