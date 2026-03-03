"use client"; // ต้องเป็น client component เพื่อใช้ usePathname

import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import "./globals.css";

// metadata ต้องย้ายออกไปเป็น separate file หรือใช้ generateMetadata
// เนื่องจาก layout กลายเป็น client component

const navLinks = [
  { href: "/", label: "Dashboard", icon: "/dashboard.png" },
  { href: "/inventory", label: "Inventory", icon: "/inventory.png" },
  { href: "/stockmovement", label: "Stock Movement", icon: "/stockmm.png" },
  { href: "/reports", label: "Reports", icon: "/report.png" },
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <html lang="th">
      <body className="relative min-h-screen bg-[url('/bg.png')] bg-cover bg-center">
        <div className="absolute inset-0 bg-black/60 pointer-events-none" />

        <header className="bg-white relative z-10 shadow-sm">
          <div className="flex flex-col items-center py-5">
            <h1 className="text-xl font-bold mt-1">Stock Management</h1>
            <p className="text-sm text-gray-500">ระบบจัดการสต็อกสินค้า</p>
          </div>
          <div className="border-t border-gray-100">
            <nav className="container mx-auto flex h-14 items-center justify-center gap-10 text-sm font-medium px-4">
              {navLinks.map(({ href, label, icon }) => {
                // ✅ active state: exact match สำหรับ "/" ใช้ includes สำหรับ nested
                const isActive =
                  href === "/" ? pathname === "/" : pathname.startsWith(href);
                return (
                  <Link
                    key={href}
                    href={href}
                    className={`flex items-center gap-2 transition-colors ${
                      isActive
                        ? "text-blue-600 font-semibold border-b-2 border-blue-600 pb-0.5"
                        : "text-slate-600 hover:text-gray-900"
                    }`}
                  >
                    <Image src={icon} width={20} height={20} alt={label} />
                    {label}
                  </Link>
                );
              })}
            </nav>
          </div>
        </header>

        <main className="p-8 relative z-10">{children}</main>
      </body>
    </html>
  );
}