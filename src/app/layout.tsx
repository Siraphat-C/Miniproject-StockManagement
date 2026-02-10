import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import { Separator } from "@/components/ui/separator"

export const metadata: Metadata = {
  title: "Stock management",
  description: "Stock Management",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="th">
      <body className="bg-gray-100 text-gray-900">
        <header className="bg-white">
        <div className="flex flex-col items-center py-6">
          <img
            src="/headbg.png"
            alt="Warehouse Logo"
            width={150}
            height={200}
          />
          <h1 className="text-xl font-bold mt-2">Stock Management</h1>
          <p className="text-sm opacity-80">ระบบจัดการสต็อกสินค้า</p>
          <br />
        </div>
        <div className="container mx-auto flex h-16 items-center px-4">
          <nav className="flex flex-1 items-center justify-center space-x-25 text-sm font-medium">
            <Link href="/" className="flex items-center gap-2 tecxt-slate-600 hover:text-gray-900 transition-colors"><img src="Dashboard.png" className="w-6 h-6"/>Dashboard</Link>
            <Link href="/inventory" className="flex items-center gap-2 tecxt-slate-600 hover:text-slate-900 transition-colors"><img src="inventory.png" className="w-6 h-6"/>Inventory</Link>
            <Link href="/stockmovement" className="flex items-center gap-2 tecxt-slate-600 hover:text-slate-900 transition-colors"><img src="stockmm.png" className="w-6 h-6"/>Stock Movement</Link>
            <Link href="/reports" className="flex items-center gap-2 tecxt-slate-600 hover:text-slate-900 transition-colors"><img src="report.png" className="w-6 h-6"/>Reports</Link>
          </nav>
        </div>
        </header>
        <Separator className="my-4" />
        <main className="p-8">{children}</main>
      </body>
    </html>
  );
}