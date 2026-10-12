import type { Metadata } from "next";
import "./globals.css";
import ZaloButton from "@/components/ZaloButton";

export const metadata: Metadata = {
  title: "Dòng Nước Về Nguồn — Trao yêu thương, tri ân anh hùng",
  description: "Dự án thiện nguyện gây quỹ của sinh viên The Boys, chung tay trao tặng 20 phần quà tri ân các anh hùng thương binh nhiễm chất độc da cam.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Be Vietnam Pro (Hiện đại, thân thiện) & Lora (Ấm áp, mềm mại, chuẩn dấu tiếng Việt 100%) */}
        <link
          href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400;1,600&family=Lora:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600&display=swap"
          rel="stylesheet"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');if(!t){t=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'}document.documentElement.classList.toggle('dark',t==='dark');}catch(e){}})()`,
          }}
        />
      </head>
      <body className="antialiased min-h-screen">
        {children}
        <ZaloButton />
      </body>
    </html>
  );
}
