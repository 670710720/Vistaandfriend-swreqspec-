import { createElement } from 'react'

function field(label, inputNode) {
  return createElement(
    'label',
    { className: 'block text-sm font-medium text-slate-800' },
    label,
    createElement('div', { className: 'mt-2' }, inputNode),
  )
}

// รองรับ FR-SRS-03 และ CON-SRS-03: ผู้ใช้กำหนดและบันทึกเงื่อนไขค้นหาก่อนกดค้นหา
export default function SearchFiltersForm({
  filters,
  mode,
  loading,
  error,
  onChangeFilter,
  onModeChange,
  onSubmit,
}) {
  return createElement(
    'form',
    { className: 'space-y-5 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200', onSubmit },
    createElement(
      'div',
      { className: 'grid gap-4 md:grid-cols-2 xl:grid-cols-3' },
      field(
        'อายุ',
        createElement('input', {
          className: 'block w-full rounded-lg border border-slate-300 px-3 py-2.5',
          value: filters.age,
          onChange: (event) => onChangeFilter('age', event.target.value),
        }),
      ),
      field(
        'เพศ',
        createElement(
          'select',
          {
            className: 'block w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5',
            value: filters.gender,
            onChange: (event) => onChangeFilter('gender', event.target.value),
          },
          createElement('option', { value: '' }, 'เลือกเพศ'),
          createElement('option', { value: 'หญิง' }, 'หญิง'),
          createElement('option', { value: 'ชาย' }, 'ชาย'),
        ),
      ),
      field(
        'คณะ',
        createElement('input', {
          className: 'block w-full rounded-lg border border-slate-300 px-3 py-2.5',
          value: filters.faculty,
          onChange: (event) => onChangeFilter('faculty', event.target.value),
        }),
      ),
      field(
        'ชั้นปี',
        createElement('input', {
          className: 'block w-full rounded-lg border border-slate-300 px-3 py-2.5',
          value: filters.academicYear,
          onChange: (event) => onChangeFilter('academicYear', event.target.value),
        }),
      ),
      field(
        'ประเภทห้อง',
        createElement(
          'select',
          {
            className: 'block w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5',
            value: filters.roomType,
            onChange: (event) => onChangeFilter('roomType', event.target.value),
          },
          createElement('option', { value: '' }, 'เลือกประเภทห้อง'),
          createElement('option', { value: 'ห้องแยก' }, 'ห้องแยก'),
          createElement('option', { value: 'ห้องรวม' }, 'ห้องรวม'),
        ),
      ),
      field(
        'จำนวนคนในห้อง',
        createElement('input', {
          className: 'block w-full rounded-lg border border-slate-300 px-3 py-2.5',
          value: filters.roomSize,
          onChange: (event) => onChangeFilter('roomSize', event.target.value),
        }),
      ),
      field(
        'พฤติกรรมการนอน',
        createElement('input', {
          className: 'block w-full rounded-lg border border-slate-300 px-3 py-2.5',
          value: filters.sleepBehavior,
          onChange: (event) => onChangeFilter('sleepBehavior', event.target.value),
        }),
      ),
      field(
        'ความสะอาด',
        createElement('input', {
          className: 'block w-full rounded-lg border border-slate-300 px-3 py-2.5',
          value: filters.cleanliness,
          onChange: (event) => onChangeFilter('cleanliness', event.target.value),
        }),
      ),
      field(
        'เวลาเข้านอน',
        createElement('input', {
          className: 'block w-full rounded-lg border border-slate-300 px-3 py-2.5',
          value: filters.sleepTime,
          onChange: (event) => onChangeFilter('sleepTime', event.target.value),
        }),
      ),
    ),
    createElement(
      'div',
      { className: 'flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between' },
      createElement(
        'div',
        { className: 'flex flex-col gap-2 text-sm font-medium text-slate-800 sm:flex-row sm:items-center' },
        createElement(
          'label',
          { className: 'flex items-center gap-2' },
          'โหมดค้นหา',
          createElement(
            'select',
            {
              className: 'rounded-lg border border-slate-300 bg-white px-3 py-2.5',
              value: mode,
              onChange: (event) => onModeChange(event.target.value),
            },
            createElement('option', { value: 'AND' }, 'AND'),
            createElement('option', { value: 'OR' }, 'OR'),
          ),
        ),
        createElement(
          'span',
          { className: 'text-xs text-slate-500' },
          mode === 'AND' ? 'AND = ต้องตรงทุกตัวกรอง' : 'OR = ตรงอย่างน้อยหนึ่งตัวกรอง',
        ),
      ),
      createElement(
        'button',
        {
          className: 'rounded-lg bg-teal-700 px-5 py-3 font-semibold text-white hover:bg-teal-800',
          type: 'submit',
          disabled: loading,
        },
        loading ? 'กำลังค้นหาเมท...' : 'ค้นหาเมท',
      ),
    ),
    loading && createElement('p', { 'aria-live': 'polite' }, 'กำลังค้นหาเมท...'),
    error && createElement('p', { role: 'alert' }, error),
  )
}
