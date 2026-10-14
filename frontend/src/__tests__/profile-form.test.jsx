import { fireEvent, render, screen, within } from '@testing-library/react'
import App from '../App.jsx'
import { validateProfile } from '../profileValidation.js'

function openProfileForm() {
  render(<App />)
  fireEvent.click(screen.getByRole('button', { name: 'สร้างโปรไฟล์หาเมท' }))
}

function fillValidProfile() {
  fireEvent.change(screen.getByLabelText('ชื่อเล่น'), { target: { value: 'เมท' } })
  fireEvent.change(screen.getByLabelText('อายุ'), { target: { value: '18' } })
  fireEvent.change(screen.getByLabelText('เพศ'), { target: { value: 'หญิง' } })
  fireEvent.change(screen.getByLabelText('คณะ'), { target: { value: 'วิทยาศาสตร์' } })
  fireEvent.change(screen.getByLabelText('ชั้นปี'), { target: { value: '1' } })
  fireEvent.change(screen.getByLabelText('เบอร์โทรศัพท์'), { target: { value: '0123456789' } })
  fireEvent.change(screen.getByLabelText(/รูปโปรไฟล์/), {
    target: { files: [new File(['image'], 'profile.png', { type: 'image/png' })] },
  })
  fireEvent.change(screen.getByLabelText('รูปแบบห้อง'), { target: { value: 'airConditioned' } })
  fireEvent.change(screen.getByLabelText('จำนวนผู้พัก'), { target: { value: '1' } })
  fireEvent.click(screen.getByLabelText('กรน'))
}

function validProfileValues(overrides = {}) {
  return {
    nickname: 'เมท',
    age: '18',
    gender: 'หญิง',
    faculty: 'วิทยาศาสตร์',
    academicYear: '1',
    profileImage: new File(['image'], 'profile.png', { type: 'image/png' }),
    phone: '0123456789',
    roomType: 'airConditioned',
    occupants: '1',
    sleepBehaviors: ['กรน'],
    otherSleepBehavior: '',
    ...overrides,
  }
}

// AC-RMP-02: แบบฟอร์มต้องรับข้อมูลโปรไฟล์และพฤติกรรมการนอนของผู้สร้าง
test('test_AC_RMP_02_profile_form_accepts_required_fields_and_sleep_behavior', () => {
  openProfileForm()
  fillValidProfile()

  expect(screen.getByLabelText('ชื่อเล่น').value).toBe('เมท')
  expect(screen.getByLabelText('อายุ').value).toBe('18')
  expect(screen.getByLabelText('เพศ').value).toBe('หญิง')
  expect(screen.getByLabelText('คณะ').value).toBe('วิทยาศาสตร์')
  expect(screen.getByLabelText('ชั้นปี').value).toBe('1')
  expect(screen.getByLabelText(/รูปโปรไฟล์/).files[0].name).toBe('profile.png')
  expect(screen.getByLabelText('เบอร์โทรศัพท์').value).toBe('0123456789')
  expect(screen.getByLabelText('รูปแบบห้อง').value).toBe('airConditioned')
  expect(screen.getByLabelText('จำนวนผู้พัก').value).toBe('1')
  expect(screen.getByLabelText('กรน').checked).toBe(true)
})

// AC-RMP-02A: ค่าที่ผ่าน validation ต้องให้ดำเนินการยืนยันการสร้างโปรไฟล์ต่อได้
test('test_AC_RMP_02A_accept_valid_profile_values', () => {
  openProfileForm()
  fillValidProfile()
  fireEvent.click(screen.getByRole('button', { name: 'ตรวจสอบข้อมูล' }))

  expect(screen.getByRole('status').textContent).toContain('สามารถดำเนินการยืนยันการสร้างโปรไฟล์ได้')
})

// AC-RMP-03: เมื่อข้อมูลจำเป็นไม่ครบ ต้องแจ้งให้กรอกและไม่แสดงผลสำเร็จ
test('test_AC_RMP_03_requires_missing_profile_fields', () => {
  openProfileForm()
  fireEvent.click(screen.getByRole('button', { name: 'ตรวจสอบข้อมูล' }))

  expect(screen.getAllByRole('alert').length).toBeGreaterThan(0)
  expect(screen.queryByRole('status')).toBeNull()
})

// AC-RMP-04 และ AC-RMP-04A: ข้อมูลไม่ถูกต้องหรือจำนวนคนไม่เข้ากับชนิดห้องต้องไม่ผ่าน
test('test_AC_RMP_04_and_04A_reject_invalid_profile_values', () => {
  openProfileForm()
  fillValidProfile()
  fireEvent.change(screen.getByLabelText('อายุ'), { target: { value: '17' } })
  fireEvent.change(screen.getByLabelText('เบอร์โทรศัพท์'), { target: { value: '123' } })
  fireEvent.change(screen.getByLabelText('รูปแบบห้อง'), { target: { value: 'fan' } })

  const occupants = screen.getByLabelText('จำนวนผู้พัก')
  const optionValues = within(occupants).getAllByRole('option').map((option) => option.value)
  expect(optionValues).not.toContain('4')

  fireEvent.click(screen.getByRole('button', { name: 'ตรวจสอบข้อมูล' }))
  expect(screen.getByText('อายุต้องอยู่ระหว่าง 18–25 ปี')).toBeTruthy()
  expect(screen.getByText('เบอร์โทรศัพท์ต้องมีตัวเลข 10 หลัก')).toBeTruthy()
  expect(screen.queryByRole('status')).toBeNull()
})

// TC-RMP-04A-1: จำนวนผู้พักที่ไม่สอดคล้องกับชนิดห้องต้องถูกปฏิเสธ
test('test_TC_RMP_04A_1_rejects_fan_room_over_capacity', () => {
  const errors = validateProfile(validProfileValues({ roomType: 'fan', occupants: '4' }))

  expect(errors.occupants).toBe('จำนวนผู้พักไม่สอดคล้องกับรูปแบบห้อง')
})

// TC-RMP-04A-2: ยอมรับจำนวนผู้พักที่ขอบบนของห้องพัดลม
test('test_TC_RMP_04A_2_accepts_fan_room_capacity_limit', () => {
  openProfileForm()
  fillValidProfile()
  fireEvent.change(screen.getByLabelText('รูปแบบห้อง'), { target: { value: 'fan' } })
  fireEvent.change(screen.getByLabelText('จำนวนผู้พัก'), { target: { value: '3' } })
  fireEvent.click(screen.getByRole('button', { name: 'ตรวจสอบข้อมูล' }))

  expect(screen.getByRole('status').textContent).toContain('สามารถดำเนินการยืนยันการสร้างโปรไฟล์ได้')
})

// TC-RMP-04A-3: จำนวนผู้พักต่ำกว่าขอบล่างของห้องพัดลมต้องถูกปฏิเสธ
test('test_TC_RMP_04A_3_rejects_fan_room_below_capacity', () => {
  const errors = validateProfile(validProfileValues({ roomType: 'fan', occupants: '0' }))

  expect(errors.occupants).toBe('จำนวนผู้พักไม่สอดคล้องกับรูปแบบห้อง')
})
