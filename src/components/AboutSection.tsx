"use client";

import React from "react";
import { Heart, Gift, Award, MapPin, CheckCircle2 } from "lucide-react";
import { CAMPAIGN_INFO } from "@/data/campaign";

export default function AboutSection() {
  const { charityGoal } = CAMPAIGN_INFO;

  return (
    <>
      {/* Section 1: Câu chuyện của chúng mình */}
      <section id="about" className="border-y border-[var(--brand-border)] bg-[var(--brand-surface-alt)] px-5 py-16 md:px-10 lg:py-24">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
          <div>
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-[#df8143]">
              Câu chuyện của chúng mình
            </p>
            <h2 className="text-3xl sm:text-5xl font-extrabold leading-tight text-[var(--brand-heading)] font-serif">
              Hành trình dòng nước<br />
              <em className="font-normal italic text-[#df8143]">về nguồn yêu thương.</em>
            </h2>
          </div>

          <div className="space-y-4 text-sm sm:text-base leading-relaxed text-[var(--brand-muted)]">
            <p>
              Chiến dịch <strong>&ldquo;Hành Trình Dòng Nước Về Nguồn&rdquo;</strong> được khởi xướng bởi nhóm sinh viên The Boys (Đại học FPT TP.HCM) với tâm nguyện tri ân thế hệ đi trước — những người lính đã hiến dâng thanh xuân và thân thể cho độc lập dân tộc.
            </p>
            <p>
              Toàn bộ lợi nhuận thu được từ việc bán đồ ăn vặt, cafe, hoa 20/10 và các combo workshop lưu niệm sẽ được dùng 100% để chuẩn bị <strong>{charityGoal.giftCount} phần quà ý nghĩa</strong> trao tận tay các cô chú thương binh nặng.
            </p>
            <div className="grid grid-cols-2 gap-4 pt-3 sm:grid-cols-4">
              <div className="rounded-2xl border border-[var(--brand-border)] bg-[var(--brand-surface)] p-3 text-center">
                <p className="text-xl sm:text-2xl font-extrabold text-[#df8143]">20</p>
                <p className="text-xs text-[var(--brand-muted)]">Phần quà tri ân</p>
              </div>
              <div className="rounded-2xl border border-[var(--brand-border)] bg-[var(--brand-surface)] p-3 text-center">
                <p className="text-xl sm:text-2xl font-extrabold text-[#315444]">150k</p>
                <p className="text-xs text-[var(--brand-muted)]">Giá trị mỗi phần</p>
              </div>
              <div className="rounded-2xl border border-[var(--brand-border)] bg-[var(--brand-surface)] p-3 text-center">
                <p className="text-xl sm:text-2xl font-extrabold text-[#df8143]">13/10</p>
                <p className="text-xs text-[var(--brand-muted)]">Ngày mở bán</p>
              </div>
              <div className="rounded-2xl border border-[var(--brand-border)] bg-[var(--brand-surface)] p-3 text-center">
                <p className="text-xl sm:text-2xl font-extrabold text-[#315444]">17/10</p>
                <p className="text-xs text-[var(--brand-muted)]">Workshop chính</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Nơi chúng mình sẽ đến (Hành trình) */}
      <section id="journey" className="bg-[#315444] px-5 py-16 text-[#f8f5ef] md:px-10 lg:py-24">
        <div className="mx-auto max-w-5xl">
          <div className="text-center md:text-left">
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-[#e6b057]">
              Sứ mệnh thiện nguyện
            </p>
            <h2 className="text-3xl sm:text-5xl font-extrabold leading-tight tracking-tight font-serif">
              Một buổi sống cùng anh hùng<br />
              <em className="font-normal italic text-[#e6b057]">trong thời bình.</em>
            </h2>
            <p className="mt-5 max-w-2xl text-sm sm:text-base leading-relaxed text-[#c1d0c4]">
              {charityGoal.targetAudience}
            </p>
          </div>

          {/* Chi tiết mỗi phần quà */}
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {charityGoal.giftDetails.map((gift, idx) => (
              <div
                key={idx}
                className="flex flex-col justify-between rounded-2xl bg-white/10 p-4 backdrop-blur-sm border border-white/10"
              >
                <div>
                  <span className="flex size-8 items-center justify-center rounded-full bg-[#e6b057]/20 text-[#e6b057] mb-3">
                    <Gift className="size-4" />
                  </span>
                  <p className="font-semibold text-white text-sm">{gift.name}</p>
                </div>
                <p className="mt-3 text-xs font-bold text-[#e6b057]">{gift.price}</p>
              </div>
            ))}
          </div>

          {/* Hoạt động trong ngày */}
          <div className="mt-10 rounded-3xl border border-white/20 bg-white/5 p-6 sm:p-8 backdrop-blur-md">
            <h3 className="text-lg font-bold text-[#e6b057] flex items-center gap-2">
              <Award className="size-5" />
              Chương trình hoạt động 1 ngày tri ân:
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm text-[#e1ece4]">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="size-4 shrink-0 text-[#e6b057] mt-0.5" />
                <span>Thăm hỏi, sinh hoạt ngoài trời và lắng nghe những câu chuyện lịch sử hào hùng từ nhân chứng sống.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="size-4 shrink-0 text-[#e6b057] mt-0.5" />
                <span>Trao tận tay 20 túi quà dinh dưỡng (sữa Ensure, bánh Solite, sữa Nutifood).</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="size-4 shrink-0 text-[#e6b057] mt-0.5" />
                <span>Cuối buổi: Đại diện các bạn sinh viên trực tiếp đọc những lá thư tri ân viết tay gửi gắm lòng biết ơn sâu sắc.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
