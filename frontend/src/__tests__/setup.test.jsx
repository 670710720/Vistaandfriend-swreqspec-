// ทดสอบว่าเมนูโปรไฟล์เปิดแบบฟอร์มตาม AC-RMP-01
import { render, screen } from '@testing-library/react'
import { fireEvent } from '@testing-library/react'
import App from '../App.jsx'

test('test_AC_RMP_01_open_profile_form', () => {
  render(<App />)
  fireEvent.click(screen.getByRole('button', { name: 'สร้างโปรไฟล์หาเมท' }))
  expect(screen.getByRole('heading', { name: 'สร้างโปรไฟล์หาเมท' })).toBeTruthy()
})
