import { useEffect, useState } from 'react'
import {
  getRoommatePreferenceOptions,
  saveRoommatePreference,
} from '../api/client.js'

const ROOM_TYPE_LABELS = {
  airConditioned: 'ห้องแอร์',
  fan: 'ห้องพัดลม',
}

const initialPreference = {
  roomType: '',
  roomOccupants: '',
  sleepBehavior: '',
  cleanliness: '',
  sleepTime: '',
  additionalText: '',
}

// รองรับ FR-RPS-01, FR-RPS-02, FR-RPS-03, AC-RPS-01 และ AC-RPS-02
export default function RoommatePreferencePage({ onMissingProfile }) {
  const [preference, setPreference] = useState(initialPreference)
  const [options, setOptions] = useState(null)
  const [loadError, setLoadError] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    getRoommatePreferenceOptions()
      .then((loadedOptions) => {
        if (!active) return
        if (loadedOptions.status === 'missing_profile') {
          setLoadError('ยังไม่มีโปรไฟล์หาเมท กรุณาสร้างโปรไฟล์ก่อนระบุความต้องการ')
          onMissingProfile?.()
          return
        }
        setOptions(loadedOptions)
      })
      .catch(() => {
        if (active) setLoadError('ไม่สามารถโหลดตัวเลือกความต้องการหาเมทได้ กรุณาลองใหม่อีกครั้ง')
      })

    return () => {
      active = false
    }
  }, [])

  function update(field, value) {
    setPreference((current) => ({ ...current, [field]: value }))
    setError('')
    setSubmitted(false)
  }

  async function submit(event) {
    event.preventDefault()
    if (!occupants || preference.roomOccupants === '') {
      // รองรับ FR-RPS-04, FR-RPS-05 และ AC-RPS-03
      setError('กรุณาเลือกรูปแบบห้องและจำนวนคนในห้อง')
      return
    }
    const roomOccupants = Number(preference.roomOccupants)
    // รองรับ CON-RPS-06, FR-RPS-09 และ AC-RPS-02B
    if (roomOccupants < occupants.min || roomOccupants > occupants.max) {
      setError('จำนวนคนในห้องไม่สอดคล้องกับรูปแบบห้อง')
      return
    }
    // รองรับ FR-RPS-03, FR-RPS-09 และ AC-RPS-02C
    if (preference.additionalText !== ''
      && (preference.additionalText.trim() === ''
        || preference.additionalText.length > options.additionalText.maxLength)) {
      setError(
        `ข้อมูลเพิ่มเติมต้องไม่เกิน ${options.additionalText.maxLength} ตัวอักษรและห้ามเป็นช่องว่าง`,
      )
      return
    }
    try {
      await saveRoommatePreference({
        room_occupants: preference.roomOccupants === '' ? null : Number(preference.roomOccupants),
        room_type: preference.roomType,
        sleep_behavior: preference.sleepBehavior || null,
        cleanliness: preference.cleanliness || null,
        sleep_time: preference.sleepTime || null,
        additional_text: preference.additionalText || null,
      })
      setSubmitted(true)
    } catch {
      // รองรับ FR-RPS-06, FR-RPS-09 และ AC-RPS-04B
      setSubmitted(false)
      setError('ไม่สามารถบันทึกความต้องการได้ กรุณาลองใหม่')
    }
  }

  const occupants = preference.roomType
    ? options?.roomOccupants?.[preference.roomType]
    : null

  return (
    <main className="mx-auto min-h-screen max-w-5xl px-4 py-10 text-slate-800 sm:px-6">
      <section
        aria-labelledby="roommate-preference-heading"
        className="overflow-hidden rounded-3xl border border-teal-100 bg-white shadow-xl shadow-teal-950/5"
      >
        <header className="border-b border-teal-100 bg-gradient-to-r from-teal-50 via-white to-cyan-50 px-6 py-7 sm:px-8">
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.22em] text-teal-700">
            Roommate preference
          </p>
          <h2 id="roommate-preference-heading" className="text-3xl font-black tracking-tight text-slate-900">
            ความต้องการหาเมท
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
            เลือกสภาพห้องและพฤติกรรมที่คุณต้องการเพื่อปรับผลลัพธ์การค้นหาให้ตรงกับคุณมากขึ้น
          </p>
        </header>

        <form onSubmit={submit} className="p-6 sm:p-8">
          {loadError && (
            <p
              role="alert"
              className="mb-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-900"
            >
              {loadError}
            </p>
          )}

          <div className="grid gap-6 lg:grid-cols-2">
            <label className="block text-sm font-bold text-slate-800">
              รูปแบบห้อง
              <select
                className="mt-2 block w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-base font-medium shadow-sm outline-none transition focus:border-teal-600 focus:ring-4 focus:ring-teal-100"
                value={preference.roomType}
                onChange={(event) => {
                  update('roomType', event.target.value)
                  update('roomOccupants', '')
                }}
              >
                <option value="">เลือกรูปแบบห้อง</option>
                {Object.keys(options?.roomOccupants ?? {}).map((roomType) => (
                  <option key={roomType} value={roomType}>
                    {ROOM_TYPE_LABELS[roomType] ?? roomType}
                  </option>
                ))}
              </select>
            </label>

            <label className="block text-sm font-bold text-slate-800">
              จำนวนคนในห้อง
              {occupants && (
                <span className="ml-2 rounded-full bg-teal-50 px-2 py-1 text-xs font-bold text-teal-700">
                  ({occupants.min}–{occupants.max} คน)
                </span>
              )}
              <select
                className="mt-2 block w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-base font-medium shadow-sm outline-none transition disabled:bg-slate-100 disabled:text-slate-400 focus:border-teal-600 focus:ring-4 focus:ring-teal-100"
                aria-label="จำนวนคนในห้อง"
                disabled={!occupants}
                value={preference.roomOccupants}
                onChange={(event) => update('roomOccupants', event.target.value)}
              >
                <option value="">เลือกจำนวนคน</option>
                {occupants && Array.from(
                  { length: occupants.max - occupants.min + 1 },
                  (_, index) => occupants.min + index,
                ).map((count) => (
                  <option key={count} value={count}>{count} คน</option>
                ))}
              </select>
            </label>

            <label className="block text-sm font-bold text-slate-800">
              พฤติกรรมการนอน
              <select
                className="mt-2 block w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-base font-medium shadow-sm outline-none transition focus:border-teal-600 focus:ring-4 focus:ring-teal-100"
                value={preference.sleepBehavior}
                onChange={(event) => update('sleepBehavior', event.target.value)}
              >
                <option value="">เลือกพฤติกรรมการนอน</option>
                {(options?.sleepBehaviors ?? []).map((value) => (
                  <option key={value} value={value}>{value}</option>
                ))}
              </select>
            </label>

            <label className="block text-sm font-bold text-slate-800">
              ความสะอาด
              <select
                className="mt-2 block w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-base font-medium shadow-sm outline-none transition focus:border-teal-600 focus:ring-4 focus:ring-teal-100"
                value={preference.cleanliness}
                onChange={(event) => update('cleanliness', event.target.value)}
              >
                <option value="">เลือกความสะอาด</option>
                {(options?.cleanliness ?? []).map((value) => (
                  <option key={value} value={value}>{value}</option>
                ))}
              </select>
            </label>

            <label className="block text-sm font-bold text-slate-800">
              เวลาเข้านอน
              <select
                className="mt-2 block w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-base font-medium shadow-sm outline-none transition focus:border-teal-600 focus:ring-4 focus:ring-teal-100"
                value={preference.sleepTime}
                onChange={(event) => update('sleepTime', event.target.value)}
              >
                <option value="">เลือกเวลาเข้านอน</option>
                {(options?.sleepTime ?? []).map((value) => (
                  <option key={value} value={value}>{value}</option>
                ))}
              </select>
            </label>

            <label className="block text-sm font-bold text-slate-800 lg:col-span-2">
              <span className="flex items-center justify-between gap-3">
                <span>ข้อมูลเพิ่มเติม</span>
                {options?.additionalText?.maxLength && (
                  <span className="text-xs font-medium text-slate-500">
                    {preference.additionalText.length}/{options.additionalText.maxLength}
                  </span>
                )}
              </span>
              <textarea
                aria-label="ข้อมูลเพิ่มเติม"
                className="mt-2 min-h-28 block w-full resize-y rounded-xl border border-slate-300 bg-white px-4 py-3 text-base font-medium shadow-sm outline-none transition focus:border-teal-600 focus:ring-4 focus:ring-teal-100"
                maxLength={options?.additionalText?.maxLength}
                value={preference.additionalText}
                onChange={(event) => update('additionalText', event.target.value)}
              />
            </label>
          </div>

          {error && (
            <p role="alert" className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-800">
              {error}
            </p>
          )}
          {submitted && (
            <p role="status" className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800">
              ระบบรับข้อมูลความต้องการของนักศึกษา
            </p>
          )}

          <div className="mt-8 flex justify-end border-t border-slate-100 pt-6">
            <button
              type="submit"
              className="w-full rounded-xl bg-teal-700 px-6 py-3.5 text-base font-bold text-white shadow-lg shadow-teal-700/20 transition hover:bg-teal-800 focus:outline-none focus:ring-4 focus:ring-teal-200 sm:w-auto"
            >
              บันทึกความต้องการ
            </button>
          </div>
        </form>
      </section>
    </main>
  )
}
