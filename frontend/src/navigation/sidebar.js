import { createElement } from 'react'

export function Sidebar({ isLoggedIn, onOpenProfile, onOpenSearch, onOpenRequest }) {
  if (!isLoggedIn) return null

  return createElement(
    'nav',
    { 'aria-label': 'เมนูหลัก', className: 'mb-6 flex flex-wrap gap-3' },
    createElement(
      'button',
      {
        className:
          'rounded-lg bg-teal-700 px-5 py-3 font-semibold text-white hover:bg-teal-800 focus:outline-2 focus:outline-offset-2 focus:outline-teal-700',
        onClick: onOpenProfile,
        type: 'button',
      },
      'สร้างโปรไฟล์หาเมท',
    ),
    createElement(
      'button',
      {
        className:
          'rounded-lg border border-teal-700 bg-white px-5 py-3 font-semibold text-teal-700 hover:bg-teal-50 focus:outline-2 focus:outline-offset-2 focus:outline-teal-700',
        onClick: onOpenSearch,
        type: 'button',
      },
      'ค้นหาเมท',
    ),
    createElement(
      'button',
      {
        className:
          'rounded-lg border border-teal-700 bg-white px-5 py-3 font-semibold text-teal-700 hover:bg-teal-50 focus:outline-2 focus:outline-offset-2 focus:outline-teal-700',
        onClick: onOpenRequest,
        type: 'button',
      },
      'ส่งคำขอเป็นเมท',
    ),
  )
}
