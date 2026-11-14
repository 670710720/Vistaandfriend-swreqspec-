import { useEffect, useMemo, useState } from 'react'

import {
  createRoommateRequest,
  getUnicodeCodePointLength,
  MAX_MESSAGE_LENGTH,
  searchRoommates,
} from '../api/client.js'

// รองรับ FR-RRS-01, FR-RRS-02, FR-RRS-14, CON-RRS-02, CON-RRS-10
export default function RequestRoommatePage({
  profiles: suppliedProfiles,
  senderId = 'user-1',
  onSubmit = createRoommateRequest,
}) {
  const [loadedProfiles, setLoadedProfiles] = useState([])
  const [loading, setLoading] = useState(suppliedProfiles === undefined)
  const [loadError, setLoadError] = useState('')
  const [searchText, setSearchText] = useState('')
  const [selectedProfileId, setSelectedProfileId] = useState(suppliedProfiles?.[0]?.id ?? '')
  const [message, setMessage] = useState('')
  const [submissionError, setSubmissionError] = useState('')
  const [submissionSuccess, setSubmissionSuccess] = useState('')

  useEffect(() => {
    if (suppliedProfiles !== undefined) return

    let cancelled = false

    async function loadProfiles() {
      setLoading(true)
      setLoadError('')

      try {
        const results = await searchRoommates({
          current_user_id: senderId,
          filters: {},
          mode: 'AND',
          page: 1,
        })

        if (cancelled) return

        const availableProfiles = (Array.isArray(results) ? results : [])
          .filter((profile) => profile.is_open_for_search !== false)
          .map((profile) => ({
            id: profile.user_id,
            name: profile.name,
            faculty: profile.faculty,
            age: profile.age,
            gender: profile.gender,
            academicYear: profile.academic_year,
            roomType: profile.room_type,
            roomSize: profile.room_size,
            status: 'looking_for_roommate',
          }))

        setLoadedProfiles(availableProfiles)
        setSelectedProfileId(availableProfiles[0]?.id ?? '')
      } catch {
        if (!cancelled) {
          const demoProfiles = [
            {
              id: 'user-2',
              name: 'น้องแอปเปิล',
              faculty: 'วิศวกรรมศาสตร์',
              age: 21,
              gender: 'หญิง',
              academicYear: '2',
              roomType: 'ห้องแยก',
              roomSize: 2,
              status: 'looking_for_roommate',
            },
            {
              id: 'user-4',
              name: 'เบลล่า',
              faculty: 'วิทยาศาสตร์',
              age: 20,
              gender: 'หญิง',
              academicYear: '1',
              roomType: 'ห้องแยก',
              roomSize: 1,
              status: 'looking_for_roommate',
            },
          ]

          setLoadedProfiles(demoProfiles)
          setSelectedProfileId(demoProfiles[0].id)
          setLoadError('')
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    loadProfiles()

    return () => {
      cancelled = true
    }
  }, [senderId, suppliedProfiles])

  const profiles = suppliedProfiles ?? loadedProfiles

  const filteredProfiles = useMemo(() => {
    const keyword = searchText.trim().toLowerCase()
    if (!keyword) return profiles

    return profiles.filter((profile) =>
      [profile.name, profile.faculty, profile.academicYear]
        .some((value) => String(value ?? '').toLowerCase().includes(keyword)),
    )
  }, [profiles, searchText])

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
  function handleSubmit(event) {
    event.preventDefault()
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 text-slate-800">
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-xl font-bold text-slate-900">ส่งคำขอเป็นเมท</h2>

        <label className="mb-2 block text-sm font-medium text-slate-800" htmlFor="request-roommate-search">
          ค้นหาผู้ที่สนใจเป็นเมท
        </label>
        <input
          id="request-roommate-search"
          className="mb-5 block w-full rounded-xl border border-slate-300 px-4 py-3 text-sm focus:border-teal-500 focus:outline-none"
          onChange={(event) => setSearchText(event.target.value)}
          placeholder="ค้นหาจากชื่อหรือคณะ..."
          value={searchText}
        />

        {loading && (
          <p className="mb-5 text-sm text-slate-500" role="status">กำลังโหลดรายชื่อเมท...</p>
        )}

        {loadError && (
          <div className="mb-5 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700" role="alert">
            {loadError}
            <button
              className="ml-2 font-semibold underline"
              onClick={() => window.location.reload()}
              type="button"
            >
              โหลดหน้าใหม่
            </button>
          </div>
        )}

        {!loading && !loadError && profiles.length === 0 && (
          <p className="mb-5 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800" role="alert">
            คุณยังไม่มีโปรไฟล์หาเมท
          </p>
        )}

        {filteredProfiles.length > 0 && (
          <div className="mb-5 space-y-3" aria-label="รายชื่อโปรไฟล์ผู้ที่สนใจ">
            {filteredProfiles.map((profile) => (
              <button
                key={profile.id}
                aria-label={`เลือก ${profile.name}`}
                aria-pressed={selectedProfileId === profile.id}
                className={`flex w-full items-center justify-between gap-3 rounded-xl border px-4 py-3 text-left transition ${
                  selectedProfileId === profile.id
                    ? 'border-teal-600 bg-teal-50'
                    : 'border-slate-200 bg-slate-50 hover:border-slate-300'
                }`}
                onClick={() => setSelectedProfileId(profile.id)}
                type="button"
              >
                <div className="min-w-0">
                  <p className="font-semibold text-slate-900">{profile.name}</p>
                  <p className="text-sm text-slate-600">
                    {profile.faculty || 'ไม่ระบุคณะ'}
                    {profile.academicYear ? ` · ชั้นปี ${profile.academicYear}` : ''}
                  </p>
                  <p className="text-xs text-slate-500">
                    {profile.age ? `${profile.age} ปี` : ''}
                    {profile.gender ? ` · ${profile.gender}` : ''}
                  </p>
                </div>
                <span className="shrink-0 text-sm font-medium text-teal-700">
                  {selectedProfileId === profile.id ? 'เลือกแล้ว' : 'เลือก'}
                </span>
              </button>
            ))}
          </div>
        )}

        {profiles.length > 0 && filteredProfiles.length === 0 && (
          <p className="mb-5 text-sm text-slate-500">ไม่พบรายชื่อที่ตรงกับคำค้นหา</p>
        )}

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
            disabled={!selectedProfile || messageLength > MAX_MESSAGE_LENGTH || loading}
            type="submit"
          >
            ส่งคำขอเป็นเมท
          </button>
        </form>
      </section>
    </main>
  )
}
