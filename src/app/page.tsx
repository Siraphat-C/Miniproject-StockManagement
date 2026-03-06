"use client";

import React, { useState, useEffect } from "react";
import { Search, X, Package, TrendingUp, AlertTriangle, DollarSign, Tag, Hash, Layers } from "lucide-react";
import { getStockStatus } from "@/lib/utils";
import { LOW_STOCK_THRESHOLD } from "@/lib/constants";
import type { Product } from "@/types";

// ─── Product Detail Modal ──────────────────────────────────────────────────────
interface ProductDetailModalProps {
  product: Product;
  onClose: () => void;
}

function ProductDetailModal({ product, onClose }: ProductDetailModalProps) {
  const { label, className } = getStockStatus(product.quantity);
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Image area */}
        <div className="relative h-52 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center overflow-hidden">
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex flex-col items-center gap-2 text-gray-400">
              <Package size={52} strokeWidth={1.2} />
              <span className="text-sm">ไม่มีรูปภาพสินค้า</span>
            </div>
          )}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 bg-white/90 hover:bg-white text-gray-600 rounded-full p-1.5 shadow transition-colors"
          >
            <X size={18} />
          </button>
          {/* Status badge overlay */}
          <div className="absolute bottom-3 left-3">
            <span className={`px-3 py-1.5 rounded-full text-xs font-bold shadow ${className}`}>
              {label}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div>
            <h3 className="text-xl font-bold text-gray-800 leading-tight">{product.name}</h3>
            <p className="text-sm text-gray-500 mt-0.5">{product.category}</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-50 rounded-xl p-3 flex items-center gap-3">
              <div className="bg-blue-100 p-2 rounded-lg">
                <Hash size={16} className="text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-gray-400 font-medium">รหัสสินค้า</p>
                <p className="text-sm font-bold text-gray-800 font-mono">{product.productId}</p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-3 flex items-center gap-3">
              <div className="bg-purple-100 p-2 rounded-lg">
                <Tag size={16} className="text-purple-600" />
              </div>
              <div>
                <p className="text-xs text-gray-400 font-medium">หมวดหมู่</p>
                <p className="text-sm font-bold text-gray-800">{product.category}</p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-3 flex items-center gap-3">
              <div className="bg-green-100 p-2 rounded-lg">
                <Layers size={16} className="text-green-600" />
              </div>
              <div>
                <p className="text-xs text-gray-400 font-medium">จำนวนคงเหลือ</p>
                <p className="text-sm font-bold text-gray-800">{product.quantity.toLocaleString()} ชิ้น</p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-3 flex items-center gap-3">
              <div className="bg-amber-100 p-2 rounded-lg">
                <DollarSign size={16} className="text-amber-600" />
              </div>
              <div>
                <p className="text-xs text-gray-400 font-medium">ราคา/หน่วย</p>
                <p className="text-sm font-bold text-gray-800">฿{product.unitPrice.toLocaleString()}</p>
              </div>
            </div>
          </div>

          {/* Total value */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-xl p-4 flex justify-between items-center">
            <span className="text-sm font-medium text-blue-700">มูลค่ารวมในคลัง</span>
            <span className="text-xl font-bold text-blue-700">
              ฿{(product.quantity * product.unitPrice).toLocaleString()}
            </span>
          </div>

          <button
            onClick={onClose}
            className="w-full py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-colors text-sm"
          >
            ปิด
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Status Group Label ────────────────────────────────────────────────────────
function StatusGroupHeader({ label, count, colorClass }: { label: string; count: number; colorClass: string }) {
  return (
    <tr className="bg-gray-50">
      <td colSpan={5} className="px-6 py-2">
        <div className="flex items-center gap-2">
          <span className={`inline-block w-2 h-2 rounded-full ${colorClass}`} />
          <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
            {label}
          </span>
          <span className="text-xs text-gray-400 font-medium">({count} รายการ)</span>
        </div>
      </td>
    </tr>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function DashboardInventoryPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/products?search=${encodeURIComponent(search)}`);
        const data = await res.json();
        setProducts(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to fetch products", err);
      } finally {
        setIsLoading(false);
      }
    };
    const timer = setTimeout(fetchProducts, 300);
    return () => clearTimeout(timer);
  }, [search]);

  // ─── Dashboard stats ───────────────────────────────────────────────────────
  const totalProducts = products.length;
  const totalValue = products.reduce((sum, p) => sum + p.quantity * p.unitPrice, 0);
  const lowStockCount = products.filter(
    (p) => p.quantity <= LOW_STOCK_THRESHOLD && p.quantity > 0
  ).length;
  const outOfStockCount = products.filter((p) => p.quantity === 0).length;

  // ─── Group products by status ──────────────────────────────────────────────
  const outOfStock = products.filter((p) => p.quantity === 0);
  const lowStock = products.filter((p) => p.quantity > 0 && p.quantity <= LOW_STOCK_THRESHOLD);
  const inStock = products.filter((p) => p.quantity > LOW_STOCK_THRESHOLD);

  const groupedProducts: { groupLabel: string; dotColor: string; items: Product[] }[] = [
    { groupLabel: "In Stock", dotColor: "bg-green-500", items: inStock },
  { groupLabel: "Low Stock", dotColor: "bg-yellow-500", items: lowStock },
  { groupLabel: "Out of Stock", dotColor: "bg-red-500", items: outOfStock },
  ].filter((g) => g.items.length > 0);

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in pb-10">

      {/* ─── Header ─────────────────────────────────────────────────────── */}
      <h2 className="text-lg font-semibold text-white">Dashboard & Inventory / ภาพรวมและคลังสินค้า</h2>

      {/* ─── Stat Cards ─────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl shadow border-l-4 border-blue-500">
          <div className="flex justify-between items-start mb-3">
            <p className="text-xs text-gray-500 font-medium leading-tight">Total Products<br /><span className="text-gray-400">รายการสินค้าทั้งหมด</span></p>
            <div className="bg-blue-50 p-1.5 rounded-lg">
              <Package size={16} className="text-blue-500" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-800">{totalProducts.toLocaleString()}</p>
        </div>

        <div className="bg-white p-5 rounded-xl shadow border-l-4 border-yellow-400">
          <div className="flex justify-between items-start mb-3">
            <p className="text-xs text-gray-500 font-medium leading-tight">Low Stock<br /><span className="text-gray-400">สินค้าใกล้หมด</span></p>
            <div className="bg-yellow-50 p-1.5 rounded-lg">
              <AlertTriangle size={16} className="text-yellow-500" />
            </div>
          </div>
          <p className="text-2xl font-bold text-yellow-500">{lowStockCount.toLocaleString()}</p>
        </div>

        <div className="bg-white p-5 rounded-xl shadow border-l-4 border-red-500">
          <div className="flex justify-between items-start mb-3">
            <p className="text-xs text-gray-500 font-medium leading-tight">Out of Stock<br /><span className="text-gray-400">สินค้าหมด</span></p>
            <div className="bg-red-50 p-1.5 rounded-lg">
              <AlertTriangle size={16} className="text-red-500" />
            </div>
          </div>
          <p className="text-2xl font-bold text-red-500">{outOfStockCount.toLocaleString()}</p>
        </div>

        <div className="bg-white p-5 rounded-xl shadow border-l-4 border-green-500">
          <div className="flex justify-between items-start mb-3">
            <p className="text-xs text-gray-500 font-medium leading-tight">Total Value<br /><span className="text-gray-400">มูลค่ารวม</span></p>
            <div className="bg-green-50 p-1.5 rounded-lg">
              <TrendingUp size={16} className="text-green-500" />
            </div>
          </div>
          <p className="text-2xl font-bold text-green-600">฿{totalValue.toLocaleString()}</p>
        </div>
      </div>

      {/* ─── Search ─────────────────────────────────────────────────────── */}
      <div className="bg-white rounded-xl shadow px-4 py-3 flex items-center gap-3">
        <Search size={18} className="text-gray-400 shrink-0" />
        <input
          placeholder="ค้นหาด้วยรหัสสินค้าหรือชื่อสินค้า..."
          className="w-full text-sm outline-none bg-transparent text-gray-700 placeholder-gray-400"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* ─── Table ──────────────────────────────────────────────────────── */}
      <div className="bg-white rounded-xl shadow overflow-hidden overflow-x-auto">
        <table className="w-full text-left text-sm min-w-[700px]">
          <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
            <tr>
              <th className="px-6 py-4 font-medium">ProductID</th>
              <th className="px-6 py-4 font-medium">Name</th>
              <th className="px-6 py-4 font-medium">Category</th>
              <th className="px-6 py-4 font-medium text-center">Quantity</th>
              <th className="px-6 py-4 font-medium text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {isLoading ? (
              <tr>
                <td colSpan={5} className="px-6 py-10 text-center text-gray-500">
                  กำลังโหลดข้อมูล...
                </td>
              </tr>
            ) : products.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-10 text-center text-gray-500">
                  <div className="flex flex-col items-center gap-2">
                    <div className="bg-gray-100 p-3 rounded-full">
                      <Search className="text-gray-400" size={24} />
                    </div>
                    ไม่พบสินค้า
                  </div>
                </td>
              </tr>
            ) : (
              groupedProducts.map((group) => (
                <React.Fragment key={group.groupLabel}>
                  <StatusGroupHeader
                    label={group.groupLabel}
                    count={group.items.length}
                    colorClass={group.dotColor}
                  />
                  {group.items.map((p) => {
                    const { label, className } = getStockStatus(p.quantity);
                    return (
                      <tr
                        key={p.id}
                        className="hover:bg-blue-50/40 transition-colors cursor-pointer group"
                        onClick={() => setSelectedProduct(p)}
                        title="คลิกเพื่อดูรายละเอียด"
                      >
                        <td className="px-6 py-4 font-mono text-gray-600 group-hover:text-blue-700 transition-colors">
                          {p.productId}
                        </td>
                        <td className="px-6 py-4 font-medium text-gray-800 flex items-center gap-2 mt-0">
                          {p.imageUrl ? (
                            <img
                              src={p.imageUrl}
                              alt={p.name}
                              className="w-8 h-8 rounded-lg object-cover border border-gray-200 shrink-0"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                              <Package size={14} className="text-gray-400" />
                            </div>
                          )}
                          {p.name}
                        </td>
                        <td className="px-6 py-4 text-gray-600">{p.category}</td>
                        <td className="px-6 py-4 text-center text-gray-800 font-semibold">
                          {p.quantity.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${className}`}>
                            {label}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </React.Fragment>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ─── Product Detail Modal ────────────────────────────────────────── */}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  );
}
