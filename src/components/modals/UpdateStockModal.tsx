"use client";

import { useState } from "react";
import { X, ArrowUp, ArrowDown } from "lucide-react";
import type { Product } from "@/types";

interface StockUpdateForm {
  type: "IN" | "OUT";
  quantity: number;
  note: string;
}

interface Props {
  product: Product;
  onClose: () => void;
  onSuccess: () => void;
  onToast: (message: string, type: "success" | "error") => void;
}

export function UpdateStockModal({ product, onClose, onSuccess, onToast }: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState<StockUpdateForm>({
    type: "IN",
    quantity: 1,
    note: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/stockmovement", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product.id,
          type: form.type,
          quantity: form.quantity,
          note: form.note,
        }),
      });
      if (res.ok) {
        onClose();
        onSuccess();
        onToast("อัพเดทสต็อกสำเร็จ", "success");
      } else {
        const data = await res.json();
        onToast(data.error || "เกิดข้อผิดพลาดในการอัพเดทสต็อก", "error");
      }
    } catch {
      onToast("เกิดข้อผิดพลาดในการเชื่อมต่อ", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative animate-fade-in-up border-t-4 border-blue-500">
        <button onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 bg-gray-100 rounded-full p-1">
          <X size={20} />
        </button>

        <h3 className="text-xl font-bold text-gray-800 mb-1">อัพเดทสต็อกสินค้า</h3>
        <div className="bg-gray-50 border rounded-lg p-3 mb-4 mt-2">
          <p className="text-sm text-gray-600">
            รหัส: <span className="font-mono text-gray-800">{product.productId}</span><br />
            ชื่อ: <span className="font-semibold text-gray-800">{product.name}</span><br />
            คงเหลือปัจจุบัน:{" "}
            <span className="font-bold text-blue-600 text-lg">{product.quantity}</span>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {(["IN", "OUT"] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setForm({ ...form, type: t })}
                className={`py-3 rounded-lg border-2 font-bold flex flex-col items-center justify-center gap-1 transition-all
                  ${form.type === t
                    ? t === "IN"
                      ? "border-green-500 bg-green-50 text-green-700 shadow-sm"
                      : "border-red-500 bg-red-50 text-red-700 shadow-sm"
                    : "border-gray-200 text-gray-500 hover:bg-gray-50"
                  }`}
              >
                {t === "IN"
                  ? <ArrowUp size={24} className={form.type === "IN" ? "text-green-600" : "text-gray-400"} />
                  : <ArrowDown size={24} className={form.type === "OUT" ? "text-red-500" : "text-gray-400"} />
                }
                {t === "IN" ? "นำเข้า (IN)" : "นำออก (OUT)"}
              </button>
            ))}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              จำนวนที่ต้องการ (Quantity)
            </label>
            <div className="relative">
              <input
                required type="number" min="1"
                className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg font-bold"
                value={form.quantity || ""}
                onChange={(e) => setForm({ ...form, quantity: Number(e.target.value) })}
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
                รายการ
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              หมายเหตุ (Note) - ไม่บังคับ
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={form.note}
              onChange={(e) => setForm({ ...form, note: e.target.value })}
              placeholder="เช่น ซื้อเพิ่ม, เบิกไปใช้ในออฟฟิศ, ของเสีย เป็นต้น"
            />
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t mt-4">
            <button type="button" onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium transition-colors">
              ยกเลิก
            </button>
            <button type="submit" disabled={isSubmitting || !form.quantity}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50">
              {isSubmitting ? "กำลังบันทึก..." : "ยืนยันการอัพเดท"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}