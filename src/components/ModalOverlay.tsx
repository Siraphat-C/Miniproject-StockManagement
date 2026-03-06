"use client";

import { X } from "lucide-react";

interface ModalOverlayProps {
  children: React.ReactNode;
  onClose: () => void;
}

// Overlay + close button ที่เหมือนกันทุกตัวใน AddProductModal,
// UpdateStockModal, ProductHistoryModal — รวมไว้ที่เดียว
export function ModalOverlay({ children, onClose }: ModalOverlayProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="relative w-full flex justify-center">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 bg-gray-100 rounded-full p-1 z-10"
          aria-label="ปิด"
        >
          <X size={20} />
        </button>
        {children}
      </div>
    </div>
  );
}
