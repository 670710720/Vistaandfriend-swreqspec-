import { createElement } from 'react'
import ProfileCard from '../components/ProfileCard.js'

// รองรับ FR-SRS-06 และ CON-SRS-06: แสดงหน้ารายละเอียดโปรไฟล์พร้อมข้อมูลที่อนุญาตและซ่อนเบอร์โทรศัพท์
export default function ProfileDetailPage({ profile, onBack }) {
  if (!profile) {
    return createElement(
      'main',
      { className: 'mx-auto max-w-3xl px-4 py-10 text-slate-800' },
      createElement(
        'div',
        { className: 'rounded-2xl border border-slate-200 bg-white p-6 shadow-sm' },
        createElement('h1', { className: 'text-2xl font-bold text-slate-900' }, 'ไม่พบข้อมูลโปรไฟล์'),
        createElement('p', { className: 'mt-2 text-sm text-slate-600' }, 'โปรไฟล์ที่เลือกไม่มีข้อมูลที่สามารถแสดงได้'),
      ),
    )
  }

  return createElement(
    'main',
    { className: 'mx-auto max-w-4xl px-4 py-10 text-slate-800' },
    createElement(
      'header',
      { className: 'mb-6 flex items-center justify-between gap-3' },
      createElement(
        'div',
        null,
        createElement('p', { className: 'text-sm font-semibold uppercase tracking-wide text-teal-700' }, 'Vista & Friend'),
        createElement('h1', { className: 'mt-2 text-3xl font-bold text-slate-900' }, 'รายละเอียดโปรไฟล์'),
      ),
      onBack &&
        createElement(
          'button',
          {
            type: 'button',
            className: 'rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50',
            onClick: onBack,
          },
          'กลับไปยังผลการค้นหา',
        ),
    ),
    createElement(ProfileCard, { profile }),
  )
}
