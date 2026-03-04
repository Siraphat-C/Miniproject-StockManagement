"use client";

import { useState, useEffect } from "react";
import type { Product } from "@/types";

/**
 * Custom hook สำหรับ fetch + debounce search สินค้า
 * ใช้ร่วมกันได้ระหว่าง inventory/page.tsx และ stockmovement/page.tsx
 */
export function useProducts(search: string, debounceMs = 300) {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/products?search=${encodeURIComponent(search)}`);
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

    const timer = setTimeout(fetchProducts, debounceMs);
    return () => clearTimeout(timer);
  }, [search, debounceMs]);

  return { products, isLoading, error };
}