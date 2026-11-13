import { useMemo, useState } from 'react'

import { getRoommateRequestStatusLabel, normalizeRoommateRequestStatus } from '../api/client.js'

// รองรับ FR-RRS-11, CON-RRS-07, CON-RRS-09
export default function RoommateRequestListPage({ requests = [], studentId = '', onSelect }) {
  const [selectedRequestId, setSelectedRequestId] = useState(requests[0]?.id ?? '')

  const selectedRequest = useMemo(
    () => requests.find((request) => request.id === selectedRequestId) ?? requests[0] ?? null,
    [requests, selectedRequestId],
  )

  function handleSelect(request) {
    setSelectedRequestId(request.id)
    if (onSelect) {
      onSelect(request)
    }
  }

  if (!requests || requests.length === 0) {
    return (
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-2 text-xl font-bold text-slate-900">รายการคำขอเป็นเมท</h2>
        <p className="text-sm text-slate-600">ยังไม่มีคำขอเป็นเมทในระบบ</p>
      </section>
    )
  }

  return (
    <section className="grid gap-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:grid-cols-[1.15fr_1.4fr]">
      <div>
        <h2 className="mb-4 text-xl font-bold text-slate-900">รายการคำขอเป็นเมท</h2>
        <ul className="space-y-3" aria-label="รายการคำขอเป็นเมท">
          {requests.map((request) => {
            const normalizedStatus = normalizeRoommateRequestStatus(request.status)
            const statusLabel = getRoommateRequestStatusLabel(request.status)
            const relatedStudent = request.sender_id === studentId ? request.receiver_id : request.sender_id
            const isSelected = request.id === selectedRequest?.id

            return (
              <li key={request.id}>
                <button
                  aria-label={`เปิดคำขอจาก ${relatedStudent} สถานะ ${statusLabel}`}
                  className={`flex w-full flex-col rounded-xl border p-3 text-left transition ${
                    isSelected ? 'border-teal-600 bg-teal-50' : 'border-slate-200 bg-slate-50 hover:border-slate-300'
                  }`}
                  onClick={() => handleSelect(request)}
                  type="button"
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-semibold text-slate-900">{relatedStudent || 'ผู้เกี่ยวข้อง'}</p>
                    <span
                      className={`rounded-full px-2 py-1 text-[10px] font-semibold uppercase tracking-wide ${
                        normalizedStatus === 'pending'
                          ? 'bg-amber-100 text-amber-700'
                          : normalizedStatus === 'accepted'
                            ? 'bg-emerald-100 text-emerald-700'
                            : normalizedStatus === 'rejected'
                              ? 'bg-red-100 text-red-700'
                              : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {statusLabel}
                    </span>
                  </div>

                  <p className="mt-2 text-sm text-slate-600">
                    {request.message || 'ไม่มีข้อความประกอบ'}
                  </p>
                </button>
              </li>
            )
          })}
        </ul>
      </div>

      <aside className="rounded-2xl border border-slate-200 bg-slate-50 p-5" aria-live="polite">
        {selectedRequest ? (
          <>
            <h3 className="text-lg font-bold text-slate-900">รายละเอียดคำขอ</h3>
            <dl className="mt-4 space-y-3 text-sm text-slate-700">
              <div className="flex justify-between gap-3">
                <dt>ผู้ส่ง</dt>
                <dd className="font-medium text-slate-900">{selectedRequest.sender_id}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt>ผู้รับ</dt>
                <dd className="font-medium text-slate-900">{selectedRequest.receiver_id}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt>สถานะ</dt>
                <dd className="font-medium text-slate-900">
                  {getRoommateRequestStatusLabel(selectedRequest.status)}
                </dd>
              </div>
            </dl>
            <p className="mt-4 rounded-xl bg-white p-3 text-sm leading-6 text-slate-700">
              {selectedRequest.message || 'ไม่มีข้อความประกอบ'}
            </p>
          </>
        ) : (
          <p className="text-sm text-slate-600">ยังไม่มีคำขอที่เลือก</p>
        )}
      </aside>
    </section>
  )
}
