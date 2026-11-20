
import { useEffect, useState } from 'react'
import {
  createRoommateProfile,
  fetchRoommateProfileStatus,
  updateRoommateProfileSearchVisibility,
} from './api/client.js'
import {
  PROFILE_CONFIG,
  PROFILE_DISCOVERY_DEFAULT,
  SLEEP_NONE_EXCLUSIVE,
  SLEEP_OTHER_REQUIRES_DESCRIPTION,
} from './config.js'
import { useAuth } from './hooks/useAuth.js'
import ProfileEditPage from './pages/ProfileEditPage.jsx'
import { validateProfile } from './profileValidation.js'
import SearchRoommatePage from './pages/SearchRoommatePage.js'
import RequestRoommatePage from './pages/RequestRoommatePage.jsx'
import { Sidebar } from './navigation/sidebar.js'
import ChatListPage from './pages/ChatListPage.jsx'
import LoginPage from './pages/LoginPage.jsx'

const initialValues = {
  nickname: '',
  age: '',
  gender: '',
  faculty: '',
  academicYear: '',
  profileImage: null,
  phone: '',
  roomType: '',
  occupants: '',
  sleepBehaviors: [],
  otherSleepBehavior: '',
  social: Object.fromEntries(PROFILE_CONFIG.socialChannels.map((channel) => [channel, ''])),
}

function FieldError({ id, errors }) {
  if (!errors[id]) return null
  return <p className="mt-1 text-sm text-red-700" role="alert">{errors[id]}</p>
}

// รองรับ CON-AUTH-01 และคำตอบ Q-04
export function redirectToLogin({
  showWarning = (message) => window.alert(message),
  navigate = (path) => window.location.assign(path),
} = {}) {
  showWarning('กรุณาเข้าสู่ระบบก่อนสร้างโปรไฟล์')
  navigate('/login')
}

// รองรับ CON-AUTH-01, Q-04 และ ASM-05
export default function App(props) {
  if (window.location.pathname === '/login') {
    return <LoginPage />
  }
  return <ProfileApp {...props} />
}

