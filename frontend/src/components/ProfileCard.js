import { createElement } from 'react'

// รองรับ FR-SRS-06 และ CON-SRS-06: แสดงข้อมูลโปรไฟล์ที่อนุญาตเท่านั้นและซ่อนเบอร์โทรศัพท์
export default function ProfileCard({ profile }) {
  if (!profile) {
    return null
  }

  const socialEntries = Object.entries(profile.social_links || {})

  return createElement(
    'article',
    { className: 'rounded-2xl border border-slate-200 bg-white p-6 shadow-sm' },
    createElement(
      'div',
      { className: 'flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between' },
      createElement('div', null,
        createElement('p', { className: 'text-sm font-semibold uppercase tracking-wide text-teal-700' }, 'โปรไฟล์ที่สนใจ'),
        createElement('h2', { className: 'mt-2 text-3xl font-bold text-slate-900' }, profile.name),
      ),
      createElement(
        'span',
        { className: 'inline-flex rounded-full bg-teal-50 px-3 py-1 text-sm font-semibold text-teal-800' },
        profile.is_open_for_search ? 'เปิดให้ค้นหา' : 'ปิดให้ค้นหา',
      ),
    ),
    createElement(
      'dl',
      { className: 'mt-6 grid gap-4 sm:grid-cols-2' },
      createElement('div', { className: 'rounded-xl bg-slate-50 p-4' },
        createElement('dt', { className: 'text-sm text-slate-500' }, 'อายุ'),
        createElement('dd', { className: 'mt-1 text-lg font-semibold text-slate-900' }, `${profile.age} ปี`),
      ),
      createElement('div', { className: 'rounded-xl bg-slate-50 p-4' },
        createElement('dt', { className: 'text-sm text-slate-500' }, 'เพศ'),
        createElement('dd', { className: 'mt-1 text-lg font-semibold text-slate-900' }, profile.gender),
      ),
      createElement('div', { className: 'rounded-xl bg-slate-50 p-4' },
        createElement('dt', { className: 'text-sm text-slate-500' }, 'คณะ'),
        createElement('dd', { className: 'mt-1 text-lg font-semibold text-slate-900' }, profile.faculty),
      ),
      createElement('div', { className: 'rounded-xl bg-slate-50 p-4' },
        createElement('dt', { className: 'text-sm text-slate-500' }, 'ชั้นปี'),
        createElement('dd', { className: 'mt-1 text-lg font-semibold text-slate-900' }, profile.academic_year),
      ),
      createElement('div', { className: 'rounded-xl bg-slate-50 p-4' },
        createElement('dt', { className: 'text-sm text-slate-500' }, 'ประเภทห้อง'),
        createElement('dd', { className: 'mt-1 text-lg font-semibold text-slate-900' }, profile.room_type),
      ),
      createElement('div', { className: 'rounded-xl bg-slate-50 p-4' },
        createElement('dt', { className: 'text-sm text-slate-500' }, 'จำนวนคนในห้อง'),
        createElement('dd', { className: 'mt-1 text-lg font-semibold text-slate-900' }, `${profile.room_size} คน`),
      ),
    ),
    createElement(
      'div',
      { className: 'mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4' },
      createElement('h3', { className: 'text-base font-semibold text-slate-900' }, 'ข้อมูลที่อนุญาตให้เปิดเผย'),
      socialEntries.length > 0
        ? createElement(
            'ul',
            { className: 'mt-3 space-y-2' },
            socialEntries.map(([channel, value]) =>
              createElement(
                'li',
                { key: channel, className: 'text-sm text-slate-700' },
                `${channel}: ${value}`,
              ),
            ),
          )
        : createElement('p', { className: 'mt-3 text-sm text-slate-600' }, 'ไม่มีข้อมูลโซเชียลที่เปิดเผย'),
    ),
    createElement(
      'div',
      { className: 'mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4' },
      createElement('p', { className: 'text-sm text-amber-900' }, 'ข้อมูลที่ไม่เปิดเผย: เบอร์โทรศัพท์'),
    ),
  )
}
