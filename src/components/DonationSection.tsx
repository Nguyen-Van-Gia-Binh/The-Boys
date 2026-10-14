"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  Heart,
  Trophy,
  Crown,
  Sparkles,
  Copy,
  Check,
  Gift,
  QrCode,
  MessageSquare,
  ShieldCheck,
  Flame,
  ArrowRight,
  HandHeart,
  RefreshCw,
  Award,
} from "lucide-react";
import { DONATION_CONFIG, Donor } from "@/data/donations";
import { CAMPAIGN_INFO } from "@/data/campaign";
import DonationCertificateModal, { DonationCertificateData } from "./DonationCertificateModal";

export default function DonationSection() {
  const { banking } = CAMPAIGN_INFO;
  const { quickAmounts, targetAmount } = DONATION_CONFIG;

  // Tự động sinh mã ủng hộ ngẫu nhiên duy nhất (ví dụ: DN68291)
  const generateDonationCode = useCallback(() => {
    return `DN${Math.floor(10000 + Math.random() * 90000)}`;
  }, []);

  const [donationCode, setDonationCode] = useState<string>("");

  useEffect(() => {
    setDonationCode(generateDonationCode());
  }, [generateDonationCode]);

  // Form states
  const [selectedAmount, setSelectedAmount] = useState<number>(150000); // Mặc định 1 phần quà 150k
  const [isCustomAmount, setIsCustomAmount] = useState<boolean>(false);
  const [customAmountInput, setCustomAmountInput] = useState<string>("");
  const [donorName, setDonorName] = useState<string>("");
  const [isAnonymous, setIsAnonymous] = useState<boolean>(false);
  const [donorPhone, setDonorPhone] = useState<string>("");
  const [donorMessage, setDonorMessage] = useState<string>("");
  const [certificateData, setCertificateData] = useState<DonationCertificateData | null>(null);

  // Copy states
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Leaderboard states (100% dữ liệu thực từ Google Sheet)
  const [donorsList, setDonorsList] = useState<Donor[]>([]);
  const [isLoadingDonors, setIsLoadingDonors] = useState<boolean>(true);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [hasSubmitted, setHasSubmitted] = useState<boolean>(false);
  const [isLiveSheet, setIsLiveSheet] = useState<boolean>(false);

  // Function to fetch real data from Google Sheet via /api/donate
  const fetchDonations = useCallback(async () => {
    setIsSyncing(true);
    try {
      const res = await fetch(`/api/donate?_t=${Date.now()}`, { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.donations)) {
          setDonorsList(data.donations);
          setIsLiveSheet(!!data.isLiveFromSheet);
        }
      }
    } catch (err) {
      console.warn("Không thể tải danh sách từ API:", err);
    } finally {
      setIsSyncing(false);
      setIsLoadingDonors(false);
    }
  }, []);

  // Fetch on mount
  useEffect(() => {
    fetchDonations();
  }, [fetchDonations]);

  // Calculate actual amount
  const actualAmount = useMemo(() => {
    if (isCustomAmount) {
      const val = parseInt(customAmountInput.replace(/\D/g, ""), 10);
      return isNaN(val) ? 0 : val;
    }
    return selectedAmount;
  }, [isCustomAmount, customAmountInput, selectedAmount]);

  // Sắp xếp danh sách ủng hộ từ cao xuống thấp
  const sortedDonors = useMemo(() => {
    return [...donorsList].sort((a, b) => b.amount - a.amount);
  }, [donorsList]);

  // Tổng tiền quyên góp thực tế từ Sheet
  const totalRaised = useMemo(() => {
    return sortedDonors.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
  }, [sortedDonors]);

  const progressPercent = Math.min(
    100,
    Math.round((totalRaised / targetAmount) * 100)
  );

  const giftsCovered = Math.floor(totalRaised / DONATION_CONFIG.costPerGift);

  // Cú pháp nội dung chuyển khoản tự động: mã DNxxxxx (chuẩn ngân hàng, đối soát tự động)
  const transferMemo = useMemo(() => {
    return donationCode || "DN88888";
  }, [donationCode]);

  // VietQR URL động với số tiền và nội dung chuyển khoản chứa mã DNxxxxx
  const qrUrl = useMemo(() => {
    const amt = actualAmount > 0 ? actualAmount : 150000;
    return `https://img.vietqr.io/image/${banking.bankId}-${banking.accountNo}-compact2.png?amount=${amt}&addInfo=${encodeURIComponent(
      transferMemo
    )}&accountName=${encodeURIComponent(banking.accountName)}`;
  }, [banking, actualAmount, transferMemo]);

  // Copy helper
  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  // Submit Donation Confirmation
  const handleSubmitDonation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (actualAmount < 1000) {
      alert("Vui lòng chọn hoặc nhập số tiền ủng hộ hợp lệ (tối thiểu 1.000đ).");
      return;
    }

    setIsSubmitting(true);

    const displayName = isAnonymous ? "Nhà hảo tâm giấu tên" : donorName.trim() || "Nhà hảo tâm giấu tên";
    const displayMsg =
      donorMessage.trim() ||
      "Gửi gắm yêu thương và lòng biết ơn sâu sắc đến các cô chú anh hùng ❤️";
    const currentCode = donationCode || generateDonationCode();

    try {
      // Gửi vào Google Sheet thông qua API kèm mã donationId
      const res = await fetch("/api/donate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          donationId: currentCode,
          name: displayName,
          amount: actualAmount,
          message: displayMsg,
          isAnonymous,
          phone: donorPhone,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.donation) {
          // Cập nhật tạm vào state để người dùng thấy ngay
          setDonorsList((prev) => [data.donation, ...prev.filter((d) => d.id !== currentCode)]);
        }
      }

      setCertificateData({
        id: currentCode,
        name: displayName,
        amount: actualAmount,
        message: displayMsg,
        createdAt: new Date().toLocaleDateString("vi-VN"),
        isAnonymous,
        phone: donorPhone,
      });

      setHasSubmitted(true);

      // Tải lại sau 1.2s để đồng bộ Google Sheet
      setTimeout(fetchDonations, 1200);

      // Sinh mã mới cho lần ủng hộ tiếp theo
      setDonationCode(generateDonationCode());
    } catch (err) {
      console.error(err);
      alert("Đã ghi nhận cục bộ! Vui lòng đối soát chuyển khoản qua ngân hàng.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      id="donate"
      className="relative w-full overflow-hidden border-b border-[var(--brand-border)] bg-[var(--brand-surface-alt)] px-4 py-16 sm:px-6 md:px-10 lg:py-24"
    >
      {/* Decorative Ambient Background */}
      <div className="pointer-events-none absolute -left-20 top-1/4 size-96 rounded-full bg-[#df8143]/5 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 bottom-10 size-96 rounded-full bg-[#315444]/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#df8143]/30 bg-[#df8143]/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#df8143] mb-4">
            <Heart className="size-3.5 fill-[#df8143]" />
            <span>Tiếp Nắng Tri Ân · Đồng Hành Gây Quỹ</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold leading-tight text-[var(--brand-heading)] tracking-tight font-serif">
            Góp nắng yêu thương,<br />
            <em className="font-normal italic text-[#df8143]">
              nuôi dưỡng 20 phần quà tri ân.
            </em>
          </h2>
          <p className="mt-4 text-sm sm:text-base leading-relaxed text-[var(--brand-muted)]">
            Dù bạn ở xa không mua hoa hay đồ ăn vặt, bạn vẫn có thể cùng nhóm sinh viên The Boys (ĐH FPT) gửi gắm tấm lòng tri ân đến các cô chú thương binh nặng.
          </p>

          {/* Campaign Progress Card */}
          <div className="mt-8 rounded-3xl border border-[var(--brand-border)] bg-[var(--brand-surface)] p-5 sm:p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2 text-left">
                <Flame className="size-5 text-[#df8143] animate-pulse" />
                <span className="text-sm font-bold text-[var(--brand-heading)]">
                  Tiến độ Quỹ Quà Tặng Thương Binh
                </span>
                {isLiveSheet && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:text-emerald-300">
                    ● Dữ liệu thực từ Google Sheet
                  </span>
                )}
              </div>
              <div className="text-left sm:text-right">
                <span className="text-xl sm:text-2xl font-black text-[#315444] dark:text-[#a8bf9e]">
                  {totalRaised.toLocaleString("vi-VN")}đ
                </span>
                <span className="text-xs text-[var(--brand-muted)] font-medium">
                  {" "}/ {targetAmount.toLocaleString("vi-VN")}đ ({progressPercent}%)
                </span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="h-3.5 w-full rounded-full bg-[var(--brand-border)] overflow-hidden p-0.5">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#e6b057] via-[#df8143] to-[#315444] transition-all duration-1000 ease-out"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            <div className="mt-3 flex flex-wrap items-center justify-between text-xs font-semibold text-[var(--brand-muted)] pt-1">
              <span className="flex items-center gap-1.5 text-[#df8143]">
                <Gift className="size-3.5" />
                Đã bảo trợ: <strong>{giftsCovered} / 20 phần quà</strong>
              </span>
              <span>150.000đ / phần </span>
            </div>
          </div>
        </div>

        {/* 2-Column Grid */}
        <div className="grid gap-8 lg:grid-cols-12 lg:items-start">
          {/* ================= COLUMN 1: FORM & QR (7 COLS) ================= */}
          <div className="lg:col-span-7 space-y-6">
            <div className="rounded-3xl border border-[var(--brand-border)] bg-[var(--brand-surface)] p-6 sm:p-8 shadow-sm">
              <div className="flex items-center justify-between border-b border-[var(--brand-border)] pb-4 mb-6">
                <div className="flex items-center gap-2.5">
                  <span className="flex size-9 items-center justify-center rounded-2xl bg-[#df8143]/15 text-[#df8143]">
                    <HandHeart className="size-5" />
                  </span>
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-[var(--brand-heading)]">
                      Chọn mức ủng hộ của bạn
                    </h3>
                    <p className="text-xs text-[var(--brand-muted)]">
                      Mỗi đóng góp đều trao tận tay các cô chú thương binh
                    </p>
                  </div>
                </div>
                <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full">
                  <ShieldCheck className="size-3.5" /> Minh bạch 100%
                </span>
              </div>

              {/* Step 1: Chọn số tiền */}
              <div className="space-y-3">
                <label className="text-xs font-bold uppercase tracking-wider text-[var(--brand-muted)]">
                  1. Mức đóng góp
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {quickAmounts.map((tier) => {
                    const isSelected = !isCustomAmount && selectedAmount === tier.amount;
                    return (
                      <button
                        key={tier.amount}
                        type="button"
                        onClick={() => {
                          setSelectedAmount(tier.amount);
                          setIsCustomAmount(false);
                        }}
                        className={`relative flex flex-col items-start justify-between rounded-2xl p-3 text-left transition-all border ${isSelected
                          ? "border-[#df8143] bg-[#df8143]/10 ring-2 ring-[#df8143]/30 shadow-sm"
                          : "border-[var(--brand-border)] bg-[var(--brand-surface-alt)] hover:border-[#df8143]/40"
                          }`}
                      >
                        {tier.isHighlighted && (
                          <span className="absolute -top-2 right-2 rounded-full bg-[#df8143] px-2 py-0.5 text-[9px] font-extrabold text-white shadow-xs">
                            Khuyên chọn
                          </span>
                        )}
                        <span className="text-base sm:text-lg font-extrabold text-[var(--brand-heading)]">
                          {tier.label}
                        </span>
                        <span className="text-[11px] text-[var(--brand-muted)] leading-tight mt-1">
                          {tier.description}
                        </span>
                      </button>
                    );
                  })}

                  {/* Nút nhập số tiền tùy tâm */}
                  <button
                    type="button"
                    onClick={() => setIsCustomAmount(true)}
                    className={`flex flex-col items-start justify-between rounded-2xl p-3 text-left transition-all border ${isCustomAmount
                      ? "border-[#df8143] bg-[#df8143]/10 ring-2 ring-[#df8143]/30 shadow-sm"
                      : "border-[var(--brand-border)] bg-[var(--brand-surface-alt)] hover:border-[#df8143]/40"
                      }`}
                  >
                    <span className="text-base sm:text-lg font-extrabold text-[var(--brand-heading)]">
                      Tùy tâm
                    </span>
                    <span className="text-[11px] text-[var(--brand-muted)] leading-tight mt-1">
                      Nhập số tiền khác
                    </span>
                  </button>
                </div>

                {/* Ô nhập số tiền tùy tâm */}
                {isCustomAmount && (
                  <div className="mt-3 animate-in fade-in slide-in-from-top-1 duration-200">
                    <div className="relative">
                      <input
                        type="text"
                        inputMode="numeric"
                        placeholder="Ví dụ: 200,000"
                        value={customAmountInput}
                        onChange={(e) => {
                          const raw = e.target.value.replace(/\D/g, "");
                          if (raw) {
                            setCustomAmountInput(Number(raw).toLocaleString("vi-VN"));
                          } else {
                            setCustomAmountInput("");
                          }
                        }}
                        className="w-full rounded-2xl border border-[#df8143] bg-[var(--brand-surface)] px-4 py-3 text-base font-bold text-[var(--brand-heading)] focus:outline-none focus:ring-2 focus:ring-[#df8143]"
                      />
                      <span className="absolute right-4 top-3.5 text-xs font-bold text-[var(--brand-muted)]">
                        VNĐ
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Step 2: Thông tin & Lời chúc */}
              <div className="mt-6 space-y-4 pt-4 border-t border-[var(--brand-border)]">
                <label className="text-xs font-bold uppercase tracking-wider text-[var(--brand-muted)] block">
                  2. Thông tin của bạn & Lời chúc tri ân
                </label>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <input
                      type="text"
                      disabled={isAnonymous}
                      placeholder={isAnonymous ? "Ủng hộ ẩn danh" : "Nhập họ và tên (ví dụ: Bình)"}
                      value={donorName}
                      onChange={(e) => setDonorName(e.target.value)}
                      className="w-full rounded-2xl border border-[var(--brand-border)] bg-[var(--brand-surface-alt)] px-3.5 py-2.5 text-sm text-[var(--brand-heading)] placeholder:text-[var(--brand-muted)] focus:outline-none focus:border-[#df8143] disabled:opacity-60"
                    />
                  </div>

                  <div>
                    <input
                      type="tel"
                      placeholder="Số điện thoại (tùy chọn - để đối soát)"
                      value={donorPhone}
                      onChange={(e) => setDonorPhone(e.target.value)}
                      className="w-full rounded-2xl border border-[var(--brand-border)] bg-[var(--brand-surface-alt)] px-3.5 py-2.5 text-sm text-[var(--brand-heading)] placeholder:text-[var(--brand-muted)] focus:outline-none focus:border-[#df8143]"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="anonymousCheck"
                    checked={isAnonymous}
                    onChange={(e) => setIsAnonymous(e.target.checked)}
                    className="size-4 rounded accent-[#df8143] cursor-pointer"
                  />
                  <label
                    htmlFor="anonymousCheck"
                    className="text-xs text-[var(--brand-muted)] cursor-pointer select-none"
                  >
                    Ủng hộ ẩn danh (Tên sẽ hiện là <em>&ldquo;Nhà hảo tâm giấu tên&rdquo;</em> trên Bảng Vàng)
                  </label>
                </div>

                <div>
                  <div className="relative">
                    <textarea
                      rows={2}
                      placeholder="Lời chúc tri ân gửi đến các cô chú anh hùng thương binh..."
                      value={donorMessage}
                      onChange={(e) => setDonorMessage(e.target.value)}
                      className="w-full rounded-2xl border border-[var(--brand-border)] bg-[var(--brand-surface-alt)] px-3.5 py-2.5 text-sm text-[var(--brand-heading)] placeholder:text-[var(--brand-muted)] focus:outline-none focus:border-[#df8143]"
                    />
                    <MessageSquare className="absolute right-3.5 bottom-3.5 size-4 text-[var(--brand-muted)] pointer-events-none" />
                  </div>
                  <p className="mt-1 text-[11px] text-[#df8143] italic">
                    ✍️ Lời nhắn này sẽ được sinh viên The Boys chép tay vào thiệp trao tận tay các cô chú trong ngày 17/10!
                  </p>
                </div>
              </div>

              {/* Step 3: Quét mã QR */}
              <div className="mt-6 pt-5 border-t border-[var(--brand-border)]">
                <div className="flex items-center justify-between mb-3">
                  <label className="text-xs font-bold uppercase tracking-wider text-[var(--brand-muted)]">
                    3. Quét mã VietQR chuyển khoản (SHB)
                  </label>
                  <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md">
                    Tự động điền số tiền &amp; mã ủng hộ
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-6 rounded-3xl border border-[var(--brand-border)] bg-[var(--brand-surface-alt)] p-5">
                  {/* Khung ảnh QR */}
                  <div className="relative flex flex-col items-center shrink-0">
                    <div className="size-44 sm:size-48 rounded-2xl bg-white p-2.5 shadow-md border border-neutral-200 flex items-center justify-center transition-transform hover:scale-102">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        key={`${actualAmount}-${transferMemo}`}
                        src={qrUrl}
                        alt="Mã QR ủng hộ The Boys"
                        className="w-full h-full object-contain transition-opacity duration-300"
                        loading="lazy"
                      />
                    </div>
                    <span className="mt-2 text-[10.5px] font-bold text-[var(--brand-muted)] flex items-center gap-1">
                      <QrCode className="size-3 text-[#df8143]" /> Quét bằng mọi App Ngân Hàng
                    </span>
                  </div>

                  {/* Thông tin chuyển khoản */}
                  <div className="flex-1 w-full space-y-2.5 text-xs">
                    {/* Ngân hàng */}
                    <div className="flex items-center justify-between border-b border-[var(--brand-border)] pb-2">
                      <span className="text-[var(--brand-muted)] font-medium">Ngân hàng:</span>
                      <span className="font-bold text-[var(--brand-heading)]">
                        {banking.bankName}
                      </span>
                    </div>

                    {/* Số tài khoản */}
                    <div className="flex items-center justify-between border-b border-[var(--brand-border)] pb-2">
                      <span className="text-[var(--brand-muted)] font-medium">Số tài khoản:</span>
                      <div className="flex items-center gap-1.5 font-mono font-bold text-sm text-[var(--brand-heading)]">
                        <span>{banking.accountNo}</span>
                        <button
                          type="button"
                          onClick={() => handleCopy(banking.accountNo, "stk")}
                          className="p-1 rounded-lg hover:bg-[var(--brand-surface)] text-[var(--brand-muted)] hover:text-[#df8143]"
                          title="Sao chép STK"
                        >
                          {copiedField === "stk" ? (
                            <Check className="size-3.5 text-emerald-500" />
                          ) : (
                            <Copy className="size-3.5" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Chủ tài khoản */}
                    <div className="flex items-center justify-between border-b border-[var(--brand-border)] pb-2">
                      <span className="text-[var(--brand-muted)] font-medium">Chủ tài khoản:</span>
                      <span className="font-bold text-[var(--brand-heading)]">
                        {banking.accountName}
                      </span>
                    </div>

                    {/* Số tiền */}
                    <div className="flex items-center justify-between border-b border-[var(--brand-border)] pb-2">
                      <span className="text-[var(--brand-muted)] font-medium">Số tiền ủng hộ:</span>
                      <span className="font-extrabold text-sm text-[#315444] dark:text-[#a8bf9e]">
                        {actualAmount > 0
                          ? `${actualAmount.toLocaleString("vi-VN")}đ`
                          : "150.000đ"}
                      </span>
                    </div>

                    {/* Nội dung CK chuẩn: Mã ủng hộ DNxxxxx */}
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[var(--brand-muted)] font-medium">Nội dung CK:</span>
                      <div className="flex items-center gap-1.5 font-mono font-bold text-xs text-[#df8143] bg-[#df8143]/10 px-2 py-1 rounded-lg">
                        <span>{transferMemo}</span>
                        <button
                          type="button"
                          onClick={() => handleCopy(transferMemo, "memo")}
                          className="p-0.5 rounded hover:bg-[var(--brand-surface)] text-[var(--brand-muted)] hover:text-[#df8143]"
                          title="Sao chép nội dung chuyển khoản"
                        >
                          {copiedField === "memo" ? (
                            <Check className="size-3 text-emerald-500" />
                          ) : (
                            <Copy className="size-3" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Lưu ý nhỏ về VietQR */}
                    <div className="pt-1 text-[10.5px] text-[var(--brand-muted)] italic">
                      * Khi mở app ngân hàng quét mã, ứng dụng sẽ <strong>tự động điền đúng số tiền và mã ủng hộ &ldquo;{transferMemo}&rdquo;</strong> cho bạn.
                    </div>
                  </div>
                </div>

                {/* Nút xác nhận chuyển khoản */}
                <div className="mt-4 pt-4 border-t border-[var(--brand-border)]">
                  {hasSubmitted ? (
                    <div className="space-y-3">
                      <div className="flex items-center justify-center gap-2 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 p-3.5 text-sm font-bold text-emerald-800 dark:text-emerald-300 animate-in zoom-in-95 duration-200">
                        <Check className="size-5 text-emerald-500 shrink-0" />
                        <span>Đã ghi nhận! Cảm ơn tấm lòng của <strong>&ldquo;{donorName || "Nhà hảo tâm"}&rdquo;</strong> ✨</span>
                      </div>
                      {certificateData && (
                        <button
                          type="button"
                          onClick={() => setCertificateData(certificateData)}
                          className="w-full flex items-center justify-center gap-2 rounded-2xl border-2 border-[#df8143] bg-[#df8143]/10 hover:bg-[#df8143]/20 py-2.5 px-4 text-xs font-bold text-[#df8143] transition active:scale-95 shadow-xs"
                        >
                          <Award className="size-4" />
                          <span>Xem lại Giấy chứng nhận tấm lòng vàng (.PNG)</span>
                        </button>
                      )}
                    </div>
                  ) : (
                    <button
                      type="button"
                      disabled={isSubmitting || actualAmount <= 0}
                      onClick={handleSubmitDonation}
                      className="w-full flex items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-[#315444] to-[#243e33] hover:from-[#243e33] hover:to-[#1a2f26] py-3.5 px-6 text-sm font-bold text-[#f8f5ef] shadow-lg shadow-[#315444]/25 hover:shadow-xl transition-all active:scale-98 disabled:opacity-50 group"
                    >
                      {isSubmitting ? (
                        <span>Đang ghi nhận vào Google Sheet...</span>
                      ) : (
                        <>
                          <Heart className="size-4.5 fill-[#e6b057] text-[#e6b057] group-hover:scale-110 transition-transform" />
                          <span>Tôi đã chuyển khoản xong</span>
                          <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </button>
                  )}
                  <p className="mt-2 text-center text-[11px] text-[var(--brand-muted)]">
                    💡 <em>Sau khi chuyển khoản trên App ngân hàng, bạn bấm nút này nhé. Cảm ơn bạn nhiều lắm</em>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ================= COLUMN 2: BẢNG VÀNG LEADERBOARD (5 COLS) ================= */}
          <div className="lg:col-span-5 space-y-4">
            <div className="rounded-3xl border border-[var(--brand-border)] bg-[var(--brand-surface)] p-6 shadow-sm">
              {/* Leaderboard Header */}
              <div className="flex items-center justify-between border-b border-[var(--brand-border)] pb-4 mb-4">
                <div className="flex items-center gap-2.5">
                  <span className="flex size-9 items-center justify-center rounded-2xl bg-[#e6b057]/20 text-[#e6b057]">
                    <Trophy className="size-5" />
                  </span>
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-[var(--brand-heading)] flex items-center gap-1.5">
                      Bảng Vàng Tri Ân
                      <Sparkles className="size-4 text-[#e6b057]" />
                    </h3>
                    <p className="text-xs text-[var(--brand-muted)]">
                      Vinh danh các tấm lòng sẻ chia ấm áp
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={fetchDonations}
                    disabled={isSyncing}
                    className="p-1.5 rounded-xl border border-[var(--brand-border)] text-[var(--brand-muted)] hover:text-[#df8143] hover:bg-[var(--brand-surface-alt)] transition"
                    title="Đồng bộ dữ liệu từ Google Sheet"
                  >
                    <RefreshCw className={`size-3.5 ${isSyncing ? "animate-spin text-[#df8143]" : ""}`} />
                  </button>
                  <span className="text-xs font-bold text-[#df8143] bg-[#df8143]/10 px-2.5 py-1 rounded-full">
                    {sortedDonors.length} Nhà hảo tâm
                  </span>
                </div>
              </div>

              {/* Leaderboard List */}
              <div className="space-y-2.5 max-h-[580px] overflow-y-auto pr-1">
                {isLoadingDonors ? (
                  // Skeleton Loading
                  <div className="space-y-3 py-4">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="animate-pulse flex items-center justify-between p-3.5 rounded-2xl border border-[var(--brand-border)] bg-[var(--brand-surface-alt)]/50"
                      >
                        <div className="flex items-center gap-2.5 w-full">
                          <div className="size-7 rounded-full bg-gray-200 dark:bg-gray-700" />
                          <div className="space-y-1.5 flex-1">
                            <div className="h-3.5 bg-gray-200 dark:bg-gray-700 rounded w-2/3" />
                            <div className="h-2.5 bg-gray-100 dark:bg-gray-800 rounded w-1/3" />
                          </div>
                        </div>
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16" />
                      </div>
                    ))}
                  </div>
                ) : sortedDonors.length === 0 ? (
                  // Empty State khi Sheet chưa có ai ủng hộ
                  <div className="py-10 px-5 text-center border-2 border-dashed border-[#e6b057]/40 rounded-2xl bg-[#e6b057]/5">
                    <div className="w-12 h-12 mx-auto rounded-full bg-[#e6b057]/20 flex items-center justify-center text-[#df8143] mb-3">
                      <Heart className="size-6 fill-[#df8143]/30 text-[#df8143] animate-pulse" />
                    </div>
                    <h4 className="font-bold text-sm text-[var(--brand-heading)] mb-1">
                      Hãy là người đầu tiên tiếp sức Quỹ Tri Ân!
                    </h4>
                    <p className="text-xs text-[var(--brand-muted)] max-w-xs mx-auto leading-relaxed">
                      Mỗi đóng góp dù nhỏ bé đều được ghi nhận trang trọng trên Bảng Vàng và trao trọn yêu thương đến các cô chú cựu chiến binh.
                    </p>
                  </div>
                ) : (
                  sortedDonors.map((donor, idx) => {
                    const rank = idx + 1;
                    const isTop1 = rank === 1;
                    const isTop2 = rank === 2;
                    const isTop3 = rank === 3;

                    let rankBadge = (
                      <span className="flex size-7 items-center justify-center rounded-full bg-[var(--brand-border)] text-xs font-bold text-[var(--brand-muted)] shrink-0">
                        #{rank}
                      </span>
                    );

                    let cardStyle =
                      "border border-[var(--brand-border)] bg-[var(--brand-surface-alt)]";

                    if (isTop1) {
                      rankBadge = (
                        <span className="flex size-7 items-center justify-center rounded-full bg-gradient-to-tr from-amber-400 to-amber-200 text-amber-950 font-black shadow-xs shrink-0">
                          <Crown className="size-4 fill-amber-950" />
                        </span>
                      );
                      cardStyle =
                        "border-2 border-amber-400/70 bg-gradient-to-r from-amber-500/15 via-amber-500/5 to-[var(--brand-surface)] shadow-xs";
                    } else if (isTop2) {
                      rankBadge = (
                        <span className="flex size-7 items-center justify-center rounded-full bg-gradient-to-tr from-slate-300 to-slate-100 text-slate-800 font-black shadow-xs shrink-0">
                          🥈
                        </span>
                      );
                      cardStyle =
                        "border border-slate-300 dark:border-slate-600 bg-slate-500/5";
                    } else if (isTop3) {
                      rankBadge = (
                        <span className="flex size-7 items-center justify-center rounded-full bg-gradient-to-tr from-amber-700 to-amber-500 text-white font-black shadow-xs shrink-0">
                          🥉
                        </span>
                      );
                      cardStyle =
                        "border border-amber-700/30 bg-amber-700/5";
                    }

                    return (
                      <div
                        key={donor.id}
                        className={`rounded-2xl p-3.5 transition-all hover:scale-[1.01] ${cardStyle}`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-2.5 min-w-0">
                            {rankBadge}
                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span className="text-sm font-bold text-[var(--brand-heading)] truncate">
                                  {donor.name}
                                </span>
                                {donor.badge && (
                                  <span className="rounded-md bg-[#315444]/15 px-1.5 py-0.5 text-[9.5px] font-bold text-[#315444] dark:text-[#a8bf9e]">
                                    {donor.badge}
                                  </span>
                                )}
                              </div>
                              <span className="text-[10.5px] text-[var(--brand-muted)]">
                                {donor.createdAt}
                              </span>
                            </div>
                          </div>

                          {/* Số tiền */}
                          <div className="text-right shrink-0">
                            <span
                              className={`text-sm font-black ${isTop1
                                ? "text-[#df8143]"
                                : isTop2 || isTop3
                                  ? "text-[#315444] dark:text-[#a8bf9e]"
                                  : "text-[var(--brand-heading)]"
                                }`}
                            >
                              {donor.amount.toLocaleString("vi-VN")}đ
                            </span>
                          </div>
                        </div>

                        {/* Lời chúc */}
                        {donor.message && (
                          <p className="mt-2 text-xs italic text-[var(--brand-muted)] border-l-2 border-[#df8143]/50 pl-2.5 py-0.5 line-clamp-2">
                            &ldquo;{donor.message}&rdquo;
                          </p>
                        )}
                      </div>
                    );
                  })
                )}
              </div>

              {/* Leaderboard Footer */}
              <div className="mt-4 pt-3 border-t border-[var(--brand-border)] text-center">
                <p className="text-xs text-[var(--brand-muted)]">
                  Cảm ơn tấm lòng hiếu nghĩa của tất cả mọi người ❤️
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Chứng Nhận Tấm Lòng Vàng */}
      <DonationCertificateModal
        data={certificateData}
        onClose={() => setCertificateData(null)}
      />
    </section>
  );
}
