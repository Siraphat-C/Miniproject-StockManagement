"use client";

import { useState, useCallback, useRef } from "react";
import { ArrowUp, ArrowDown, CalendarDays } from "lucide-react";
import type { StockMovement } from "@/types";
import { StockTypeBadge } from "@/components/StockTypeBadge";
import { Toast } from "@/components/Toast";
import { useToast } from "@/hooks/useToast";

function getTodayStr(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatThaiDate(dateStr: string): string {
  if (!dateStr) return "";
  const d = new Date(`${dateStr}T00:00:00`);
  return d.toLocaleDateString("th-TH", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function ReportsPage() {
  const today = getTodayStr();

  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [reportType, setReportType] = useState<"" | "IN" | "OUT">("");
  const [movements, setMovements] = useState<StockMovement[]>([]);
  // แก้: เริ่มต้น false — ไม่ fetch อัตโนมัติตอน mount
  const [isLoading, setIsLoading] = useState(false);
  const [hasFetched, setHasFetched] = useState(false);
  const [appliedFrom, setAppliedFrom] = useState("");
  const [appliedTo, setAppliedTo] = useState("");

  const { toast, showToast, clearToast } = useToast();

  const filterRef = useRef({ from, to, reportType });
  filterRef.current = { from, to, reportType };

  const fetchReports = useCallback(async () => {
    const { from, to, reportType } = filterRef.current;
    setIsLoading(true);

    const params = new URLSearchParams();
    if (from) params.set("from", from);
    if (to) params.set("to", to);
    if (reportType) params.set("type", reportType);

    try {
      const res = await fetch(`/api/stockmovement?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setMovements(Array.isArray(data) ? data : []);
      setAppliedFrom(from);
      setAppliedTo(to);
      setHasFetched(true);
    } catch (err) {
      console.error("Failed to fetch reports", err);
      showToast("ไม่สามารถโหลดข้อมูลได้", "error");
    } finally {
      setIsLoading(false);
    }
  }, []); 

  const buildRangeLabel = () => {
    if (!appliedFrom && !appliedTo) return "ข้อมูลทั้งหมด";
    if (appliedFrom && appliedTo) {
      if (appliedFrom === appliedTo)
        return `วันที่ ${formatThaiDate(appliedFrom)}`;
      return `วันที่ ${formatThaiDate(appliedFrom)} ถึง ${formatThaiDate(appliedTo)}`;
    }
    if (appliedFrom) return `ตั้งแต่วันที่ ${formatThaiDate(appliedFrom)}`;
    return `ถึงวันที่ ${formatThaiDate(appliedTo)}`;
  };

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
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={clearToast} />
      )}

      <h2 className="text-lg font-semibold text-white">Reports / รายงาน</h2>

      {/* Filter */}
      <div className="bg-white p-6 rounded-xl shadow">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div>
            <label className="block text-sm text-gray-500 mb-2 font-medium">
              เริ่มวันที่
            </label>
            <input
              type="date"
              max={today}
              className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
              value={from}
              onChange={(e) => {
                const val = e.target.value;
                setFrom(val);
                if (to && val > to) setTo(val);
              }}
            />
          </div>

          <div>
            <label className="block text-sm text-gray-500 mb-2 font-medium">
              ถึงวันที่
            </label>
            <input
              type="date"
              min={from || undefined}
              max={today}
              className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
              value={to}
              onChange={(e) => setTo(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm text-gray-500 mb-2 font-medium">
              ประเภทรายงาน
            </label>
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

          <div className="flex flex-col gap-2">
            {/* แก้: onClick เรียก fetchReports โดยตรง — ไม่มี useEffect auto-trigger */}
            <button
              onClick={fetchReports}
              disabled={isLoading}
              className="bg-blue-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition shadow-sm disabled:opacity-60"
            >
              {isLoading ? "กำลังโหลด..." : "ประมวลผลรายงาน"}
            </button>
            {(from || to) && (
              <button
                onClick={() => {
                  setFrom("");
                  setTo("");
                }}
                className="text-xs text-gray-400 hover:text-gray-600 transition underline text-center"
              >
                ล้างตัวกรองวันที่
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Placeholder ก่อนกดปุ่มครั้งแรก */}
      {!hasFetched ? (
        <div className="bg-white rounded-xl shadow p-12 text-center">
          <CalendarDays size={40} className="mx-auto mb-3 text-gray-300" />
          <p className="text-sm text-gray-400">
            เลือกเงื่อนไขแล้วกด{" "}
            <strong className="text-gray-600">ประมวลผลรายงาน</strong> เพื่อดูข้อมูล
          </p>
        </div>
      ) : (
        <>
          {/* Summary header */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <CalendarDays size={18} className="text-blue-500" />
              <h3 className="text-sm font-semibold text-white">
                รายละเอียดข้อมูลของ{" "}
                <span className="text-blue-300">{buildRangeLabel()}</span>
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-xl shadow border-l-4 border-green-500">
                <p className="text-sm text-gray-500 mb-1 font-medium">
                  ยอดรวมรับเข้า (In)
                </p>
                <p className="text-3xl font-bold text-green-600 flex items-center gap-2">
                  <ArrowUp size={24} /> {totalIn.toLocaleString()}{" "}
                  <span className="text-sm font-normal text-gray-400">รายการ</span>
                </p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow border-l-4 border-red-500">
                <p className="text-sm text-gray-500 mb-1 font-medium">
                  ยอดรวมเบิกออก (Out)
                </p>
                <p className="text-3xl font-bold text-red-500 flex items-center gap-2">
                  <ArrowDown size={24} /> {totalOut.toLocaleString()}{" "}
                  <span className="text-sm font-normal text-gray-400">รายการ</span>
                </p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow border-l-4 border-blue-500">
                <p className="text-sm text-gray-500 mb-1 font-medium">
                  มูลค่ารวมที่เคลื่อนไหว
                </p>
                <p className="text-3xl font-bold text-blue-600">
                  ฿{totalValue.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-xl shadow overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h3 className="font-bold text-gray-800 text-lg">
                รายละเอียดการทำรายการ
              </h3>
              <p className="text-sm text-gray-400 mt-0.5">
                {movements.length.toLocaleString()} รายการ
              </p>
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
                    <th className="px-6 py-4 font-medium">หมายเหตุ (Note)</th>
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
                      <td
                        colSpan={6}
                        className="px-6 py-12 text-center text-gray-500"
                      >
                        ไม่มีข้อมูลรายงานตามเงื่อนไขที่เลือก
                      </td>
                    </tr>
                  ) : (
                    movements.map((item) => (
                      <tr
                        key={item.id}
                        className="hover:bg-gray-50 transition-colors"
                      >
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
                        <td className="px-6 py-4 text-gray-800">
                          {item.product?.name}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <StockTypeBadge type={item.type} />
                        </td>
                        <td
                          className={`px-6 py-4 text-right font-bold font-mono ${
                            item.type === "IN" ? "text-green-600" : "text-red-500"
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
        </>
      )}
    </div>
  );
}
