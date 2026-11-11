import { createElement } from 'react'

// รองรับ FR-SRS-05, FR-SRS-07 และ FR-SRS-09: แสดงผลลัพธ์เป็นบัตรข้อมูล พร้อมข้อความแจ้งเมื่อไม่มีผลลัพธ์ตรงตามเงื่อนไข
export default function SearchResultsList({
  results,
  page = 1,
  hasNextPage = false,
  onPreviousPage,
  onNextPage,
}) {
  if (!results || results.length === 0) {
    return createElement(
      'div',
      { className: 'rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700', role: 'status' },
      'ไม่พบผลการค้นหา',
    )
  }

  return createElement(
    'div',
    { className: 'space-y-3' },
    createElement(
      'p',
      { className: 'text-sm font-medium text-slate-600' },
      'ผลลัพธ์เรียงตามจำนวนตัวกรองที่ตรงกันจากมากไปน้อย',
    ),
    createElement(
      'ul',
      { className: 'space-y-3' },
      results.map((result, index) =>
        createElement(
          'li',
          {
            key: result.user_id,
            className: 'rounded-xl border border-slate-200 bg-white p-4 shadow-sm',
          },
          createElement(
            'div',
            { className: 'flex items-center justify-between gap-3' },
            createElement('strong', null, result.name),
            createElement('span', { className: 'text-sm text-slate-500' }, result.faculty),
          ),
          createElement(
            'p',
            { className: 'mt-2 text-sm text-slate-600' },
            `อายุ ${result.age} • ${result.gender} • ${result.academic_year}`,
          ),
          createElement(
            'p',
            { className: 'mt-1 text-sm text-slate-500' },
            `${result.room_type} • ${result.room_size} คน`,
          ),
          createElement(
            'p',
            { className: 'mt-2 text-xs font-semibold uppercase tracking-[0.12em] text-teal-700' },
            result.match_count !== undefined ? `ตรงกับ ${result.match_count} ตัวกรอง` : `ลำดับที่ ${index + 1}`,
          ),
        ),
      ),
    ),
    createElement(
      'div',
      { className: 'mt-4 flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3' },
      createElement(
        'button',
        {
          type: 'button',
          className: 'rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 disabled:cursor-not-allowed disabled:opacity-50',
          disabled: page <= 1,
          onClick: onPreviousPage,
        },
        'ก่อนหน้า',
      ),
      createElement('span', { className: 'text-sm font-medium text-slate-700' }, `หน้า ${page}`),
      createElement(
        'button',
        {
          type: 'button',
          className: 'rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 disabled:cursor-not-allowed disabled:opacity-50',
          disabled: !hasNextPage,
          onClick: onNextPage,
        },
        'ถัดไป',
      ),
    ),
  )
}
