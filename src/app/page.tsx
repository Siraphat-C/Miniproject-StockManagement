export default function Dashboard() {
  return (
    <div>

      <main className="p-8 grid md:grid-cols-4 gap-6">
        
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-lg font-semibold">Total Products</h2>
          <p>รายการสินค้าทั้งหมด</p><br />
          <p className="text-3xl font-bold mt-2">120</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-lg font-semibold">Low Stock</h2>
          <p>สินค้าใกล้หมด</p><br />
          <p className="text-3xl font-bold text-red-600 mt-2">8</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-lg font-semibold">Stock In Today</h2>
          <p>จำนวนรายการเข้าวันนี้</p><br />
          <p className="text-3xl font-bold text-green-600 mt-2">25</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-lg font-semibold">Total Value</h2>
          <p>มูลค่ารวม</p><br />
          <p className="text-3xl font-bold text-green-600 mt-2">25</p>
        </div>

      </main>
    </div>
  );
}