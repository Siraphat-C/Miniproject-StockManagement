"use client";

import React, { useState } from "react";
import { Search } from "lucide-react";
import { getStockStatus } from "@/lib/utils";
import { useProducts } from "@/hooks/useProducts"; // ← ใช้ custom hook

export default function Inventory() {
  const [search, setSearch] = useState("");
  const { products, isLoading, error } = useProducts(search); // ← แทน useEffect ทั้งก้อน

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in pb-10">
      <h2 className="text-lg font-semibold text-white">Inventory / คลังสินค้า</h2>

      <div className="bg-white rounded-xl shadow px-4 py-3 flex items-center gap-3">
        <Search size={18} className="text-gray-400 shrink-0" />
        <input
          placeholder="ค้นหาด้วยรหัสสินค้าหรือชื่อสินค้า..."
          className="w-full text-sm outline-none bg-transparent text-gray-700 placeholder-gray-400"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="bg-white rounded-xl shadow overflow-hidden overflow-x-auto">
        <table className="w-full text-sm text-left min-w-[700px]">
          <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
            <tr>
              <th className="px-6 py-4 font-medium">ProductID</th>
              <th className="px-6 py-4 font-medium">Name</th>
              <th className="px-6 py-4 font-medium">Category</th>
              <th className="px-6 py-4 font-medium">Quantity</th>
              <th className="px-6 py-4 font-medium">Unit Price</th>
              <th className="px-6 py-4 font-medium">Total</th>
              <th className="px-6 py-4 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {isLoading ? (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center text-gray-500">กำลังโหลดข้อมูล...</td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center text-red-500">{error}</td>
              </tr>
            ) : products.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center text-gray-500">ไม่พบสินค้า</td>
              </tr>
            ) : (
              products.map((p) => {
                const { label, className } = getStockStatus(p.quantity);
                return (
                  <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-mono text-gray-600">{p.productId}</td>
                    <td className="px-6 py-4 font-medium text-gray-800">{p.name}</td>
                    <td className="px-6 py-4 text-gray-600">{p.category}</td>
                    <td className="px-6 py-4 text-gray-800">{p.quantity}</td>
                    <td className="px-6 py-4 text-gray-800">฿{p.unitPrice.toLocaleString()}</td>
                    <td className="px-6 py-4 text-gray-800">฿{(p.quantity * p.unitPrice).toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${className}`}>{label}</span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}