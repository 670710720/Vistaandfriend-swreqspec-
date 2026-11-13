import { useMemo, useState } from 'react'

import {
  createRoommateRequest,
  getUnicodeCodePointLength,
  MAX_MESSAGE_LENGTH,
} from '../api/client.js'

// รองรับ FR-RRS-01, FR-RRS-02, FR-RRS-14, CON-RRS-02, CON-RRS-10
export default function RequestRoommatePage({
  profiles = [],
  senderId = 'current-student',
  onSubmit = createRoommateRequest,
}) {
  const [selectedProfileId, setSelectedProfileId] = useState(profiles[0]?.id ?? '')
  const [message, setMessage] = useState('')
  const [submissionError, setSubmissionError] = useState('')
  const [submissionSuccess, setSubmissionSuccess] = useState('')

  const selectedProfile = useMemo(
    () => profiles.find((profile) => profile.id === selectedProfileId) ?? null,
    [profiles, selectedProfileId],
  )

  const messageLength = getUnicodeCodePointLength(message)
  const remainingCharacters = MAX_MESSAGE_LENGTH - messageLength

  function handleInputChange(event) {
    const nextValue = event.target.value
    setMessage(nextValue)

    if (getUnicodeCodePointLength(nextValue) > MAX_MESSAGE_LENGTH) {
      setSubmissionError(`ข้อความประกอบต้องไม่เกิน ${MAX_MESSAGE_LENGTH} ตัวอักษร`)
      return
    }

    setSubmissionError('')
  }

  async function handleSubmit(event) {
    event.preventDefault()

    if (!selectedProfile) {
      setSubmissionError('กรุณาเลือกโปรไฟล์ผู้รับก่อนส่งคำขอ')
      return
    }

    if (messageLength > MAX_MESSAGE_LENGTH) {
      setSubmissionError(`ข้อความประกอบต้องไม่เกิน ${MAX_MESSAGE_LENGTH} ตัวอักษร`)
      return
    }

    try {
      setSubmissionError('')
      setSubmissionSuccess('')
      await onSubmit({
        senderId,
        receiverId: selectedProfile.id,
        message,
        receiverStatus: selectedProfile.status || 'looking_for_roommate',
      })
      setSubmissionSuccess('ส่งคำขอเป็นเมทเรียบร้อยแล้ว')
    } catch (error) {
      setSubmissionError(error.message || 'ไม่สามารถส่งคำขอเป็นเมทได้')
    }
  }

  if (!profiles || profiles.length === 0) {
    return (
      <section aria-live="polite" className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-xl font-bold text-slate-900">ส่งคำขอเป็นเมท</h2>
        <p className="text-sm text-slate-700" role="alert">
          คุณยังไม่มีโปรไฟล์หาเมท กรุณาสร้างโปรไฟล์ก่อนส่งคำขอเป็นเมท
        </p>
      </section>
    )
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-xl font-bold text-slate-900">ส่งคำขอเป็นเมท</h2>

      <div className="mb-5 space-y-3" aria-label="รายชื่อโปรไฟล์ผู้ที่สนใจ">
        {profiles.map((profile) => (
          <button
            key={profile.id}
            aria-label={`เลือก ${profile.name}`}
            aria-pressed={selectedProfileId === profile.id}
            className={`flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left transition ${
              selectedProfileId === profile.id
                ? 'border-teal-600 bg-teal-50'
                : 'border-slate-200 bg-slate-50 hover:border-slate-300'
            }`}
            onClick={() => setSelectedProfileId(profile.id)}
            type="button"
          >
            <div>
              <p className="font-semibold text-slate-900">{profile.name}</p>
              <p className="text-sm text-slate-600">{profile.status || 'หาเมท'}</p>
            </div>
            <span className="text-sm text-slate-500">{profile.faculty || 'ไม่ระบุคณะ'}</span>
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit}>
        <label className="mb-2 block text-sm font-medium text-slate-800" htmlFor="request-roommate-message">
          ข้อความประกอบ
        </label>
        <textarea
          className="mt-1 block w-full rounded-xl border border-slate-300 p-3 text-sm text-slate-900 focus:border-teal-500 focus:outline-none"
          id="request-roommate-message"
          onChange={handleInputChange}
          placeholder="เขียนข้อความสั้น ๆ เพื่อแนะนำตัวหรืออธิบายความสนใจ"
          value={message}
        />

        <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
          <span>{selectedProfile ? `ส่งถึง ${selectedProfile.name}` : 'ยังไม่ได้เลือกโปรไฟล์'}</span>
          <span aria-live="polite">{remainingCharacters} ตัวอักษร</span>
        </div>

        {submissionError && (
          <p className="mt-3 rounded-lg bg-red-50 p-3 text-sm text-red-700" role="alert">
            {submissionError}
          </p>
        )}

        {submissionSuccess && (
          <p className="mt-3 rounded-lg bg-green-50 p-3 text-sm text-green-700" role="status">
            {submissionSuccess}
          </p>
        )}

        <button
          className="mt-5 inline-flex w-full items-center justify-center rounded-xl bg-teal-700 px-4 py-3 font-semibold text-white hover:bg-teal-800 disabled:cursor-not-allowed disabled:bg-slate-300"
          disabled={!selectedProfile || messageLength > MAX_MESSAGE_LENGTH}
          type="submit"
        >
          ส่งคำขอเป็นเมท
        </button>
      </form>
    </section>
  )
}
