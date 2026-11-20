import { useState } from 'react'
import { ROOMMATE_PREFERENCE_CONFIG } from '../config.js'
import { saveRoommatePreference } from '../api/client.js'

const initialPreference = {
  roomType: '',
  roomOccupants: '',
  sleepBehavior: '',
  cleanliness: '',
  sleepTime: '',
  additionalText: '',
}

// รองรับ FR-RPS-03 และ AC-RPS-02
export default function RoommatePreferencePage({ ownerId = 'student-1' }) {
  const [preference, setPreference] = useState(initialPreference)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

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
        || preference.additionalText.length > ROOMMATE_PREFERENCE_CONFIG.additionalText.maxLength)) {
      setError('ข้อมูลเพิ่มเติมต้องไม่เกิน 500 ตัวอักษรและห้ามเป็นช่องว่าง')
      return
    }
    await saveRoommatePreference({
      owner_id: ownerId,
      room_occupants: preference.roomOccupants === '' ? null : Number(preference.roomOccupants),
      room_type: preference.roomType,
      sleep_behavior: preference.sleepBehavior || null,
      cleanliness: preference.cleanliness || null,
      sleep_time: preference.sleepTime || null,
      additional_text: preference.additionalText || null,
    })
    setSubmitted(true)
  }

  const occupants = preference.roomType
    ? ROOMMATE_PREFERENCE_CONFIG.roomOccupants[preference.roomType]
    : null

  return (
    <section aria-labelledby="roommate-preference-heading">
      <h2 id="roommate-preference-heading">ความต้องการหาเมท</h2>
      <form onSubmit={submit}>
        <label>
          รูปแบบห้อง
          <select
            value={preference.roomType}
            onChange={(event) => {
              update('roomType', event.target.value)
              update('roomOccupants', '')
            }}
          >
            <option value="">เลือกรูปแบบห้อง</option>
            <option value="airConditioned">ห้องแอร์</option>
            <option value="fan">ห้องพัดลม</option>
          </select>
        </label>

        <label>
          จำนวนคนในห้อง
          {occupants && (
            <span>
              {' '}({occupants.min}–{occupants.max} คน)
            </span>
          )}
          <select
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

        <label>
          พฤติกรรมการนอน
          <select
            value={preference.sleepBehavior}
            onChange={(event) => update('sleepBehavior', event.target.value)}
          >
            <option value="">เลือกพฤติกรรมการนอน</option>
            {ROOMMATE_PREFERENCE_CONFIG.sleepBehaviors.map((value) => (
              <option key={value} value={value}>{value}</option>
            ))}
          </select>
        </label>

        <label>
          ความสะอาด
          <select
            value={preference.cleanliness}
            onChange={(event) => update('cleanliness', event.target.value)}
          >
            <option value="">เลือกความสะอาด</option>
            {ROOMMATE_PREFERENCE_CONFIG.cleanliness.map((value) => (
              <option key={value} value={value}>{value}</option>
            ))}
          </select>
        </label>

        <label>
          เวลาเข้านอน
          <select
            value={preference.sleepTime}
            onChange={(event) => update('sleepTime', event.target.value)}
          >
            <option value="">เลือกเวลาเข้านอน</option>
            {ROOMMATE_PREFERENCE_CONFIG.sleepTime.map((value) => (
              <option key={value} value={value}>{value}</option>
            ))}
          </select>
        </label>

        <label>
          ข้อมูลเพิ่มเติม
          <textarea
            maxLength={ROOMMATE_PREFERENCE_CONFIG.additionalText.maxLength}
            value={preference.additionalText}
            onChange={(event) => update('additionalText', event.target.value)}
          />
        </label>

        <button type="submit">
          บันทึกความต้องการ
        </button>
      </form>
      {error && <p role="alert">{error}</p>}
      {submitted && <p role="status">ระบบรับข้อมูลความต้องการของนักศึกษา</p>}
    </section>
  )
}