// รองรับ FR-RMP-01, FR-RMP-02, FR-RMP-04, AC-RMP-01, AC-RMP-02, AC-RMP-02A และ FR-CHAT-01/02/08/12
function ProfileApp({ initialLoggedIn = true, onLoginRequired = redirectToLogin }) {
  const { isLoggedIn } = useAuth(initialLoggedIn)

  const [formOpen, setFormOpen] = useState(false)
  const [currentView, setCurrentView] = useState('profile')
  const [editOpen, setEditOpen] = useState(false)
  const [values, setValues] = useState(initialValues)
  const [errors, setErrors] = useState({})
  const [valid, setValid] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [created, setCreated] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [isSearchable, setIsSearchable] = useState(PROFILE_DISCOVERY_DEFAULT)
  const [isUpdatingVisibility, setIsUpdatingVisibility] = useState(false)
  const [visibilityError, setVisibilityError] = useState('')
  const [profileImagePreviewUrl, setProfileImagePreviewUrl] = useState('')
  const [isCheckingProfile, setIsCheckingProfile] = useState(false)
  const [profileAccessError, setProfileAccessError] = useState('')

  useEffect(() => {
    if (!created || !values.profileImage || typeof URL.createObjectURL !== 'function') {
      setProfileImagePreviewUrl('')
      return undefined
    }

    const previewUrl = URL.createObjectURL(values.profileImage)
    setProfileImagePreviewUrl(previewUrl)
    return () => URL.revokeObjectURL(previewUrl)
  }, [created, values.profileImage])

  function update(field, value) {
    setValues((current) => ({ ...current, [field]: value }))
    setErrors((current) => {
      const nextErrors = { ...current }
      delete nextErrors[field]
      return nextErrors
    })
    setValid(false)
    setSubmitError('')
  }

  // รองรับ FR-RMP-04, AC-RMP-02, CON-DATA-01, CON-VALID-01, Q-06
  function toggleSleepBehavior(behavior) {
    setValues((current) => {
      const selected = current.sleepBehaviors.includes(behavior)
      const withoutExclusive = current.sleepBehaviors.filter(
        (item) => item !== SLEEP_NONE_EXCLUSIVE,
      )
      const sleepBehaviors = behavior === SLEEP_NONE_EXCLUSIVE
        ? (selected ? [] : [behavior])
        : selected
          ? withoutExclusive.filter((item) => item !== behavior)
          : [...withoutExclusive, behavior]
      return { ...current, sleepBehaviors }
    })
    setErrors((current) => {
      const nextErrors = { ...current }
      delete nextErrors.sleepBehaviors
      delete nextErrors.otherSleepBehavior
      return nextErrors
    })
    setValid(false)
    setSubmitError('')
  }

  function validate(event) {
    event.preventDefault()
    const nextErrors = validateProfile(values)
    setErrors(nextErrors)
    setValid(Object.keys(nextErrors).length === 0)
  }

  // รองรับ FR-RMP-01/02, CON-AUTH-01 และ CON-PROFILE-01
  async function openCreateProfile() {
    if (isCheckingProfile) return
    setCurrentView('profile')
    setFormOpen(false)
    setProfileAccessError('')

    if (!isLoggedIn) {
      onLoginRequired()
      return
    }

    setIsCheckingProfile(true)
    try {
      const hasProfile = await fetchRoommateProfileStatus()
      if (hasProfile) {
        setProfileAccessError('ไม่สามารถสร้างโปรไฟล์ใหม่ได้')
        return
      }
      setFormOpen(true)
    } catch (error) {
      if (error?.status === 401) {
        onLoginRequired()
        return
      }
      setProfileAccessError(
        error instanceof Error && error.message
          ? error.message
          : 'ไม่สามารถตรวจสอบโปรไฟล์ได้ กรุณาลองใหม่',
      )
    } finally {
      setIsCheckingProfile(false)
    }
  }

  // รองรับ FR-RMP-08, FR-RMP-09, AC-RMP-05 และ CON-AUTH-01
  async function createProfile() {
    const nextErrors = validateProfile(values)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) {
      setValid(false)
      return
    }

    setValid(true)
    setSubmitError('')
    setIsSubmitting(true)
    const { profileImage, ...profileData } = values
    try {
      await createRoommateProfile(profileData, profileImage)
      setCreated(true)
    } catch (error) {
      const serverErrors = (
        error &&
        typeof error === 'object' &&
        error.errors &&
        typeof error.errors === 'object'
      )
        ? error.errors
        : {}
      const visibleFields = [
        'nickname',
        'age',
        'gender',
        'faculty',
        'academicYear',
        'profileImage',
        'phone',
        'roomType',
        'occupants',
        'sleepBehaviors',
        'otherSleepBehavior',
      ]
      const fieldErrors = Object.fromEntries(
        Object.entries(serverErrors).filter(
          ([field, message]) => visibleFields.includes(field) && typeof message === 'string',
        ),
      )
      setErrors((current) => ({ ...current, ...fieldErrors }))
      const hasUnmappedErrors = Object.keys(serverErrors).some(
        (field) => !visibleFields.includes(field),
      )
      const message = error instanceof Error && error.message
        ? error.message
        : 'ไม่สามารถสร้างโปรไฟล์ได้ กรุณาลองใหม่'
      setSubmitError(
        Object.keys(fieldErrors).length === 0 || hasUnmappedErrors
          ? message
          : '',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  // รองรับ FR-RMP-11, CON-AUTH-01 และ CON-DISCOVER-01
  async function toggleProfileSearchVisibility() {
    if (isUpdatingVisibility) return

    setIsUpdatingVisibility(true)
    setVisibilityError('')
    try {
      const result = await updateRoommateProfileSearchVisibility(!isSearchable)
      setIsSearchable(result.isSearchable)
    } catch (error) {
      setVisibilityError(
        error instanceof Error && error.message
          ? error.message
          : 'ไม่สามารถเปลี่ยนสถานะการค้นหาได้ กรุณาลองใหม่',
      )
    } finally {
      setIsUpdatingVisibility(false)
    }
  }

  const occupants = values.roomType
    ? PROFILE_CONFIG.roomOccupants[values.roomType]
    : null

  if (!isLoggedIn) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <header className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-wide text-teal-800">Vista & Friend</p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900">โปรไฟล์หาเมท</h1>
        </header>
        <p role="alert">กรุณาเข้าสู่ระบบก่อนใช้งานฟังก์ชันค้นหาเมท</p>
        <button
          className="mt-4 rounded-lg bg-teal-700 px-5 py-3 font-semibold text-white hover:bg-teal-800"
          onClick={onLoginRequired}
          type="button"
        >
          สร้างโปรไฟล์หาเมท
        </button>
      </main>
    )
  }

  if (
    import.meta.env.DEV &&
    import.meta.env.MODE === 'development' &&
    import.meta.env.VITE_CHAT_DEMO_MODE === 'true'
  ) {
    return <ChatListPage />
  }

  if (currentView === 'search-roommate') {
    return <SearchRoommatePage currentUserId="user-1" />
  }

  if (currentView === 'request-roommate') {
    return <RequestRoommatePage senderId="user-1" />
  }

  if (currentView === 'chat') {
    return (
      <>
        <div className="mx-auto max-w-7xl px-4 pt-4 sm:px-6">
          <button
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 font-semibold text-slate-800 hover:bg-slate-50"
            onClick={() => setCurrentView('profile')}
            type="button"
          >
            ← กลับไปหน้าโปรไฟล์
          </button>
        </div>
        <ChatListPage />
      </>
    )
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <header className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-wide text-teal-800">
          Vista & Friend
        </p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900">โปรไฟล์หาเมท</h1>
      </header>

      <Sidebar
        isLoggedIn={isLoggedIn}
        onOpenSearch={() => {
          setFormOpen(false)
          setCurrentView('search-roommate')
        }}
        onOpenRequest={() => {
          setFormOpen(false)
          setCurrentView('request-roommate')
        }}
      />

      {isCheckingProfile && (
        <p className="mb-4 text-sm text-slate-700" role="status">กำลังตรวจสอบโปรไฟล์...</p>
      )}
      {profileAccessError && (
        <p className="mb-4 text-sm text-red-700" role="alert">{profileAccessError}</p>
      )}

      <nav aria-label="เมนูเพิ่มเติม" className="mb-6 flex flex-wrap gap-3">
        <button
          className="rounded-lg border border-teal-700 bg-white px-5 py-3 font-semibold text-teal-700 hover:bg-teal-50 focus:outline-2 focus:outline-offset-2 focus:outline-teal-700"
          onClick={openCreateProfile}
          type="button"
        >
          สร้างโปรไฟล์หาเมท
        </button>
        <button
          className="rounded-lg border border-teal-700 bg-white px-5 py-3 font-semibold text-teal-700 hover:bg-teal-50 focus:outline-2 focus:outline-offset-2 focus:outline-teal-700"
          onClick={() => {
            setFormOpen(false)
            setCurrentView('chat')
          }}
          type="button"
        >
          แชทกับรูมเมท
        </button>

        <button
          className="rounded-lg border border-slate-300 bg-white px-5 py-3 font-semibold text-slate-800 hover:bg-slate-50"
          onClick={() => setEditOpen(true)}
          type="button"
        >
          แก้ไขโปรไฟล์
        </button>
      </nav>

      {editOpen && (
        <ProfileEditPage
          profile={{
            age: 22,
            faculty: 'วิศวกรรมศาสตร์',
            academicYear: '3',
            phone: '0812345678',
            roomType: 'airConditioned',
            occupants: 2,
            sleepBehaviors: ['กรน', 'นอนดิ้น'],
            isSearchable: true,
          }}
        />
      )}

      {created && (
        <section
          aria-labelledby="created-profile-heading"
          className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 sm:p-8"
        >
          <h2 id="created-profile-heading" className="mb-4 text-2xl font-bold text-slate-900">
            โปรไฟล์ของฉัน
          </h2>
          <p className="mb-6 text-sm font-medium text-teal-800" role="status">
            สร้างโปรไฟล์สำเร็จ
          </p>

          {profileImagePreviewUrl && (
            <img
              alt={`รูปโปรไฟล์ของ ${values.nickname}`}
              className="mb-6 h-32 w-32 rounded-full object-cover"
              src={profileImagePreviewUrl}
            />
          )}

          <dl className="grid gap-4 sm:grid-cols-2">
            <div><dt className="font-semibold">ชื่อเล่น</dt><dd>{values.nickname}</dd></div>
            <div><dt className="font-semibold">อายุ</dt><dd>{values.age}</dd></div>
            <div><dt className="font-semibold">เพศ</dt><dd>{values.gender}</dd></div>
            <div><dt className="font-semibold">คณะ</dt><dd>{values.faculty}</dd></div>
            <div><dt className="font-semibold">ชั้นปี</dt><dd>{values.academicYear}</dd></div>
            <div><dt className="font-semibold">เบอร์โทรศัพท์</dt><dd>{values.phone}</dd></div>
            <div>
              <dt className="font-semibold">รูปโปรไฟล์</dt>
              <dd>{values.profileImage?.name}</dd>
            </div>
            <div>
              <dt className="font-semibold">รูปแบบห้อง</dt>
              <dd>{values.roomType === 'airConditioned' ? 'ห้องแอร์' : 'ห้องพัดลม'}</dd>
            </div>
            <div><dt className="font-semibold">จำนวนผู้พัก</dt><dd>{values.occupants} คน</dd></div>
            <div>
              <dt className="font-semibold">พฤติกรรมการนอน</dt>
              <dd>
                {values.sleepBehaviors.join(', ')}
                {values.otherSleepBehavior && `: ${values.otherSleepBehavior}`}
              </dd>
            </div>
            {PROFILE_CONFIG.socialChannels.map((channel) => (
              <div key={channel}>
                <dt className="font-semibold">{channel}</dt>
                <dd>{values.social[channel] || '—'}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-6 border-t border-slate-200 pt-5">
            <p className="font-semibold" role="status">
              สถานะการค้นหา: {isSearchable ? 'เปิด' : 'ไม่เปิด'}
            </p>
            <button
              className="mt-3 rounded-lg bg-teal-700 px-5 py-3 font-semibold text-white hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-60"
              disabled={isUpdatingVisibility}
              onClick={toggleProfileSearchVisibility}
              type="button"
            >
              {isUpdatingVisibility
                ? 'กำลังบันทึกสถานะ...'
                : isSearchable
                  ? 'ปิดการค้นหา'
                  : 'เปิดให้ค้นหา'}
            </button>
            {visibilityError && (
              <p className="mt-3 text-sm text-red-700" role="alert">{visibilityError}</p>
            )}
          </div>
        </section>
      )}

      {formOpen && !created && (
        <section aria-labelledby="create-profile-heading" className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 sm:p-8">
          <h2 id="create-profile-heading" className="mb-6 text-2xl font-bold text-slate-900">
            สร้างโปรไฟล์หาเมท
          </h2>

          <form className="space-y-6" noValidate onSubmit={validate}>
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="block text-sm font-medium text-slate-800">
                ชื่อเล่น
                <input
                  autoComplete="nickname"
                  className="mt-2 block w-full rounded-lg border border-slate-300 px-3 py-2.5"
                  onChange={(event) => update('nickname', event.target.value)}
                  value={values.nickname}
                />
                <FieldError errors={errors} id="nickname" />
              </label>

              <label className="block text-sm font-medium text-slate-800">
                อายุ
                <input
                  className="mt-2 block w-full rounded-lg border border-slate-300 px-3 py-2.5"
                  inputMode="numeric"
                  onChange={(event) => update('age', event.target.value)}
                  type="number"
                  value={values.age}
                />
                <FieldError errors={errors} id="age" />
              </label>

              <label className="block text-sm font-medium text-slate-800">
                เพศ
                <select
                  className="mt-2 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5"
                  onChange={(event) => update('gender', event.target.value)}
                  value={values.gender}
                >
                  <option value="">เลือกเพศ</option>
                  {PROFILE_CONFIG.genders.map((gender) => <option key={gender}>{gender}</option>)}
                </select>
                <FieldError errors={errors} id="gender" />
              </label>

              <label className="block text-sm font-medium text-slate-800">
                คณะ
                <select
                  className="mt-2 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5"
                  onChange={(event) => update('faculty', event.target.value)}
                  value={values.faculty}
                >
                  <option value="">เลือกคณะ</option>
                  {PROFILE_CONFIG.faculties.map((faculty) => <option key={faculty}>{faculty}</option>)}
                </select>
                <FieldError errors={errors} id="faculty" />
              </label>

              <label className="block text-sm font-medium text-slate-800">
                ชั้นปี
                <select
                  className="mt-2 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5"
                  onChange={(event) => update('academicYear', event.target.value)}
                  value={values.academicYear}
                >
                  <option value="">เลือกชั้นปี</option>
                  {PROFILE_CONFIG.academicYears.map((year) => <option key={year} value={year}>{year}</option>)}
                </select>
                <FieldError errors={errors} id="academicYear" />
              </label>

              <label className="block text-sm font-medium text-slate-800">
                เบอร์โทรศัพท์
                <input
                  autoComplete="tel"
                  className="mt-2 block w-full rounded-lg border border-slate-300 px-3 py-2.5"
                  inputMode="tel"
                  onChange={(event) => update('phone', event.target.value)}
                  value={values.phone}
                />
                <FieldError errors={errors} id="phone" />
              </label>

              <label className="block text-sm font-medium text-slate-800 sm:col-span-2">
                รูปโปรไฟล์ (JPG หรือ PNG)
                <input
                  accept={PROFILE_CONFIG.image.allowedTypes.join(',')}
                  className="mt-2 block w-full rounded-lg border border-slate-300 px-3 py-2.5"
                  onChange={(event) => update('profileImage', event.target.files?.[0] ?? null)}
                  type="file"
                />
                <FieldError errors={errors} id="profileImage" />
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
                <FieldError errors={errors} id="roomType" />
              </label>

              <label className="block text-sm font-medium text-slate-800">
                จำนวนผู้พัก
                <select
                  className="mt-2 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5"
                  disabled={!occupants}
                  onChange={(event) => update('occupants', event.target.value)}
                  value={values.occupants}
                >
                  <option value="">เลือกจำนวนผู้พัก</option>
                  {occupants && Array.from(
                    { length: occupants.max - occupants.min + 1 },
                    (_, index) => occupants.min + index,
                  ).map((count) => <option key={count} value={count}>{count} คน</option>)}
                </select>
                <FieldError errors={errors} id="occupants" />
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
              <FieldError errors={errors} id="sleepBehaviors" />
              {values.sleepBehaviors.includes(SLEEP_OTHER_REQUIRES_DESCRIPTION) && (
                <label className="mt-4 block text-sm font-medium text-slate-800">
                  ระบุพฤติกรรมการนอนเพิ่มเติม
                  <input
                    className="mt-2 block w-full rounded-lg border border-slate-300 px-3 py-2.5"
                    onChange={(event) => update('otherSleepBehavior', event.target.value)}
                    required
                    value={values.otherSleepBehavior}
                  />
                  <FieldError errors={errors} id="otherSleepBehavior" />
                </label>
              )}
            </fieldset>

            <fieldset>
              <legend className="mb-3 text-base font-semibold text-slate-900">ข้อมูลโซเชียล (ไม่บังคับ)</legend>
              <div className="grid gap-4 sm:grid-cols-2">
                {PROFILE_CONFIG.socialChannels.map((channel) => (
                  <label className="block text-sm font-medium text-slate-800" key={channel}>
                    {channel}
                    <input
                      className="mt-2 block w-full rounded-lg border border-slate-300 px-3 py-2.5"
                      onChange={(event) => {
                        setValues((current) => ({
                          ...current,
                          social: { ...current.social, [channel]: event.target.value },
                        }))
                        setValid(false)
                        setSubmitError('')
                      }}
                      value={values.social[channel]}
                    />
                  </label>
                ))}
              </div>
            </fieldset>

            <div className="flex flex-wrap items-center gap-4">
              <button
                className="rounded-lg bg-teal-700 px-5 py-3 font-semibold text-white hover:bg-teal-800 focus:outline-2 focus:outline-offset-2 focus:outline-teal-700"
                type="submit"
              >
                ตรวจสอบข้อมูล
              </button>
              {valid && (
                <p className="text-sm font-medium text-teal-800" role="status">
                  ข้อมูลถูกต้องและสามารถดำเนินการยืนยันการสร้างโปรไฟล์ได้
                </p>
              )}
              {valid && (
                <button
                  className="rounded-lg bg-teal-700 px-5 py-3 font-semibold text-white hover:bg-teal-800 focus:outline-2 focus:outline-offset-2 focus:outline-teal-700 disabled:cursor-not-allowed disabled:opacity-60"
                  disabled={isSubmitting}
                  onClick={createProfile}
                  type="button"
                >
                  {isSubmitting ? 'กำลังบันทึกข้อมูล...' : 'บันทึกข้อมูล'}
                </button>
              )}
              {submitError && <p className="text-sm text-red-700" role="alert">{submitError}</p>}
            </div>
          </form>
        </section>
      )}
    </main>
  )
}
