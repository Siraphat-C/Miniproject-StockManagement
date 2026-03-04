"use client";

import { useState, useEffect, useCallback } from "react";
import { ArrowUp, ArrowDown } from "lucide-react";
import type { StockMovement } from "@/types";
import { StockTypeBadge } from "@/components/StockTypeBadge";

export default function ReportsPage() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [reportType, setReportType] = useState<"" | "IN" | "OUT">("");
  const [movements, setMovements] = useState<StockMovement[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchReports = useCallback(async () => {
    setIsLoading(true);
    // Build query safely with URLSearchParams
    const params = new URLSearchParams();
    if (from) params.set("from", from);
    if (to) params.set("to", to);
    if (reportType) params.set("type", reportType);

    try {
      const res = await fetch(`/api/stockmovement?${params.toString()}`);
      const data = await res.json();
      setMovements(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch reports", err);
    } finally {
      setIsLoading(false);
    }
  }, [from, to, reportType]);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  const totalIn = movements
    .filter((m) => m.type === "IN")
    .reduce((sum, m) => sum + m.quantity, 0);
  const totalOut = movements
    .filter((m) => m.type === "OUT")
    .reduce((sum, m) => sum + m.quantity, 0);
  const totalValue = movements.reduce(
    (sum, m) => sum + m.quantity * (m.product?.unitPrice ?? 0),
    0
  );

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in pb-10">
      <h2 className="text-lg font-semibold text-white">Reports / รายงาน</h2>

      {/* Filter section */}
      <div className="bg-white p-6 rounded-xl shadow">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div>
            <label className="block text-sm text-gray-500 mb-2 font-medium">เริ่มวันที่</label>
            <input
              type="date"
              className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm text-gray-500 mb-2 font-medium">ถึงวันที่</label>
            <input
              type="date"
              className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
              value={to}
              onChange={(e) => setTo(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm text-gray-500 mb-2 font-medium">ประเภทรายงาน</label>
            <select
              className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
              value={reportType}
              onChange={(e) => setReportType(e.target.value as "" | "IN" | "OUT")}
            >
              <option value="">สรุปการเคลื่อนไหวทั้งหมด</option>
              <option value="IN">รายงานสินค้าเข้า</option>
              <option value="OUT">รายงานสินค้าออก</option>
            </select>
          </div>

          <button
            onClick={fetchReports}
            className="bg-blue-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition shadow-sm"
          >
            ประมวลผลรายงาน
          </button>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow border-l-4 border-green-500">
          <p className="text-sm text-gray-500 mb-1 font-medium">ยอดรวมรับเข้า (In)</p>
          <p className="text-3xl font-bold text-green-600 flex items-center gap-2">
            <ArrowUp size={24} /> {totalIn}{" "}
            <span className="text-sm font-normal text-gray-400">รายการ</span>
          </p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow border-l-4 border-red-500">
          <p className="text-sm text-gray-500 mb-1 font-medium">ยอดรวมเบิกออก (Out)</p>
          <p className="text-3xl font-bold text-red-500 flex items-center gap-2">
            <ArrowDown size={24} /> {totalOut}{" "}
            <span className="text-sm font-normal text-gray-400">รายการ</span>
          </p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow border-l-4 border-blue-500">
          <p className="text-sm text-gray-500 mb-1 font-medium">มูลค่ารวมที่เคลื่อนไหว</p>
          <p className="text-3xl font-bold text-blue-600">฿{totalValue.toLocaleString()}</p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h3 className="font-bold text-gray-800 text-lg">รายละเอียดการทำรายการล่าสุด</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm min-w-[800px]">
            <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
              <tr>
                <th className="px-6 py-4 font-medium">วัน-เวลา (Date-Time)</th>
                <th className="px-6 py-4 font-medium">รหัสสินค้า (Code)</th>
                <th className="px-6 py-4 font-medium">ชื่อสินค้า (Product Name)</th>
                <th className="px-6 py-4 font-medium text-center">ประเภท (Type)</th>
                <th className="px-6 py-4 font-medium text-right">จำนวน (Qty)</th>
                <th className="px-6 py-4 font-medium">รายละเอียดเพิ่มเติม (Note)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    กำลังโหลดข้อมูลรายงาน...
                  </td>
                </tr>
              ) : movements.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    ไม่มีข้อมูลรายงานตามเงื่อนไขที่เลือก
                  </td>
                </tr>
              ) : (
                movements.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-medium text-gray-800">
                          {new Date(item.createdAt).toLocaleDateString("th-TH")}
                        </span>
                        <span className="text-xs text-gray-500 font-mono">
                          {new Date(item.createdAt).toLocaleTimeString("th-TH", {
                            hour: "2-digit",
                            minute: "2-digit",
                            second: "2-digit",
                          })}{" "}
                          น.
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-mono font-bold text-gray-700">
                      {item.product?.productId}
                    </td>
                    <td className="px-6 py-4 text-gray-800">{item.product?.name}</td>
                    <td className="px-6 py-4 text-center">
                      <StockTypeBadge type={item.type} />
                    </td>
                    <td
                      className={`px-6 py-4 text-right font-bold font-mono ${item.type === "IN" ? "text-green-600" : "text-red-500"
                        }`}
                    >
                      {item.type === "IN" ? "+" : "-"}
                      {item.quantity}
                    </td>
                    <td
                      className="px-6 py-4 text-xs text-gray-500 max-w-xs truncate"
                      title={item.note ?? "-"}
                    >
                      {item.note ?? "-"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
