import { useMemo, useState } from 'react'

import RoommateRequestDetail from '../components/RoommateRequestDetail.jsx'

// รองรับ FR-RRS-06, FR-RRS-12, FR-RRS-13
export default function NotificationsPage({ notifications = [], onSelect }) {
  const [selectedNotificationId, setSelectedNotificationId] = useState(
    notifications[0]?.id ?? '',
  )

  const selectedNotification = useMemo(
    () => notifications.find((notification) => notification.id === selectedNotificationId) ?? notifications[0] ?? null,
    [notifications, selectedNotificationId],
  )

  function handleSelect(notification) {
    setSelectedNotificationId(notification.id)
    if (onSelect) {
      onSelect(notification)
    }
  }

  if (!notifications || notifications.length === 0) {
    return (
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-2 text-xl font-bold text-slate-900">แจ้งเตือนคำขอเป็นเมท</h2>
        <p className="text-sm text-slate-600">ยังไม่มีคำขอใหม่</p>
      </section>
    )
  }

  return (
    <section className="grid gap-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:grid-cols-[1.1fr_1.4fr]">
      <div>
        <h2 className="mb-4 text-xl font-bold text-slate-900">แจ้งเตือนคำขอเป็นเมท</h2>
        <ul className="space-y-3" aria-label="รายการแจ้งเตือนคำขอเป็นเมท">
          {notifications.map((notification) => {
            const senderLabel = notification.sender_name || notification.sender_id || 'ผู้ส่ง'
            const formattedTime = notification.created_at
              ? new Date(notification.created_at).toLocaleString('th-TH', {
                  dateStyle: 'medium',
                  timeStyle: 'short',
                })
              : 'ไม่ระบุเวลา'

            const isSelected = notification.id === selectedNotification?.id

            return (
              <li key={notification.id}>
                <button
                  aria-label={`เปิดแจ้งเตือนจาก ${senderLabel}`}
                  className={`flex w-full items-center gap-3 rounded-xl border p-3 text-left transition ${
                    isSelected
                      ? 'border-teal-600 bg-teal-50'
                      : 'border-slate-200 bg-slate-50 hover:border-slate-300'
                  }`}
                  onClick={() => handleSelect(notification)}
                  type="button"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-teal-100 text-sm font-bold text-teal-800">
                    {(senderLabel || 'P').slice(0, 2).toUpperCase()}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-3">
                      <p className="truncate font-semibold text-slate-900">{senderLabel}</p>
                      <span className="text-xs text-slate-500">{formattedTime}</span>
                    </div>
                    <p className="mt-1 line-clamp-2 text-sm text-slate-600">
                      {notification.message || 'มีคำขอเป็นเมทใหม่'}
                    </p>
                  </div>

                  {notification.notification_status === 'failed' && (
                    <span className="rounded-full bg-red-100 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-red-700">
                      ล้มเหลว
                    </span>
                  )}
                </button>
              </li>
            )
          })}
        </ul>
      </div>

      <RoommateRequestDetail notification={selectedNotification} />
    </section>
  )
}
