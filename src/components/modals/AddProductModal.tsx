"use client";

import { useState, useRef } from "react";
import { X, Package, ImagePlus, Trash2 } from "lucide-react";

interface NewProductForm {
  name: string;
  category: string;
  quantity: number;
  unitPrice: number;
  imageUrl: string; // base64 string
}

interface Props {
  onClose: () => void;
  onSuccess: () => void;
  onToast: (message: string, type: "success" | "error") => void;
}

const MAX_IMAGE_SIZE_MB = 1;
const MAX_IMAGE_BYTES = MAX_IMAGE_SIZE_MB * 1024 * 1024;

export function AddProductModal({ onClose, onSuccess, onToast }: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<NewProductForm>({
    name: "",
    category: "",
    quantity: 0,
    unitPrice: 0,
    imageUrl: "",
  });

  // ─── Image handling ──────────────────────────────────────────────────
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageError(null);

    // Validate type
    if (!file.type.startsWith("image/")) {
      setImageError("กรุณาเลือกไฟล์รูปภาพเท่านั้น");
      return;
    }

    // Validate size
    if (file.size > MAX_IMAGE_BYTES) {
      setImageError(`ขนาดไฟล์ต้องไม่เกิน ${MAX_IMAGE_SIZE_MB} MB`);
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      setImagePreview(base64);
      setForm((prev) => ({ ...prev, imageUrl: base64 }));
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    setImageError(null);
    setForm((prev) => ({ ...prev, imageUrl: "" }));
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // ─── Submit ──────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        onClose();
        onSuccess();
        onToast("เพิ่มสินค้าใหม่สำเร็จ", "success");
      } else {
        onToast("เกิดข้อผิดพลาดในการเพิ่มสินค้า", "error");
      }
    } catch {
      onToast("เกิดข้อผิดพลาดในการเชื่อมต่อ", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative animate-fade-in-up border-t-4 border-blue-500 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 bg-gray-100 rounded-full p-1"
        >
          <X size={20} />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="bg-blue-100 p-2 rounded-lg text-blue-600">
            <Package size={24} />
          </div>
          <h3 className="text-xl font-bold text-gray-800">เพิ่มรายการสินค้าใหม่</h3>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* ─── Image Upload ─────────────────────────────────────────── */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              รูปภาพสินค้า (ไม่บังคับ)
            </label>

            {imagePreview ? (
              <div className="relative w-full h-40 rounded-xl overflow-hidden border-2 border-blue-200 group">
                <img
                  src={imagePreview}
                  alt="preview"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 shadow-md transition-colors opacity-0 group-hover:opacity-100"
                  title="ลบรูปภาพ"
                >
                  <Trash2 size={14} />
                </button>
                <div className="absolute bottom-2 left-2 bg-black/40 text-white text-xs px-2 py-0.5 rounded-full">
                  คลิกที่ไอคอนถังขยะเพื่อลบรูป
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full h-36 rounded-xl border-2 border-dashed border-gray-300 hover:border-blue-400 hover:bg-blue-50 transition-colors flex flex-col items-center justify-center gap-2 text-gray-400 hover:text-blue-500"
              >
                <ImagePlus size={28} />
                <span className="text-sm font-medium">คลิกเพื่อเลือกรูปภาพ</span>
                <span className="text-xs text-gray-400">PNG, JPG, WEBP ขนาดไม่เกิน {MAX_IMAGE_SIZE_MB} MB</span>
              </button>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />

            {imageError && (
              <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                <X size={12} /> {imageError}
              </p>
            )}
          </div>

          {/* ─── Text fields ──────────────────────────────────────────── */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ชื่อสินค้า (Name)</label>
            <input
              required
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="เช่น สมุดโน้ตปกอ่อน"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">หมวดหมู่ (Category)</label>
            <input
              required
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              placeholder="เช่น เครื่องเขียน"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">จำนวนเริ่มต้น (Qty)</label>
              <input
                required
                type="number"
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={form.quantity}
                onChange={(e) => setForm({ ...form, quantity: Number(e.target.value) })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ราคา/หน่วย (Price)</label>
              <input
                required
                type="number"
                min="0"
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={form.unitPrice}
                onChange={(e) => setForm({ ...form, unitPrice: Number(e.target.value) })}
              />
            </div>
          </div>

          {/* ─── Actions ──────────────────────────────────────────────── */}
          <div className="pt-4 flex justify-end gap-3 border-t mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium transition-colors"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {isSubmitting ? "กำลังบันทึก..." : "บันทึกสินค้า"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
