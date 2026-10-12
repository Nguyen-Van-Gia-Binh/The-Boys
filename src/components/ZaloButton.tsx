"use client";

export default function ZaloButton() {
  return (
    <>
      <a
        href="https://zalo.me/0916532006"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Nhắn Zalo hỗ trợ 0916 532 006"
        className="zalo-fab"
      >
        {/* Chữ Z icon */}
        <svg width="22" height="22" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <rect width="48" height="48" rx="12" fill="white" fillOpacity="0.15"/>
          <text x="50%" y="54%" dominantBaseline="middle" textAnchor="middle" fontSize="20" fontWeight="bold" fill="white" fontFamily="Arial, sans-serif">Z</text>
        </svg>
        <span>Zalo hỗ trợ</span>
        <span className="zalo-fab__pulse" aria-hidden="true" />
      </a>

      <style>{`
        .zalo-fab {
          position: fixed;
          bottom: 74px;
          left: 14px;
          z-index: 39;
          display: flex;
          align-items: center;
          gap: 6px;
          background: #0068FF;
          color: #fff;
          border-radius: 999px;
          padding: 8px 13px 8px 10px;
          font-size: 12px;
          font-weight: 600;
          text-decoration: none;
          box-shadow: 0 4px 18px rgba(0,104,255,0.40);
          transform: translateZ(0);
          transition: transform 0.15s, box-shadow 0.15s;
          font-family: inherit;
        }
        @media (min-width: 768px) {
          .zalo-fab {
            bottom: 24px;
            left: 24px;
            padding: 10px 16px 10px 12px;
            font-size: 13px;
            gap: 8px;
          }
        }
        .zalo-fab:hover {
          transform: scale(1.06);
          box-shadow: 0 6px 24px rgba(0,104,255,0.55);
        }
        .zalo-fab__pulse {
          position: absolute;
          inset: 0;
          border-radius: 999px;
          border: 2px solid #0068FF;
          animation: zalo-pulse 2s ease-out infinite;
          pointer-events: none;
        }
        @keyframes zalo-pulse {
          0%   { transform: scale(1);    opacity: 0.7; }
          70%  { transform: scale(1.35); opacity: 0;   }
          100% { transform: scale(1.35); opacity: 0;   }
        }
      `}</style>
    </>
  );
}
