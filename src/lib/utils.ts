import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { StockStatus } from "@/types";
import { LOW_STOCK_THRESHOLD } from "@/lib/constants"; // ← import จาก constants

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getStockStatus(quantity: number): StockStatus {
  if (quantity === 0) {
    return { label: "Out of Stock", className: "bg-red-100 text-red-700" };
  }
  if (quantity <= LOW_STOCK_THRESHOLD) { // ← ไม่ hardcode อีกต่อไป
    return { label: "Low Stock", className: "bg-yellow-100 text-yellow-700" };
  }
  return { label: "In Stock", className: "bg-green-100 text-green-700" };
}