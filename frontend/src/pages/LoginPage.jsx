import { useState } from 'react'
import { DEMO_USER_SESSION_KEY } from '../api/client.js'

// รองรับ CON-AUTH-01, Q-04 และ ASM-05
export default function LoginPage({
  navigate = (path) => window.location.assign(path),
} = {}) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  function submit(event) {
    event.preventDefault()
    const normalizedUsername = username.trim()
    if (!normalizedUsername || !password) return

    window.sessionStorage.setItem(DEMO_USER_SESSION_KEY, normalizedUsername)
    navigate('/')
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10">
      <section className="w-full max-w-md rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
        <h1 className="mb-2 text-3xl font-bold text-slate-900">เข้าสู่ระบบ</h1>
        <p className="mb-6 text-sm text-slate-600">
          ใช้ชื่อผู้ใช้และรหัสผ่านใดก็ได้ที่ไม่ว่างสำหรับการทดลองในเครื่อง
        </p>
        <form aria-label="เข้าสู่ระบบ" className="space-y-5" onSubmit={submit}>
          <label className="block text-sm font-medium text-slate-800">
            ชื่อผู้ใช้
            <input
              autoComplete="username"
              className="mt-2 block w-full rounded-lg border border-slate-300 px-3 py-2.5"
              name="username"
              onChange={(event) => setUsername(event.target.value)}
              required
              value={username}
            />
          </label>
          <label className="block text-sm font-medium text-slate-800">
            รหัสผ่าน
            <input
              autoComplete="current-password"
              className="mt-2 block w-full rounded-lg border border-slate-300 px-3 py-2.5"
              name="password"
              onChange={(event) => setPassword(event.target.value)}
              required
              type="password"
              value={password}
            />
          </label>
          <button
            className="w-full rounded-lg bg-teal-700 px-5 py-3 font-semibold text-white hover:bg-teal-800"
            type="submit"
          >
            เข้าสู่ระบบ
          </button>
        </form>
      </section>
    </main>
  )
}
