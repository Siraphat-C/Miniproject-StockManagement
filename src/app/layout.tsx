import type { Metadata } from "next";
import Link from "next/link";
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
      <body>
        <nav style={{
          padding: "1rem",
          borderBottom: "1px solid #eaeaea",
          marginBottom: "2rem",
        }}>
          <Link href="/" style={{ marginRight: "1rem" }}>หน้าแรก</Link>
          <Link href="/about" style={{ marginRight: '1rem' }}>เกี่ยวกับเรา</Link>
          <Link href="/products" style={{ marginRight: '1rem' }}>สินค้า</Link>
        </nav>
        {children}
      </body>
    </html>
  );
}