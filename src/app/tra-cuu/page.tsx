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
              <h1 className="text-lg font-bold text-[var(--brand-heading)]">Tra cứu đơn hàng</h1>
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
            Kiểm tra trạng thái đơn hàng
          </h2>
          <p className="mt-2 text-sm text-[var(--brand-muted)]">
            Nhập mã đơn hàng hoặc số điện thoại đã sử dụng khi đặt hàng để xem trạng thái thanh toán và thông tin nhận hàng.
          </p>
        </div>

        {/* Lookup Component */}
        <OrderLookup />

        {/* Footer CTA */}
        <div className="mt-10 text-center">
          <p className="text-sm text-[var(--brand-muted)]">
            Bạn chưa có đơn hàng?{" "}
            <Link href="/" className="font-semibold text-[#315444] hover:underline">
              Quay lại gian hàng
            </Link>
          </p>
        </div>

        {/* Info Box */}
        <div className="mt-8 rounded-2xl border border-[var(--brand-border)] bg-[var(--brand-surface-alt)] p-4">
          <h3 className="text-sm font-bold text-[var(--brand-heading)] mb-2">💡 Mẹo tra cứu nhanh</h3>
          <ul className="text-xs text-[var(--brand-muted)] space-y-1.5">
            <li>• <strong>Mã đơn hàng</strong>: Có dạng <code className="bg-[var(--brand-border)] px-1.5 py-0.5 rounded text-[#b93815] dark:text-[#f39c5b] font-mono">DHxxxx</code>, ví dụ: DH1234</li>
            <li>• <strong>Số điện thoại</strong>: Nhập đầy đủ số điện thoại đã dùng khi đặt hàng</li>
            <li>• Nếu đơn hiển thị <span className="text-emerald-600 font-semibold">"Đã thanh toán"</span> → Nhóm The Boys đã nhận tiền và đang chuẩn bị đơn cho bạn!</li>
            <li>• Nếu đơn hiển thị <span className="text-amber-600 font-semibold">"Chờ chuyển khoản"</span> → Bạn vui lòng hoàn tất chuyển khoản để đơn được xác nhận nhé!</li>
          </ul>
        </div>
      </main>
    </div>
  );
}
