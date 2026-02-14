export default function ReportsPage() {
  return (
    // โครงหลักของหน้า กำหนดความกว้าง, ระยะขอบ และพื้นหลัง
    <main className="max-w-5xl mx-auto p-8 bg-gray-50 min-h-screen">

      {/* หัวข้อหน้ารายงาน */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800">
          Reports / รายงาน
        </h2>
      </div>

      {/* ส่วนตัวกรองข้อมูล (Filter) */}
      {/* ใช้เลือกช่วงวันที่ และประเภทรายงาน */}
      <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">

          {/* วันที่เริ่มต้น */}
          <div>
            <label className="block text-sm text-gray-500 mb-2">
              เริ่มวันที่
            </label>
            <input
              type="date"
              className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2 text-sm
                         focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* วันที่สิ้นสุด */}
          <div>
            <label className="block text-sm text-gray-500 mb-2">
              ถึงวันที่
            </label>
            <input
              type="date"
              className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2 text-sm
                         focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* เลือกประเภทรายงาน */}
          <div>
            <label className="block text-sm text-gray-500 mb-2">
              ประเภทรายงาน
            </label>
            <select
              className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2 text-sm
                         focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option>สรุปการเคลื่อนไหวทั้งหมด</option>
              <option>รายงานสินค้าเข้า</option>
              <option>รายงานสินค้าออก</option>
            </select>
          </div>

          {/* ปุ่มประมวลผลรายงาน */}
          <button
            className="bg-slate-800 text-white px-6 py-2 rounded-lg text-sm
                       hover:bg-slate-700 transition shadow-sm"
          >
            ประมวลผลรายงาน
          </button>
        </div>
      </section>

      {/* สรุปข้อมูลภาพรวม (Summary) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

        {/* สรุปยอดรับเข้า */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500 mb-1">
            ยอดรวมรับเข้า (In)
          </p>
          <p className="text-2xl font-bold text-green-600">
            540 <span className="text-sm font-normal text-gray-400">หน่วย</span>
          </p>
        </div>

        {/* สรุปยอดเบิกออก */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500 mb-1">
            ยอดรวมเบิกออก (Out)
          </p>
          <p className="text-2xl font-bold text-orange-500">
            210 <span className="text-sm font-normal text-gray-400">หน่วย</span>
          </p>
        </div>

        {/* สรุปมูลค่าการเคลื่อนไหว */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500 mb-1">
            มูลค่ารวมที่เคลื่อนไหว
          </p>
          <p className="text-2xl font-bold text-blue-600">
            27,000 <span className="text-sm font-normal text-gray-400">บาท</span>
          </p>
        </div>
      </div>

      {/* ตารางแสดงรายละเอียดรายงาน */}
      <section className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

        {/* หัวตาราง + ปุ่ม Export */}
        <div className="p-6 border-b border-gray-50 flex justify-between items-center">
          <h3 className="font-medium text-gray-700">
            รายละเอียดรายการ
          </h3>
          <button className="text-sm text-blue-600 hover:underline">
            📥 Export
          </button>
        </div>

        {/* ตารางข้อมูล */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-500 uppercase">
              <tr>
                <th className="px-6 py-4 font-medium">วันที่</th>
                <th className="px-6 py-4 font-medium">รหัสสินค้า</th>
                <th className="px-6 py-4 font-medium">ชื่อสินค้า</th>
                <th className="px-6 py-4 font-medium">ประเภท</th>
                <th className="px-6 py-4 font-medium">จำนวน</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {/* ตัวอย่างข้อมูล 1 แถว */}
              <tr className="hover:bg-gray-50 transition">
                <td className="px-6 py-4">11/02/2026</td>
                <td className="px-6 py-4 font-mono">INV001</td>
                <td className="px-6 py-4">Apple</td>
                <td className="px-6 py-4 text-green-600 font-medium">
                  รับเข้า
                </td>
                <td className="px-6 py-4">+50</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
