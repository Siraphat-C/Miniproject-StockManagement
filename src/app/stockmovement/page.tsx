import React from 'react';
import { Search, ArrowUpCircle, ArrowDownCircle, History, Package } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

export default function StockMovementPage() {
  // ข้อมูลสมมติ (Mock Data)
  const movements = [
    { id: 1, date: '2026-02-10 14:30', code: 'INV001', name: 'Apple', type: 'IN', qty: 50, unit: 'kg.', note: 'นำเข้าสินค้าลอตใหม่' },
    { id: 2, date: '2026-02-09 10:15', code: 'INV002', name: 'Banana', type: 'OUT', qty: 20, unit: 'kg.', note: 'เบิกจ่ายหน้าร้าน' },
    { id: 3, date: '2026-02-08 16:45', code: 'INV001', name: 'Apple', type: 'OUT', qty: 5, unit: 'kg.', note: 'สินค้าชำรุด' },
  ];

  return (
    <div className="min-h-screen bg-gray-50/50 pb-10">
      {/* ส่วนหัวเหมือน Dashboard */}
      <div className="bg-[#A4C2F4] p-10 text-center shadow-sm mb-8">
        <div className="flex flex-col items-center gap-3">
          <div className="bg-white p-3 rounded-xl shadow-sm">
            <Package size={40} className="text-blue-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">ระบบจัดการสต็อกสินค้าขนาดเล็ก</h1>
            <p className="text-gray-600 font-medium">Small Inventory Management System</p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-center gap-2 mb-6">
          <History className="text-gray-400" size={24} />
          <h2 className="text-xl font-bold text-gray-700">Stock Movement / ความเคลื่อนไหวสต็อก</h2>
        </div>

        {/* รายการสรุปด้านบนโดยใช้ Card UI ของคุณ */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="border-none shadow-md">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">รายการทั้งหมด</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-between items-end">
              <span className="text-4xl font-bold">45</span>
              <History className="text-blue-400 mb-1" size={28} />
            </CardContent>
          </Card>

          <Card className="border-none shadow-md">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-green-600">รับเข้า (เดือนนี้)</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-between items-end">
              <span className="text-4xl font-bold text-green-600">+120</span>
              <ArrowUpCircle className="text-green-400 mb-1" size={28} />
            </CardContent>
          </Card>

          <Card className="border-none shadow-md">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-red-600">จ่ายออก (เดือนนี้)</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-between items-end">
              <span className="text-4xl font-bold text-red-600">-85</span>
              <ArrowDownCircle className="text-red-400 mb-1" size={28} />
            </CardContent>
          </Card>
        </div>

        {/* ส่วนค้นหาโดยใช้ Input UI ของคุณ */}
        <div className="relative mb-8 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={20} />
          <Input 
            placeholder="ค้นหาตามรหัสสินค้า, ชื่อสินค้า หรือหมายเหตุ..." 
            className="pl-12 h-14 bg-white border-none shadow-sm rounded-2xl text-md focus-visible:ring-2 focus-visible:ring-blue-400"
          />
        </div>

        {/* ตารางแสดงข้อมูล */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50/80 text-gray-600 text-xs uppercase tracking-wider">
                  <th className="px-6 py-5 font-bold">Date-Time</th>
                  <th className="px-6 py-5 font-bold">Code</th>
                  <th className="px-6 py-5 font-bold">Product Name</th>
                  <th className="px-6 py-5 font-bold text-center">Type</th>
                  <th className="px-6 py-5 font-bold text-right">Qty</th>
                  <th className="px-6 py-5 font-bold">Note</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {movements.map((item) => (
                  <tr key={item.id} className="hover:bg-blue-50/30 transition-colors group text-sm">
                    <td className="px-6 py-4 text-gray-500 font-medium">{item.date}</td>
                    <td className="px-6 py-4 font-bold text-blue-600">{item.code}</td>
                    <td className="px-6 py-4 font-semibold text-gray-800">{item.name}</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-3 py-1.5 rounded-lg text-[10px] font-black tracking-tight ${
                        item.type === 'IN' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {item.type === 'IN' ? 'RECEIVE' : 'ISSUE'}
                      </span>
                    </td>
                    <td className={`px-6 py-4 text-right font-black ${
                        item.type === 'IN' ? 'text-green-600' : 'text-red-600'
                      }`}>
                      {item.type === 'IN' ? '+' : '-'}{item.qty}
                    </td>
                    <td className="px-6 py-4 text-gray-400 italic text-xs">{item.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}