// รองรับ FR-ERP-07, FR-ERP-08, NFR-ERP-04, AC-ERP-04, AC-ERP-07, AC-ERP-07A
export default function SuccessToast({ title = 'แก้ไขโปรไฟล์สำเร็จ', message = 'ข้อมูลโปรไฟล์ของคุณถูกบันทึกและพร้อมแสดงผลตามสถานะเปิดให้ค้นหา' }) {
  return (
    <div
      aria-live="polite"
      className="mb-6 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900 shadow-sm"
      role="status"
    >
      <p className="font-semibold">{title}</p>
      <p className="mt-1">{message}</p>
    </div>
  )
}
