import { useMemo, useState } from 'react'
import { PROFILE_CONFIG } from '../config.js'

// รองรับ CON-ERP-06, CON-ERP-07, FR-ERP-03, FR-ERP-04, FR-ERP-09, NFR-ERP-01, AC-ERP-02, AC-ERP-02A, AC-ERP-02B
export default function ProfileForm({ profile, onSubmit }) {
  const initialValues = useMemo(
    () => ({
      age: profile?.age ?? '',
      faculty: profile?.faculty ?? '',
      academicYear: profile?.academicYear ?? profile?.academic_year ?? '',
      phone: profile?.phone ?? '',
      roomType: profile?.roomType ?? profile?.room_type ?? '',
      occupants: profile?.occupants ?? profile?.room_occupants ?? '',
      sleepBehaviors: profile?.sleepBehaviors ?? profile?.sleep_behaviors ?? [],
      otherSleepBehavior: profile?.otherSleepBehavior ?? profile?.other_sleep_behavior ?? '',
      isSearchable: profile?.isSearchable ?? profile?.is_searchable ?? true,
      social: profile?.social ?? Object.fromEntries(PROFILE_CONFIG.socialChannels.map((channel) => [channel, ''])),
    }),
    [profile],
  )

  const [values, setValues] = useState(initialValues)

  function update(field, value) {
    setValues((current) => ({ ...current, [field]: value }))
  }

  function toggleSleepBehavior(behavior) {
    setValues((current) => {
      const selected = current.sleepBehaviors.includes(behavior)
      return {
        ...current,
        sleepBehaviors: selected
          ? current.sleepBehaviors.filter((item) => item !== behavior)
          : [...current.sleepBehaviors, behavior],
      }
    })
  }

  function updateSocial(channel, value) {
    setValues((current) => ({
      ...current,
      social: {
        ...(current.social ?? {}),
        [channel]: value,
      },
    }))
  }

  const showOccupantOptions = values.roomType ? PROFILE_CONFIG.roomOccupants[values.roomType] : null

  return (
    <form className="space-y-6" noValidate>
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block text-sm font-medium text-slate-800">
          อายุ
          <input
            className="mt-2 block w-full rounded-lg border border-slate-300 px-3 py-2.5"
            onChange={(event) => update('age', event.target.value)}
            type="number"
            value={values.age}
          />
        </label>

        <label className="block text-sm font-medium text-slate-800">
          คณะ
          <select
            className="mt-2 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5"
            onChange={(event) => update('faculty', event.target.value)}
            value={values.faculty}
          >
            <option value="">เลือกคณะ</option>
            {PROFILE_CONFIG.faculties.map((faculty) => (
              <option key={faculty} value={faculty}>{faculty}</option>
            ))}
          </select>
        </label>

        <label className="block text-sm font-medium text-slate-800">
          ชั้นปี
          <select
            className="mt-2 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5"
            onChange={(event) => update('academicYear', event.target.value)}
            value={values.academicYear}
          >
            <option value="">เลือกชั้นปี</option>
            {PROFILE_CONFIG.academicYears.map((year) => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </label>

        <label className="block text-sm font-medium text-slate-800">
          เบอร์โทรศัพท์
          <input
            className="mt-2 block w-full rounded-lg border border-slate-300 px-3 py-2.5"
            onChange={(event) => update('phone', event.target.value)}
            type="tel"
            value={values.phone}
          />
        </label>
      </div>

      <fieldset className="grid gap-5 sm:grid-cols-2">
        <legend className="mb-3 text-base font-semibold text-slate-900">ประเภทห้องพัก</legend>

        <label className="block text-sm font-medium text-slate-800">
          รูปแบบห้อง
          <select
            className="mt-2 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5"
            onChange={(event) => {
              update('roomType', event.target.value)
              update('occupants', '')
            }}
            value={values.roomType}
          >
            <option value="">เลือกรูปแบบห้อง</option>
            <option value="airConditioned">ห้องแอร์</option>
            <option value="fan">ห้องพัดลม</option>
          </select>
        </label>

        <label className="block text-sm font-medium text-slate-800">
          จำนวนผู้พัก
          <select
            className="mt-2 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5"
            disabled={!showOccupantOptions}
            onChange={(event) => update('occupants', event.target.value)}
            value={values.occupants}
          >
            <option value="">เลือกจำนวนผู้พัก</option>
            {showOccupantOptions && Array.from(
              { length: showOccupantOptions.max - showOccupantOptions.min + 1 },
              (_, index) => showOccupantOptions.min + index,
            ).map((count) => (
              <option key={count} value={count}>{count} คน</option>
            ))}
          </select>
        </label>
      </fieldset>

      <fieldset>
        <legend className="mb-3 text-base font-semibold text-slate-900">พฤติกรรมการนอนของตนเอง</legend>
        <div className="grid gap-3 sm:grid-cols-2">
          {PROFILE_CONFIG.sleepBehaviors.map((behavior) => (
            <label className="flex items-center gap-3 text-sm text-slate-800" key={behavior}>
              <input
                checked={values.sleepBehaviors.includes(behavior)}
                onChange={() => toggleSleepBehavior(behavior)}
                type="checkbox"
              />
              {behavior}
            </label>
          ))}
        </div>
      </fieldset>

      <label className="block text-sm font-medium text-slate-800">
        ข้อความเพิ่มเติมสำหรับพฤติกรรมการนอน
        <input
          className="mt-2 block w-full rounded-lg border border-slate-300 px-3 py-2.5"
          onChange={(event) => update('otherSleepBehavior', event.target.value)}
          value={values.otherSleepBehavior}
        />
      </label>

      <fieldset className="space-y-4">
        <legend className="text-base font-semibold text-slate-900">ช่องทางโซเชียล</legend>
        <div className="grid gap-4 sm:grid-cols-2">
          {PROFILE_CONFIG.socialChannels.map((channel) => (
            <label className="block text-sm font-medium text-slate-800" key={channel}>
              {channel}
              <input
                className="mt-2 block w-full rounded-lg border border-slate-300 px-3 py-2.5"
                onChange={(event) => updateSocial(channel, event.target.value)}
                type="text"
                value={values.social?.[channel] ?? ''}
              />
            </label>
          ))}
        </div>
      </fieldset>

      <label className="flex items-center gap-3 text-sm font-medium text-slate-800">
        <input
          checked={values.isSearchable}
          onChange={(event) => update('isSearchable', event.target.checked)}
          type="checkbox"
        />
        เปิดให้ค้นหา
      </label>

      <button
        className="rounded-lg bg-teal-700 px-5 py-3 font-semibold text-white hover:bg-teal-800"
        onClick={onSubmit}
        type="button"
      >
        บันทึกการแก้ไข
      </button>
    </form>
  )
}
