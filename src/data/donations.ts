export interface Donor {
  id: string;
  name: string;
  amount: number;
  message: string;
  createdAt: string;
  isAnonymous?: boolean;
  badge?: string;
}

export const DONATION_CONFIG = {
  targetAmount: 3000000, // 3.000.000đ tương ứng 20 phần quà dinh dưỡng tri ân
  giftTargetCount: 20,
  costPerGift: 150000,
  quickAmounts: [
    {
      amount: 10000,
      label: "10K",
      description: "Góp 1 ly trà tắc ngọt lành",
      badge: "Ấm lòng",
    },
    {
      amount: 20000,
      label: "20K",
      description: "Góp 2 gói bánh tráng ngũ vị",
      badge: "Sẻ chia",
    },
    {
      amount: 50000,
      label: "50K",
      description: "Góp 1 hộp bánh Solite dinh dưỡng",
      badge: "Yêu thương",
    },
    {
      amount: 100000,
      label: "100K",
      description: "Góp 1 hộp sữa Ensure & bánh ngọt",
      badge: "Nghĩa tình",
    },
    {
      amount: 150000,
      label: "150K",
      description: "Trọn vẹn 1 phần quà trao tận tay",
      badge: "Trọn 1 phần quà 🎁",
      isHighlighted: true,
    },
  ],
};

export const INITIAL_DONORS: Donor[] = [
  {
    id: "donor-01",
    name: "Nguyễn Hoàng Nam",
    amount: 500000,
    message: "Kính chúc các cô chú cựu chiến binh luôn mạnh khỏe, an vui. Cảm ơn The Boys đã tổ chức chiến dịch đầy nhân văn!",
    createdAt: "12/10/2026",
    badge: "Cựu SV FPTU",
  },
  {
    id: "donor-02",
    name: "Một người bạn K18 giấu tên",
    amount: 300000,
    message: "Gửi chút tấm lòng tri ân những người lính đã hiến dâng thanh xuân vì Tổ quốc ❤️",
    createdAt: "12/10/2026",
    isAnonymous: true,
    badge: "K18 FPTU",
  },
  {
    id: "donor-03",
    name: "Cô Lê Thị Mai",
    amount: 250000,
    message: "Ủng hộ các em sinh viên The Boys lan tỏa đạo lý Uống nước nhớ nguồn tốt đẹp.",
    createdAt: "12/10/2026",
    badge: "Giảng viên FPT",
  },
  {
    id: "donor-04",
    name: "Trần Gia Bảo",
    amount: 150000,
    message: "Gửi tặng trọn vẹn 1 phần quà dinh dưỡng cho các cô chú thương binh.",
    createdAt: "12/10/2026",
    badge: "SE16xxx",
  },
  {
    id: "donor-05",
    name: "Nhóm K19 Graphic Design",
    amount: 150000,
    message: "Đồng hành trọn vẹn cùng 1 phần quà trong chuyến thiện nguyện ngày 17/10!",
    createdAt: "12/10/2026",
    badge: "K19 FPTU",
  },
  {
    id: "donor-06",
    name: "Bạn giấu tên",
    amount: 100000,
    message: "Tri ân thế hệ cha anh, mong các cô chú luôn bình an và được chăm sóc chu đáo.",
    createdAt: "12/10/2026",
    isAnonymous: true,
  },
  {
    id: "donor-07",
    name: "Lê Minh Quân",
    amount: 100000,
    message: "Góp thêm chút năng lượng tích cực và ngọt ngào cho ngày tri ân 17/10.",
    createdAt: "11/10/2026",
    badge: "Sinh viên FPT",
  },
  {
    id: "donor-08",
    name: "Sinh viên K20 FPTU",
    amount: 50000,
    message: "Gửi gắm ngàn lời tri ân sâu sắc nhất đến những anh hùng thời bình.",
    createdAt: "11/10/2026",
    isAnonymous: true,
  },
  {
    id: "donor-09",
    name: "Trịnh Thảo Vy",
    amount: 50000,
    message: "Mong các cô chú thật nhiều sức khỏe và nụ cười rạng rỡ.",
    createdAt: "11/10/2026",
    badge: "FPTU",
  },
  {
    id: "donor-10",
    name: "Minh Triết",
    amount: 20000,
    message: "Của ít lòng nhiều, chúc chiến dịch The Boys thành công rực rỡ và lan tỏa rộng rãi!",
    createdAt: "10/10/2026",
  },
];
