// ลบ "use client" ออก → layout กลายเป็น Server Component
// metadata จึงทำงานได้ตามปกติ
// usePathname ย้ายไปอยู่ใน components/NavBar.tsx แทน
import type { Metadata } from "next";
import { NavBar } from "@/components/NavBar";
import "./globals.css";

export const metadata: Metadata = {
  title: "Stock Management",
  description: "ระบบจัดการสต็อกสินค้า",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="th">
      <body className="relative min-h-screen bg-[url('/bg.png')] bg-cover bg-center">
        <div className="absolute inset-0 bg-black/60 pointer-events-none" />
        <NavBar />
        <main className="p-8 relative z-10">{children}</main>
      </body>
    </html>
  );
}
