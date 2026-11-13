// รองรับ FR-RRS-06, FR-RRS-12, FR-RRS-13
export default function RoommateRequestDetail({ notification }) {
  if (!notification) {
    return (
      <aside className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm text-slate-600" aria-live="polite">
        เลือกการแจ้งเตือนเพื่อดูรายละเอียดคำขอ
      </aside>
    )
  }

  const senderLabel = notification.sender_name || notification.sender_id || 'ผู้ส่ง'
  const initials = (senderLabel || 'ผู้ส่ง')
    .split(/\s|_/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('') || 'P'

  const formattedTime = notification.created_at
    ? new Date(notification.created_at).toLocaleString('th-TH', {
        dateStyle: 'medium',
        timeStyle: 'short',
      })
    : 'ไม่ระบุเวลา'

  const notificationStatusText = notification.notification_status === 'failed'
    ? 'แจ้งเตือนล้มเหลว'
    : 'แจ้งเตือนสำเร็จ'

  return (
    <aside className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm" aria-live="polite">
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-teal-100 text-sm font-bold text-teal-800">
          {initials}
        </div>
        <div>
          <p className="font-semibold text-slate-900">{senderLabel}</p>
          <p className="text-sm text-slate-500">{formattedTime}</p>
        </div>
      </div>

      <h3 className="mb-3 text-lg font-bold text-slate-900">รายละเอียดคำขอ</h3>

      <div className="mb-4 rounded-xl border border-slate-200 bg-slate-50 p-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">สถานะ</p>
        <p className="mt-1 font-semibold text-slate-900">{notificationStatusText}</p>
      </div>

      {notification.notification_error && (
        <p className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700" role="alert">
          {notification.notification_error}
        </p>
      )}

      <p className="text-sm leading-6 text-slate-700">
        {notification.message || 'ไม่มีข้อความประกอบ'}
      </p>

      <dl className="mt-5 space-y-2 text-sm text-slate-700">
        <div className="flex justify-between gap-3">
          <dt>สถานะคำขอ</dt>
          <dd className="font-medium text-slate-900">{notification.status || 'pending'}</dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt>สถานะการแจ้งเตือน</dt>
          <dd className="font-medium text-slate-900">{notification.notification_status || 'pending'}</dd>
        </div>
      </dl>
    </aside>
  )
}
