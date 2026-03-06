"use client";

import { useState, useEffect } from "react";
import type { ProductListItem } from "@/types";

// เพิ่ม refreshTrigger เพื่อให้ stockmovement/page.tsx สามารถ
// สั่ง refresh ได้หลัง add/delete โดยไม่ต้องเขียน fetch ซ้ำเอง
export function useProducts(
  search: string,
  refreshTrigger = 0,
  debounceMs = 300
) {
  const [products, setProducts] = useState<ProductListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch(
          `/api/products?search=${encodeURIComponent(search)}`
        );
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setProducts(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to fetch products", err);
        setError("ไม่สามารถโหลดข้อมูลสินค้าได้");
        setProducts([]);
      } finally {
        setIsLoading(false);
      }
    };

    // refreshTrigger > 0 = สั่ง refresh หลัง mutation → fetch ทันที ไม่ debounce
    // refreshTrigger = 0 = search keystroke → debounce ตามปกติ
    const delay = refreshTrigger > 0 ? 0 : debounceMs;
    const timer = setTimeout(fetchProducts, delay);
    return () => clearTimeout(timer);
  }, [search, debounceMs, refreshTrigger]);

  return { products, isLoading, error };
}
