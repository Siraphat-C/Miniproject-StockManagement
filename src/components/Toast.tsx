"use client";

import { useEffect } from "react";
import { CheckCircle, XCircle, X } from "lucide-react";

interface ToastProps {
  message: string;
  type: "success" | "error";
  onClose: () => void;
}

export function Toast({ message, type, onClose }: ToastProps) {
  // ปิดอัตโนมัติหลัง 3 วินาที
  useEffect(() => {
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div
      className={`fixed bottom-6 right-6 z-[100] flex items-center gap-3 px-5 py-4 rounded-xl shadow-xl text-white text-sm font-medium animate-fade-in-up
        ${type === "success" ? "bg-green-600" : "bg-red-500"}`}
    >
      {type === "success" ? <CheckCircle size={20} /> : <XCircle size={20} />}
      {message}
      <button onClick={onClose} className="ml-2 hover:opacity-70 transition-opacity">
        <X size={16} />
      </button>
    </div>
  );
}