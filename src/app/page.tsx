import { unstable_noStore } from "next/cache";
import { prisma } from "@/lib/prisma";
import { LOW_STOCK_THRESHOLD } from "@/lib/constants"; 

export const dynamic = "force-dynamic";

export default async function Dashboard() {
  unstable_noStore();
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const [totalProducts, allMovements, products] = await Promise.all([
    prisma.product.count(),
    prisma.stockTransaction.findMany({
      where: {
        createdAt: { gte: startOfToday },
        type: "IN",
      },
    }),
    prisma.product.findMany({ select: { quantity: true, unitPrice: true } }),
  ]);

  const stockInToday = allMovements.reduce((sum, m) => sum + m.quantity, 0);
  const totalValue = products.reduce((sum, p) => sum + p.quantity * p.unitPrice, 0);
  const lowStockProducts = products.filter(
    (p) => p.quantity <= LOW_STOCK_THRESHOLD && p.quantity > 0 
  ).length;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <h2 className="text-lg font-semibold text-white">Dashboard / ภาพรวม</h2>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow">
          <p className="text-sm text-gray-500 mb-1">Total Products</p>
          <p className="text-xs text-gray-400 mb-3">รายการสินค้าทั้งหมด</p>
          <p className="text-3xl font-bold text-gray-800">{totalProducts.toLocaleString()} รายการ</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow">
          <p className="text-sm text-gray-500 mb-1">Low Stock</p>
          <p className="text-xs text-gray-400 mb-3">สินค้าใกล้หมด</p>
          <p className="text-3xl font-bold text-red-500">{lowStockProducts.toLocaleString()} รายการ</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow">
          <p className="text-sm text-gray-500 mb-1">Stock In Today</p>
          <p className="text-xs text-gray-400 mb-3">จำนวนรายการเข้าวันนี้</p>
          <p className="text-3xl font-bold text-green-600">{stockInToday.toLocaleString()} ชิ้น</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow">
          <p className="text-sm text-gray-500 mb-1">Total Value</p>
          <p className="text-xs text-gray-400 mb-3">มูลค่ารวม</p>
          <p className="text-3xl font-bold text-green-600">฿{totalValue.toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
}