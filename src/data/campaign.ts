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
    "Sảnh lầu 2 — Nơi tổ chức Workshop (Ngày 17/10)",
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
    name: "Cafe đen sấy BERYL",
    price: 12000,
    category: "drink",
    note: "Cafe đen sấy BERYL đậm đà hương thơm mộc nguyên chất, sảng khoái tinh thần cho ngày học tập năng động",
    image: "/images/cafe-den-beryl.jpg",
    badge: "12K",
    color: "bg-[#c4a482]",
  },
  {
    id: "drink-cafe-sua",
    name: "Cafe sữa so be big",
    price: 15000,
    category: "drink",
    note: "Cafe sữa so be big béo ngậy ngọt ngào hòa quyện cùng cafe đậm đà chuẩn vị Sài Gòn, ly lớn siêu đã",
    image: "/images/cafe-sua-so-be-big.jpg",
    badge: "Best Seller 15K",
    color: "bg-[#ddb892]",
  },
  {
    id: "drink-tra-tac",
    name: 'Trà tắc "Ghê chứ!"',
    price: 10000,
    category: "drink",
    note: 'Trà tắc "Ghê chứ!" ủ thơm hòa quyện nước cốt tắc tươi chua ngọt đã khát, mát lạnh giải nhiệt tức thì',
    image: "/images/tra-tac-ghe-chu.jpg",
    badge: "Giải nhiệt 10K",
    color: "bg-[#f5e08c]",
  },

  // --- HOA TỰ GÓI 20/10 ---
  {
    id: "flower-hong-1",
    name: "1 Hoa hồng",
    price: 29000,
    category: "flower",
    note: "01 Bông hoa hồng phớt sang trọng trên túi kraft quai xách mộc mạc, thắt nơ lụa hồng xinh xắn kèm thiệp chúc mừng",
    image: "/images/hoa-hong-1-bong.jpg",
    badge: "Hoa tự gói 29k",
    color: "bg-[#f4c2c2]",
  },
  {
    id: "flower-dong-tien-1",
    name: "1 Hoa đồng tiền",
    price: 29000,
    category: "flower",
    note: "01 Bông hoa đồng tiền hồng pastel gói giấy nón vân nổi trang nhã, thắt nơ lụa đào xinh xắn mang ý nghĩa may mắn và khởi sắc",
    image: "/images/hoa-dong-tien-1-bong.jpg",
    badge: "Hoa tự gói 29k",
    color: "bg-[#ffe5d9]",
  },
  {
    id: "flower-bo-3",
    name: "Bó 3 bông",
    price: 79000,
    category: "flower",
    badge: "79K",
    note: "Bó 3 bông hoa phối cành cỏ thlaspi xanh bọc giấy trắng Hàn Quốc thanh lịch, thắt nơ lụa trang nhã",
    image: "/images/bo-hoa-3-bong.jpg",
    color: "bg-[#f1a7a7]",
    options: {
      sizes: [
        { name: "3 hoa hồng", price: 79000 },
        { name: "2 hồng + 1 đồng tiền", price: 79000 },
        { name: "1 hồng + 2 đồng tiền", price: 79000 },
        { name: "3 hoa đồng tiền", price: 79000 },
      ],
    },
  },
  {
    id: "flower-bo-5",
    name: "Bó 5 bông",
    price: 119000,
    category: "flower",
    badge: "119K",
    note: "Bó 5 bông hoa phối sắc trang nhã điểm cỏ hoa đồng nội, bọc giấy trắng nhiều lớp thắt nơ lụa cao cấp",
    image: "/images/bo-hoa-5-bong.jpg",
    color: "bg-[#ea899a]",
    options: {
      sizes: [
        { name: "5 hoa hồng", price: 119000 },
        { name: "4 hồng + 1 đồng tiền", price: 119000 },
        { name: "3 hồng + 2 đồng tiền", price: 119000 },
        { name: "2 hồng + 3 đồng tiền", price: 119000 },
        { name: "1 hồng + 4 đồng tiền", price: 119000 },
        { name: "5 hoa đồng tiền", price: 119000 },
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
    image: "/images/combo-gui-loi.jpg",
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
    note: "1 bông + 1 ảnh in + 1 thiệp",
    image: "/images/combo-mot-bong.jpg",
    badge: "89K",
    color: "bg-[#ffe5d9]",
    options: {
      sizes: [
        { name: "Hoa hồng", price: 89000 },
        { name: "Hoa đồng tiền", price: 89000 },
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
    note: "3 bông + 1 ảnh in + 1 thiệp",
    image: "/images/combo-3-bong.jpg",
    badge: "139K",
    color: "bg-[#ffcad4]",
    options: {
      sizes: [
        { name: "3 hoa hồng", price: 139000 },
        { name: "2 hồng + 1 đồng tiền", price: 139000 },
        { name: "1 hồng + 2 đồng tiền", price: 139000 },
        { name: "3 hoa đồng tiền", price: 139000 },
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
    note: "5 bông + 1 ảnh in + 1 thiệp",
    image: "/images/combo-5-bong.jpg",
    badge: "179K",
    color: "bg-[#b7e4c7]",
    options: {
      sizes: [
        { name: "5 hoa hồng", price: 179000 },
        { name: "4 hồng + 1 đồng tiền", price: 179000 },
        { name: "3 hồng + 2 đồng tiền", price: 179000 },
        { name: "2 hồng + 3 đồng tiền", price: 179000 },
        { name: "1 hồng + 4 đồng tiền", price: 179000 },
        { name: "5 hoa đồng tiền", price: 179000 },
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
