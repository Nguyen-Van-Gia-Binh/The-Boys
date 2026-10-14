"use client";

import React, { useRef, useState } from "react";
import { X, Download, Copy, Check, Heart, Award, Sparkles, ExternalLink, ShieldCheck } from "lucide-react";
import Link from "next/link";

export interface DonationCertificateData {
  id: string;
  name: string;
  amount: number;
  message: string;
  createdAt: string;
  phone?: string;
  isAnonymous?: boolean;
}

interface DonationCertificateModalProps {
  data: DonationCertificateData | null;
  onClose: () => void;
}

export default function DonationCertificateModal({
  data,
  onClose,
}: DonationCertificateModalProps) {
  const [copied, setCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  if (!data) return null;

  const costPerGift = 150000;
  const giftsEquivalent = Math.max(1, Math.round((data.amount / costPerGift) * 10) / 10);
  const displayName = data.isAnonymous ? "Nhà hảo tâm giấu tên" : data.name || "Nhà hảo tâm giấu tên";

  const handleCopyCode = () => {
    navigator.clipboard.writeText(data.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Tạo và tải ảnh chứng nhận chất lượng cao bằng HTML5 Canvas
  const handleDownloadImage = () => {
    setIsGenerating(true);
    try {
      const canvas = canvasRef.current || document.createElement("canvas");
      canvas.width = 1200;
      canvas.height = 750;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // 1. Nền Gradient sang trọng (Xanh lục ngọc đậm pha chút sắc ấm)
      const bgGrad = ctx.createLinearGradient(0, 0, 1200, 750);
      bgGrad.addColorStop(0, "#1c3227");
      bgGrad.addColorStop(0.5, "#254234");
      bgGrad.addColorStop(1, "#172b21");
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, 1200, 750);

      // 2. Họa tiết trang trí viền ngoài (Khung mạ vàng đôi)
      ctx.strokeStyle = "#d4af37";
      ctx.lineWidth = 4;
      ctx.strokeRect(30, 30, 1140, 690);

      ctx.strokeStyle = "rgba(212, 175, 55, 0.4)";
      ctx.lineWidth = 1.5;
      ctx.strokeRect(42, 42, 1116, 666);

      // Góc họa tiết
      const drawCorner = (x: number, y: number) => {
        ctx.strokeStyle = "#d4af37";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(x, y, 16, 0, Math.PI * 2);
        ctx.stroke();
        ctx.fillStyle = "#d4af37";
        ctx.beginPath();
        ctx.arc(x, y, 6, 0, Math.PI * 2);
        ctx.fill();
      };
      drawCorner(42, 42);
      drawCorner(1158, 42);
      drawCorner(42, 708);
      drawCorner(1158, 708);

      // 3. Tiêu đề thương hiệu
      ctx.fillStyle = "#df8143";
      ctx.font = "bold 18px 'Inter', system-ui, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("CHIẾN DỊCH THIỆN NGUYỆN • THE BOYS FPT", 600, 95);

      ctx.fillStyle = "#e8c7a9";
      ctx.font = "italic 16px 'Inter', system-ui, sans-serif";
      ctx.fillText("HÀNH TRÌNH DÒNG NƯỚC VỀ NGUỒN — TRI ÂN NGÀY 17/10/2026", 600, 125);

      // 4. Tiêu đề Giấy Chứng Nhận
      ctx.fillStyle = "#fde047";
      ctx.font = "900 42px 'Inter', system-ui, sans-serif";
      ctx.fillText("CHỨNG NHẬN TẤM LÒNG VÀNG", 600, 190);

      // Đường gạch trang trí dưới tiêu đề
      ctx.strokeStyle = "#d4af37";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(420, 210);
      ctx.lineTo(780, 210);
      ctx.stroke();

      // 5. Nội dung ghi nhận
      ctx.fillStyle = "#d8e2dc";
      ctx.font = "18px 'Inter', system-ui, sans-serif";
      ctx.fillText("Trân trọng tri ân và vinh danh tấm lòng cao quý của:", 600, 260);

      // Tên người ủng hộ
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 38px 'Inter', system-ui, sans-serif";
      ctx.fillText(displayName, 600, 315);

      // Số tiền ủng hộ
      ctx.fillStyle = "#fef08a";
      ctx.font = "bold 32px 'Inter', system-ui, sans-serif";
      ctx.fillText(`${data.amount.toLocaleString("vi-VN")} VNĐ`, 600, 375);

      // Ý nghĩa phần quà
      ctx.fillStyle = "#a8bf9e";
      ctx.font = "500 18px 'Inter', system-ui, sans-serif";
      ctx.fillText(
        `Đã chung tay trao tặng ~${giftsEquivalent} phần quà dinh dưỡng tận tay các cô chú thương binh`,
        600,
        415
      );

      // 6. Lời chúc tri ân (Box ở giữa)
      if (data.message) {
        ctx.fillStyle = "rgba(0, 0, 0, 0.25)";
        ctx.roundRect ? ctx.roundRect(150, 445, 900, 80, 16) : ctx.fillRect(150, 445, 900, 80);
        ctx.fill();

        ctx.strokeStyle = "rgba(212, 175, 55, 0.3)";
        ctx.lineWidth = 1;
        ctx.roundRect ? ctx.roundRect(150, 445, 900, 80, 16) : ctx.strokeRect(150, 445, 900, 80);
        ctx.stroke();

        ctx.fillStyle = "#fef9c3";
        ctx.font = "italic 18px 'Inter', system-ui, sans-serif";
        const shortMsg = data.message.length > 90 ? data.message.substring(0, 87) + "..." : data.message;
        ctx.fillText(`“ ${shortMsg} ”`, 600, 492);
      }

      // 7. Footer: Mã xác nhận & Dấu mộc
      ctx.fillStyle = "#9ca3af";
      ctx.font = "14px 'Inter', system-ui, sans-serif";
      ctx.textAlign = "left";
      ctx.fillText(`Mã chứng nhận: ${data.id}`, 90, 640);
      ctx.fillText(`Ngày ghi nhận: ${data.createdAt || new Date().toLocaleDateString("vi-VN")}`, 90, 665);
      ctx.fillText(`Tra cứu tại: theboys-project.vercel.app/tra-cuu`, 90, 690);

      // Dấu chứng nhận bên phải
      ctx.textAlign = "right";
      ctx.fillStyle = "#fde047";
      ctx.font = "bold 16px 'Inter', system-ui, sans-serif";
      ctx.fillText("BAN TỔ CHỨC THE BOYS FPT", 1110, 640);
      ctx.fillStyle = "#a8bf9e";
      ctx.font = "14px 'Inter', system-ui, sans-serif";
      ctx.fillText("Dòng Nước Về Nguồn • Tri Ân Lực Lượng Anh Hùng", 1110, 665);
      ctx.fillStyle = "#df8143";
      ctx.font = "bold 13px 'Inter', system-ui, sans-serif";
      ctx.fillText("★ ĐÃ GHI NHẬN VÀO QUỸ THIỆN NGUYỆN ★", 1110, 690);

      // Tải ảnh về máy
      const link = document.createElement("a");
      link.download = `Chung_Nhan_Tri_An_${data.id}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (err) {
      console.error("Lỗi tạo ảnh chứng nhận:", err);
      alert("Không thể kết xuất ảnh. Bạn có thể chụp màn hình thiệp chứng nhận nhé!");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-md animate-in fade-in duration-300">
      {/* Background click to close */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* Modal Dialog */}
      <div className="relative z-10 w-full max-w-xl overflow-hidden rounded-3xl border-2 border-[#d4af37]/60 bg-gradient-to-b from-[#1c3227] via-[#223d30] to-[#172b21] text-white shadow-2xl ring-1 ring-[#d4af37]/30">
        {/* Nút đóng */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-20 flex size-9 items-center justify-center rounded-full bg-black/30 text-neutral-300 hover:bg-black/60 hover:text-white transition"
          aria-label="Đóng"
        >
          <X className="size-5" />
        </button>

        {/* Nội dung Thiệp / Chứng nhận */}
        <div className="p-6 sm:p-8 text-center relative">
          {/* Header Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-[#d4af37]/50 bg-[#d4af37]/15 px-3.5 py-1 text-xs font-bold text-[#fde047] shadow-sm mb-4">
            <Sparkles className="size-3.5 text-[#fde047]" />
            <span>CHIẾN DỊCH THIỆN NGUYỆN THE BOYS FPT</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-wider text-[#fde047] font-serif">
            Chứng Nhận Tấm Lòng Vàng
          </h2>
          <p className="mt-1 text-xs text-[#a8bf9e] italic">
            Hành Trình Dòng Nước Về Nguồn — Tri ân các anh hùng thời bình
          </p>

          {/* Khung tôn vinh nhà hảo tâm */}
          <div className="mt-6 rounded-2xl border border-[#d4af37]/30 bg-black/25 p-5 backdrop-blur-xs space-y-3">
            <p className="text-xs text-[#d8e2dc]">
              Trân trọng tri ân và ghi nhận tấm lòng nhân ái của:
            </p>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-wide">
              {displayName}
            </h3>

            <div className="inline-block rounded-xl bg-gradient-to-r from-[#df8143]/20 via-[#df8143]/30 to-[#df8143]/20 px-5 py-2 border border-[#df8143]/40">
              <span className="text-2xl sm:text-3xl font-black text-[#fef08a]">
                {data.amount.toLocaleString("vi-VN")}đ
              </span>
            </div>

            <p className="text-xs font-semibold text-[#a8bf9e]">
              🎁 Tương đương đóng góp <strong>~{giftsEquivalent} phần quà dinh dưỡng</strong> trao tận tay các cô chú thương binh vào ngày 17/10.
            </p>

            {data.message && (
              <div className="mt-3 rounded-xl bg-black/30 p-3 text-xs italic text-[#fef9c3] border border-white/5">
                “{data.message}”
              </div>
            )}
          </div>

          {/* Thông tin mã tra cứu */}
          <div className="mt-5 flex flex-wrap items-center justify-between gap-2 rounded-xl bg-white/5 px-4 py-2.5 text-xs text-left border border-white/10">
            <div>
              <span className="text-[#a8bf9e]">Mã tra cứu ủng hộ: </span>
              <strong className="font-mono text-sm text-[#fde047]">{data.id}</strong>
            </div>
            <button
              onClick={handleCopyCode}
              className="flex items-center gap-1 rounded-lg bg-white/10 px-2.5 py-1 text-[11px] font-semibold text-white hover:bg-white/20 transition active:scale-95"
            >
              {copied ? (
                <>
                  <Check className="size-3 text-emerald-400" />
                  <span className="text-emerald-400">Đã chép</span>
                </>
              ) : (
                <>
                  <Copy className="size-3" />
                  <span>Sao chép mã</span>
                </>
              )}
            </button>
          </div>

          {/* Dấu bảo chứng */}
          <div className="mt-4 flex items-center justify-center gap-2 text-[11px] text-[#a8bf9e]">
            <ShieldCheck className="size-4 text-emerald-400 shrink-0" />
            <span>Lượt ủng hộ đã được tự động lưu vào danh sách sao kê chiến dịch.</span>
          </div>

          {/* Nút hành động */}
          <div className="mt-6 flex flex-col sm:flex-row items-center gap-3">
            <button
              onClick={handleDownloadImage}
              disabled={isGenerating}
              className="w-full sm:flex-1 flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#df8143] to-[#b93815] py-3 text-sm font-bold text-white shadow-lg shadow-[#df8143]/25 hover:opacity-95 active:scale-95 transition disabled:opacity-50"
            >
              <Download className="size-4" />
              <span>{isGenerating ? "Đang xuất ảnh..." : "Lưu ảnh chứng nhận (.PNG)"}</span>
            </button>

            <Link
              href={`/tra-cuu?orderId=${encodeURIComponent(data.id)}`}
              onClick={onClose}
              className="w-full sm:w-auto flex items-center justify-center gap-1.5 rounded-2xl border border-[#d4af37]/50 bg-white/5 px-5 py-3 text-xs font-semibold text-[#fde047] hover:bg-white/10 active:scale-95 transition"
            >
              <span>Xem trang tra cứu</span>
              <ExternalLink className="size-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
