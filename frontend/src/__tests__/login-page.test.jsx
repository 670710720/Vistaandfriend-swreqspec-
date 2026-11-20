import { afterEach, beforeEach, expect, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { DEMO_USER_SESSION_KEY, fetchRoommateProfileStatus } from '../api/client.js'
import App from '../App.jsx'
import LoginPage from '../pages/LoginPage.jsx'

vi.mock('../api/client.js', async (importOriginal) => ({
  ...await importOriginal(),
  fetchRoommateProfileStatus: vi.fn(),
}))

beforeEach(() => {
  window.history.replaceState({}, '', '/login')
  window.sessionStorage.clear()
})

afterEach(() => {
  window.history.replaceState({}, '', '/')
  window.sessionStorage.clear()
  vi.clearAllMocks()
})

test('test_Q04_login_page_is_rendered_at_login_route', () => {
  render(<App />)

  expect(screen.getByRole('heading', { name: 'เข้าสู่ระบบ' })).toBeTruthy()
  expect(screen.getByLabelText('ชื่อผู้ใช้').required).toBe(true)
  expect(screen.getByLabelText('รหัสผ่าน').required).toBe(true)
  expect(fetchRoommateProfileStatus).not.toHaveBeenCalled()
})

test('test_Q04_demo_login_accepts_nonempty_credentials', () => {
  const navigate = vi.fn()
  render(<LoginPage navigate={navigate} />)

  fireEvent.change(screen.getByLabelText('ชื่อผู้ใช้'), {
    target: { value: '  demo-student  ' },
  })
  fireEvent.change(screen.getByLabelText('รหัสผ่าน'), {
    target: { value: 'fake-password' },
  })
  fireEvent.submit(screen.getByRole('form', { name: 'เข้าสู่ระบบ' }))

  expect(window.sessionStorage.getItem(DEMO_USER_SESSION_KEY)).toBe('demo-student')
  expect(window.sessionStorage.length).toBe(1)
  expect(navigate).toHaveBeenCalledWith('/')
})

test('test_Q04_demo_login_does_not_accept_empty_credentials', () => {
  const navigate = vi.fn()
  render(<LoginPage navigate={navigate} />)

  fireEvent.submit(screen.getByRole('form', { name: 'เข้าสู่ระบบ' }))

  expect(window.sessionStorage.getItem(DEMO_USER_SESSION_KEY)).toBeNull()
  expect(navigate).not.toHaveBeenCalled()
})
