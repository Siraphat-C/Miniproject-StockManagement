import React from 'react';
import { Search, History, Package, ArrowUp, ArrowDown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function StockMovementPage() {
  const movements = [
    { id: 1, date: '2026-02-10 14:30', code: 'INV001', name: 'Apple', type: 'IN', qty: 50, unit: 'kg.', note: 'Stock Inbound' },
    { id: 2, date: '2026-02-09 10:15', code: 'INV002', name: 'Banana', type: 'OUT', qty: 20, unit: 'kg.', note: 'Customer Sale' },
  ];

  return (
    <div className="min-h-screen bg-white pb-10 text-black">
      {/* Header - No Color Version */}
      <div className="border-b border-black/10 p-10 text-center mb-8">
        <div className="flex flex-col items-center gap-3">
          <div className="border-2 border-black p-3 rounded-xl">
            <Package size={40} />
          </div>
          <div>
            <h1 className="text-2xl font-bold uppercase tracking-tight">Stock Management System</h1>
            <p className="text-sm text-gray-500">Inventory Movement Tracking</p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-center gap-2 mb-8 border-l-4 border-black pl-4">
          <h2 className="text-xl font-bold uppercase">Stock Movement Log</h2>
        </div>

        {/* Summary Cards - Minimalist Style */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[
            { label: 'Total Trans.', value: '45', icon: <History /> },
            { label: 'Total In', value: '+120', icon: <ArrowUp /> },
            { label: 'Total Out', value: '-85', icon: <ArrowDown /> }
          ].map((card, i) => (
            <Card key={i} className="border-2 border-black rounded-none shadow-none">
              <CardHeader className="pb-2 border-b border-gray-100">
                <CardTitle className="text-xs font-bold uppercase tracking-widest">{card.label}</CardTitle>
              </CardHeader>
              <CardContent className="flex justify-between items-center pt-4">
                <span className="text-3xl font-bold">{card.value}</span>
                {card.icon}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Search Bar - Outline Style */}
        <div className="relative mb-10">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-black" size={20} />
          <Input 
            placeholder="Search by code or product name..." 
            className="pl-12 h-12 border-2 border-black rounded-none focus-visible:ring-0 focus-visible:border-gray-400 bg-transparent"
          />
        </div>

        {/* Minimalist Table */}
        <div className="border-2 border-black overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b-2 border-black bg-gray-50">
                <th className="px-6 py-4 text-xs font-bold uppercase">Date-Time</th>
                <th className="px-6 py-4 text-xs font-bold uppercase">Code</th>
                <th className="px-6 py-4 text-xs font-bold uppercase">Product Name</th>
                <th className="px-6 py-4 text-xs font-bold uppercase text-center">Type</th>
                <th className="px-6 py-4 text-xs font-bold uppercase text-right">Qty</th>
                <th className="px-6 py-4 text-xs font-bold uppercase">Note</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {movements.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm font-mono">{item.date}</td>
                  <td className="px-6 py-4 text-sm font-bold">{item.code}</td>
                  <td className="px-6 py-4 text-sm uppercase">{item.name}</td>
                  <td className="px-6 py-4 text-center">
                    <span className="border border-black px-2 py-1 text-[10px] font-bold">
                      {item.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right font-bold font-mono">
                    {item.qty}
                  </td>
                  <td className="px-6 py-4 text-xs text-gray-500">{item.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}