"use client";

const products = [
  { id: 1, name: "Apple", category: "Fruit", qty: 150, price: 120 },
  { id: 2, name: "Banana", category: "Fruit", qty: 200, price: 45 },
  { id: 3, name: "Keyboard", category: "Electronics", qty: 10, price: 1500 },
  { id: 4, name: "Coconut", category: "Fruit", qty: 0, price: 25},
]

import { useState } from "react";

export default function Inventory() {
  const [open, setOpen] = useState(false);
  
  const handleEdit = (name: string) => {
    alert("Edit " + name)
  }

  const handleDelete = (name: string) => {
    alert("Delete " + name)
  }
  
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <h2 className="text-lg font-semibold">Inventory / คลังสินค้า</h2>
      <button onClick={() => setOpen(true)} className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800">+ เพิ่มสินค้า</button>

      {open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[400px]">
            <h3 className="font-bold text-lg mb-4">เพิ่มสินค้าใหม่</h3>
            <div className="space-y-3">
              <input className="border p-2 w-full rounded" placeholder="ชื่อสินค้า" />
              <input className="border p-2 w-full rounded" placeholder="รหัสสินค้า" />
              <input className="border p-2 w-full rounded" type="number" placeholder="จำนวนสินค้า" />
              <input className="border p-2 w-full rounded" type="number" placeholder="ราคา (บาท)" />
              <input className="border p-2 w-full rounded" placeholder="หมวดหมู่" />
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setOpen(false)} className="px-3 py-1 border rounded">ยกเลิก</button>
              <button className="px-3 py-1 bg-black text-white rounded">เพิ่มสินค้า</button>
            </div>
          </div>
        </div>
      )}
      
      <div className="bg-white shadow rounded p-4">
        <table className="w-full text-sm">
          <thead className="border-b">
            <tr className="text-left">
              <th>ProductID</th>
              <th>Name</th>
              <th>Category</th>
              <th>Quantity</th>
              <th>Unit Price</th>
              <th>Total</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
          {products.map((p) => {
            let status = "In Stock"
            let color = "bg-green-200 text-green-800"

            if (p.qty <= 15 && p.qty > 0) {
              status = "Low Stock"
              color = "bg-yellow-200 text-yellow-800"
            }
            if (p.qty === 0) {
              status = "Out of Stock"
              color = "bg-red-200 text-red-800"
            }

            return (
              <tr key={p.id} className="text-sm">
                <td className="border p-2">STM00{p.id}</td>
                <td className="border p-2">{p.name}</td>
                <td className="border p-2">{p.category}</td>
                <td className="border p-2">{p.qty}</td>
                <td className="border p-2">{p.price}</td>
                <td className="border p-2">{p.qty * p.price}</td>

                <td className="border p-2"><span className={`px-2 py-1 rounded text-xs font-semibold ${color}`}>{status}</span></td>

                <td className="border p-2 space-x-2">
                  <button onClick={() => handleEdit(p.name)}className="bg-blue-500 text-white px-2 py-1 rounded text-xs">Edit</button>
                  <button onClick={() => handleDelete(p.name)}className="bg-red-500 text-white px-2 py-1 rounded text-xs">Delete</button>
                </td>
              </tr>
            )
          })}
        </tbody>
        </table>
      </div>

    </div>
  );
}