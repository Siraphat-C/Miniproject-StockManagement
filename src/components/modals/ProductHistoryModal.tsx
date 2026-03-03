"use client";

import { X, History } from "lucide-react";
import type { Product, StockMovement } from "@/types";
import { StockTypeBadge } from "@/components/StockTypeBadge";

interface Props {
  product: Product;
  history: StockMovement[];
  onClose: () => void;
}

export function ProductHistoryModal({ product, history, onClose }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl p-6 relative animate-fade-in-up max-h-[90vh] flex flex-col">
        <button onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 bg-gray-100 rounded-full p-1">
          <X size={20} />
        </button>

        <h3 className="text-xl font-bold text-gray-800 mb-1 flex items-center gap-2">
          <History className="text-blue-500" />
          ประวัติการเคลื่อนไหว
        </h3>
        <p className="text-sm text-gray-500 mb-4 pb-4 border-b">
          สินค้า:{" "}
          <span className="font-semibold text-gray-800">
            {product.productId} - {product.name}
          </span>
        </p>

        <div className="overflow-y-auto flex-1 bg-gray-50 rounded-lg border">
          <table className="w-full text-left text-sm relative">
            <thead className="bg-gray-100 text-gray-600 uppercase text-xs sticky top-0 shadow-sm">
              <tr>
                <th className="px-4 py-3 font-medium">วัน-เวลา (Date/Time)</th>
                <th className="px-4 py-3 font-medium text-center">ประเภท</th>
                <th className="px-4 py-3 font-medium text-right">จำนวน</th>
                <th className="px-4 py-3 font-medium">หมายเหตุ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {history.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                    ไม่พบประวัติการเคลื่อนไหว
                  </td>
                </tr>
              ) : (
                history.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-mono text-gray-600 text-xs">
                      {new Date(item.createdAt).toLocaleString("th-TH")}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <StockTypeBadge type={item.type} />
                    </td>
                    <td className={`px-4 py-3 text-right font-bold font-mono
                      ${item.type === "IN" ? "text-green-600" : "text-red-500"}`}>
                      {item.type === "IN" ? "+" : "-"}{item.quantity}
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-500">
                      {item.note ?? "-"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="pt-4 mt-2 flex justify-end">
          <button type="button" onClick={onClose}
            className="px-6 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg font-medium transition-colors">
            ปิดหน้าต่าง
          </button>
        </div>
      </div>
    </div>
  );
}