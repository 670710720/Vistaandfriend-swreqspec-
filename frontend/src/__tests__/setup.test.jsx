// ทดสอบว่าเมนูโปรไฟล์เปิดแบบฟอร์มตาม AC-RMP-01
import { act, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, vi } from 'vitest'
import { fetchRoommateProfileStatus } from '../api/client.js'
import App, { redirectToLogin } from '../App.jsx'

vi.mock('../api/client.js', async (importOriginal) => ({
  ...await importOriginal(),
  fetchRoommateProfileStatus: vi.fn(),
}))

beforeEach(() => {
  fetchRoommateProfileStatus.mockResolvedValue(false)
})

afterEach(() => {
  vi.clearAllMocks()
})

test('test_AC_RMP_01_open_profile_form', async () => {
  render(<App />)
  await act(async () => {
    fireEvent.click(screen.getByRole('button', { name: 'สร้างโปรไฟล์หาเมท' }))
  })

  expect(screen.getByRole('heading', { name: 'สร้างโปรไฟล์หาเมท' })).toBeTruthy()
  expect(fetchRoommateProfileStatus).toHaveBeenCalledTimes(1)
})

test('test_AC_RMP_01A_does_not_open_form_when_profile_already_exists', async () => {
  fetchRoommateProfileStatus.mockResolvedValue(true)
  render(<App />)

  await act(async () => {
    fireEvent.click(screen.getByRole('button', { name: 'สร้างโปรไฟล์หาเมท' }))
  })

  expect(screen.queryByRole('heading', { name: 'สร้างโปรไฟล์หาเมท' })).toBeNull()
  expect(screen.getByRole('alert').textContent).toBe('ไม่สามารถสร้างโปรไฟล์ใหม่ได้')
})

test('test_AC_RMP_01A_redirects_unauthenticated_student_with_warning', () => {
  const showWarning = vi.fn()
  const navigate = vi.fn()
  render(
    <App
      initialLoggedIn={false}
      onLoginRequired={() => redirectToLogin({ showWarning, navigate })}
    />,
  )

  fireEvent.click(screen.getByRole('button', { name: 'สร้างโปรไฟล์หาเมท' }))

  expect(showWarning).toHaveBeenCalledWith('กรุณาเข้าสู่ระบบก่อนสร้างโปรไฟล์')
  expect(navigate).toHaveBeenCalledWith('/login')
})
