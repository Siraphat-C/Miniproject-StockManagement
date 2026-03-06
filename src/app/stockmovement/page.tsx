"use client";

import React, { useState, useCallback } from "react";
import { Search, History, ArrowUp, Package, Trash2, PlusCircle } from "lucide-react";
import type { ProductListItem, StockMovement } from "@/types";
import { getStockStatus } from "@/lib/utils";
import { Toast } from "@/components/Toast";
import { AddProductModal } from "@/components/modals/AddProductModal";
import { UpdateStockModal } from "@/components/modals/UpdateStockModal";
import { ProductHistoryModal } from "@/components/modals/ProductHistoryModal";
import { useProducts } from "@/hooks/useProducts";
import { useToast } from "@/hooks/useToast";

export default function StockMovementPage() {
  const [search, setSearch] = useState("");
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const { products, isLoading } = useProducts(search, refreshTrigger);
  const { toast, showToast, clearToast } = useToast();

  const [showAddProduct, setShowAddProduct] = useState(false);
  const [showUpdateStock, setShowUpdateStock] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductListItem | null>(null);
  const [productHistory, setProductHistory] = useState<StockMovement[]>([]);

  const handleRefresh = () => setRefreshTrigger((prev) => prev + 1);

  const fetchHistory = useCallback(async (productDbId: string) => {
    try {
      const res = await fetch(
        `/api/stockmovement?productDbId=${encodeURIComponent(productDbId)}`
      );
      const data = await res.json();
      setProductHistory(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch history", err);
    }
  }, []);

  const handleDeleteProduct = async (item: ProductListItem) => {
    const confirmed = window.confirm(
      `ยืนยันการลบสินค้า?\n\nรหัส: ${item.productId}\nชื่อ: ${item.name}\n\nการลบจะไม่สามารถกู้คืนได้`
    );
    if (!confirmed) return;
    try {
      const res = await fetch(`/api/products/${item.id}`, { method: "DELETE" });
      if (res.ok) {
        handleRefresh();
        showToast("ลบสินค้าสำเร็จ", "success");
      } else {
        const data = await res.json();
        showToast(data.error || "เกิดข้อผิดพลาดในการลบสินค้า", "error");
      }
    } catch {
      showToast("เกิดข้อผิดพลาดในการเชื่อมต่อ", "error");
    }
  };

  const totalProducts = products.length;
  const totalItemsInStock = products.reduce((sum, p) => sum + p.quantity, 0);

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in pb-10">
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={clearToast} />
      )}

      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <h2 className="text-lg font-semibold text-white">
          Stock Movement / การจัดการสต็อก
        </h2>
        <button
          onClick={() => setShowAddProduct(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm flex items-center gap-2"
        >
          <PlusCircle size={18} />
          เพิ่มรายการสินค้าใหม่
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow border-l-4 border-blue-500">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-500 font-medium">รายการสินค้าทั้งหมด</p>
            <Package size={20} className="text-blue-500" />
          </div>
          <p className="text-3xl font-bold text-gray-800 mt-2">{totalProducts}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow border-l-4 border-green-500">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-500 font-medium">จำนวนสินค้าในคลังรวม</p>
            <div className="bg-green-100 p-1 rounded-md">
              <ArrowUp size={20} className="text-green-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-800 mt-2">{totalItemsInStock}</p>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow px-4 py-3 flex items-center gap-3">
        <Search size={18} className="text-gray-400 shrink-0" />
        <input
          placeholder="ค้นหาด้วยรหัสสินค้าหรือชื่อสินค้า..."
          className="w-full text-sm outline-none bg-transparent text-gray-700 placeholder-gray-400"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-xl shadow overflow-hidden overflow-x-auto">
        <table className="w-full text-left text-sm min-w-[800px]">
          <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
            <tr>
              <th className="px-6 py-4 font-medium">Code</th>
              <th className="px-6 py-4 font-medium">Product Name</th>
              <th className="px-6 py-4 font-medium">Category</th>
              <th className="px-6 py-4 font-medium text-center">Current Stock</th>
              <th className="px-6 py-4 font-medium text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {isLoading ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                  กำลังโหลดข้อมูล...
                </td>
              </tr>
            ) : products.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                  <div className="flex flex-col items-center gap-2">
                    <div className="bg-gray-100 p-3 rounded-full">
                      <Search className="text-gray-400" size={24} />
                    </div>
                    ไม่มีข้อมูลสินค้า
                  </div>
                </td>
              </tr>
            ) : (
              products.map((item) => {
                const { className: stockClass } = getStockStatus(item.quantity);
                return (
                  <tr
                    key={item.id}
                    className="hover:bg-gray-50 transition-colors group"
                  >
                    <td className="px-6 py-4 font-bold text-gray-800">
                      {item.productId}
                    </td>
                    <td className="px-6 py-4 text-gray-800">{item.name}</td>
                    <td className="px-6 py-4 text-gray-600">{item.category}</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-3 py-1 rounded-full font-bold ${stockClass}`}>
                        {item.quantity}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => {
                            setSelectedProduct(item);
                            fetchHistory(item.id); 
                            setShowHistory(true);
                          }}
                          className="bg-gray-100 text-gray-600 hover:bg-gray-200 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1"
                        >
                          <History size={14} /> ประวัติ
                        </button>
                        <button
                          onClick={() => {
                            setSelectedProduct(item);
                            setShowUpdateStock(true);
                          }}
                          className="bg-blue-50 text-blue-600 hover:bg-blue-100 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors border border-blue-200"
                        >
                          + นำเข้า / - นำออก
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(item)}
                          className="bg-red-50 text-red-500 hover:bg-red-100 px-2 py-1.5 rounded-lg text-xs font-semibold transition-colors border border-red-200"
                          title="ลบสินค้า"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Modals */}
      {showAddProduct && (
        <AddProductModal
          onClose={() => setShowAddProduct(false)}
          onSuccess={handleRefresh}
          onToast={showToast}
        />
      )}
      {showUpdateStock && selectedProduct && (
        <UpdateStockModal
          product={selectedProduct}
          onClose={() => setShowUpdateStock(false)}
          onSuccess={handleRefresh}
          onToast={showToast}
        />
      )}
      {showHistory && selectedProduct && (
        <ProductHistoryModal
          product={selectedProduct}
          history={productHistory}
          onClose={() => setShowHistory(false)}
        />
      )}
    </div>
  );
}
