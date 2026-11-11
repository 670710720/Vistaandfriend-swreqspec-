import { useState } from 'react'
import { PROFILE_CONFIG } from './config.js'
import ProfileEditPage from './pages/ProfileEditPage.jsx'
import ProfilePage from './pages/ProfilePage.jsx'
import { validateProfile } from './profileValidation.js'

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

// รองรับ FR-RMP-01, FR-RMP-02 และ AC-RMP-01
export default function App() {
  const [formOpen, setFormOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [profileViewOpen, setProfileViewOpen] = useState(false)
  const [values, setValues] = useState(initialValues)
  const [errors, setErrors] = useState({})
  const [valid, setValid] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [profile, setProfile] = useState({
    name: 'นักศึกษา A',
    age: 22,
    faculty: 'วิศวกรรมศาสตร์',
    academicYear: '3',
    phone: '0812345678',
    roomType: 'airConditioned',
    occupants: 2,
    sleepBehaviors: ['กรน', 'นอนดิ้น'],
    otherSleepBehavior: '',
    isSearchable: true,
    social: {
      Facebook: 'studenta',
      Instagram: 'studenta_ig',
      LINE: 'studenta.line',
      TikTok: 'studenta_tiktok',
    },
  })

  function update(field, value) {
    setValues((current) => ({ ...current, [field]: value }))
    setValid(false)
  }

  function toggleSleepBehavior(behavior) {
    setValues((current) => {
      const selected = current.sleepBehaviors.includes(behavior)
      const sleepBehaviors = selected
        ? current.sleepBehaviors.filter((item) => item !== behavior)
        : [...current.sleepBehaviors, behavior]
      return { ...current, sleepBehaviors }
    })
    setValid(false)
  }

  function validate(event) {
    event.preventDefault()
    const nextErrors = validateProfile(values)
    setErrors(nextErrors)
    setValid(Object.keys(nextErrors).length === 0)
  }

  const occupants = values.roomType
    ? PROFILE_CONFIG.roomOccupants[values.roomType]
    : null

  return (
    <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <header className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-wide text-teal-800">
          Vista & Friend
        </p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900">โปรไฟล์หาเมท</h1>
      </header>

      <nav aria-label="เมนูโปรไฟล์" className="mb-6 flex gap-3">
        <button
          className="rounded-lg bg-teal-700 px-5 py-3 font-semibold text-white hover:bg-teal-800 focus:outline-2 focus:outline-offset-2 focus:outline-teal-700"
          onClick={() => {
            setFormOpen(true)
            setEditOpen(false)
            setProfileViewOpen(false)
          }}
          type="button"
        >
          สร้างโปรไฟล์หาเมท
        </button>
        <button
          className="rounded-lg border border-slate-300 bg-white px-5 py-3 font-semibold text-slate-800 hover:bg-slate-50"
          onClick={() => {
            setEditOpen(true)
            setFormOpen(false)
            setProfileViewOpen(false)
            setSaveSuccess(false)
          }}
          type="button"
        >
          แก้ไขโปรไฟล์
        </button>
      </nav>

      {profileViewOpen && <ProfilePage profile={profile} successMessage={saveSuccess ? 'แก้ไขโปรไฟล์สำเร็จ' : undefined} />}

      {editOpen && (
        <ProfileEditPage
          onSave={() => {
            setEditOpen(false)
            setProfileViewOpen(true)
            setSaveSuccess(true)
          }}
          profile={profile}
        />
      )}

      {formOpen && (
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
              {values.sleepBehaviors.includes('อื่น ๆ') && (
                <label className="mt-4 block text-sm font-medium text-slate-800">
                  ระบุพฤติกรรมการนอนเพิ่มเติม
                  <input
                    className="mt-2 block w-full rounded-lg border border-slate-300 px-3 py-2.5"
                    onChange={(event) => update('otherSleepBehavior', event.target.value)}
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
                      onChange={(event) => setValues((current) => ({
                        ...current,
                        social: { ...current.social, [channel]: event.target.value },
                      }))}
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
            </div>
          </form>
        </section>
      )}
    </main>
  )
}
