import Link from "next/link";
import OrderLookup from "@/components/OrderLookup";
import { ArrowLeft, Package } from "lucide-react";

export default function TraCuuPage() {
  return (
    <div className="min-h-screen bg-[var(--brand-background)]">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-[var(--brand-surface)]/95 backdrop-blur-md border-b border-[var(--brand-border)]">
        <div className="max-w-2xl mx-auto px-4 py-3">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex items-center justify-center size-9 rounded-full bg-[var(--brand-surface-alt)] text-[var(--brand-muted)] hover:bg-[var(--brand-border)] hover:text-[var(--brand-heading)] transition"
            >
              <ArrowLeft className="size-5" />
            </Link>
            <div>
              <h1 className="text-lg font-bold text-[var(--brand-heading)]">Tra cứu đơn hàng & Ủng hộ</h1>
              <p className="text-xs text-[var(--brand-muted)]">Hành Trình Dòng Nước Về Nguồn</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-2xl mx-auto px-4 py-6">
        {/* Hero Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center size-16 rounded-2xl bg-[#315444]/10 text-[#315444] mb-4">
            <Package className="size-8" />
          </div>
          <h2 className="text-2xl font-bold text-[var(--brand-heading)]">
            Kiểm tra trạng thái đơn hàng & Lượt ủng hộ
          </h2>
          <p className="mt-2 text-sm text-[var(--brand-muted)]">
            Nhập mã đơn hàng (DHxxxx), mã ủng hộ tri ân (DNxxxx) hoặc số điện thoại để tra cứu trạng thái xác nhận và tải lại giấy chứng nhận.
          </p>
        </div>

        {/* Lookup Component */}
        <OrderLookup />

        {/* Footer CTA */}
        <div className="mt-10 text-center">
          <p className="text-sm text-[var(--brand-muted)]">
            Bạn muốn đặt thêm món hoặc ủng hộ quỹ?{" "}
            <Link href="/" className="font-semibold text-[#315444] hover:underline">
              Quay lại trang chủ gian hàng
            </Link>
          </p>
        </div>

        {/* Info Box */}
        <div className="mt-8 rounded-2xl border border-[var(--brand-border)] bg-[var(--brand-surface-alt)] p-4">
          <h3 className="text-sm font-bold text-[var(--brand-heading)] mb-2">💡 Mẹo tra cứu nhanh</h3>
          <ul className="text-xs text-[var(--brand-muted)] space-y-1.5">
            <li>• <strong>Mã đơn hàng</strong>: Có dạng <code className="bg-[var(--brand-border)] px-1.5 py-0.5 rounded text-[#b93815] dark:text-[#f39c5b] font-mono">DHxxxx</code>, ví dụ: DH1234</li>
            <li>• <strong>Mã ủng hộ quỹ</strong>: Có dạng <code className="bg-[var(--brand-border)] px-1.5 py-0.5 rounded text-rose-600 dark:text-rose-400 font-mono">DNxxxx</code>, ví dụ: DN12345 (có thể xem và tải lại Giấy chứng nhận tri ân)</li>
            <li>• <strong>Số điện thoại</strong>: Nhập đầy đủ số điện thoại bạn đã dùng khi đặt hàng hoặc gửi ủng hộ</li>
            <li>• Nếu đơn hiển thị <span className="text-emerald-600 font-semibold">"Đã thanh toán" / "Đã vào quỹ tri ân"</span> → Nhóm The Boys đã nhận tiền và ghi nhận thành công!</li>
            <li>• Nếu hiển thị <span className="text-amber-600 font-semibold">"Chờ chuyển khoản" / "Chờ đối soát"</span> → Bạn vui lòng chờ 15-20 phút sau khi chuyển khoản để nhóm đối soát nhé!</li>
          </ul>
        </div>
      </main>
    </div>
  );
}
