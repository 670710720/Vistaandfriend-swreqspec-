import { act, fireEvent, render, screen, within } from '@testing-library/react'
import { vi } from 'vitest'
import { createRoommateProfile } from '../api/client.js'
import App from '../App.jsx'
import ProfileEditPage from '../pages/ProfileEditPage.jsx'
import ProfilePage from '../pages/ProfilePage.jsx'
import { validateProfile } from '../profileValidation.js'

vi.mock('../api/client.js', async (importOriginal) => ({
  ...await importOriginal(),
  createRoommateProfile: vi.fn(),
}))

afterEach(() => {
  vi.clearAllMocks()
})

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
  expect(screen.getByLabelText('อื่น ๆ').checked).toBe(false)

  fireEvent.click(screen.getByLabelText('อื่น ๆ'))
  expect(screen.getByLabelText('อื่น ๆ').checked).toBe(true)
  expect(screen.getByLabelText('ระบุพฤติกรรมการนอนเพิ่มเติม').required).toBe(true)
  fireEvent.change(screen.getByLabelText('ระบุพฤติกรรมการนอนเพิ่มเติม'), {
    target: { value: 'นอนละเมอ' },
  })
  expect(screen.getByLabelText('ระบุพฤติกรรมการนอนเพิ่มเติม').value).toBe('นอนละเมอ')
  expect(screen.getByLabelText('กรน').checked).toBe(true)

  fireEvent.click(screen.getByLabelText('ไม่มีพฤติกรรมดังกล่าว'))
  expect(screen.getByLabelText('ไม่มีพฤติกรรมดังกล่าว').checked).toBe(true)
  expect(screen.getByLabelText('กรน').checked).toBe(false)
  expect(screen.getByLabelText('อื่น ๆ').checked).toBe(false)

  fireEvent.click(screen.getByLabelText('กัดฟัน'))
  expect(screen.getByLabelText('กัดฟัน').checked).toBe(true)
  expect(screen.getByLabelText('ไม่มีพฤติกรรมดังกล่าว').checked).toBe(false)
})

// AC-RMP-02A: ค่าที่ผ่าน validation ต้องให้ดำเนินการยืนยันการสร้างโปรไฟล์ต่อได้
test('test_AC_RMP_02A_accept_valid_profile_values', () => {
  openProfileForm()
  fillValidProfile()
  fireEvent.click(screen.getByLabelText('อื่น ๆ'))
  fireEvent.change(screen.getByLabelText('ระบุพฤติกรรมการนอนเพิ่มเติม'), {
    target: { value: 'นอนละเมอ' },
  })
  fireEvent.click(screen.getByRole('button', { name: 'ตรวจสอบข้อมูล' }))

  expect(screen.getByRole('status').textContent).toContain('สามารถดำเนินการยืนยันการสร้างโปรไฟล์ได้')
})

// AC-RMP-05: ต้องส่งข้อมูลที่ตรวจผ่านไปยัง API และแสดงผลสำเร็จเมื่อ API ยืนยันการบันทึก
test('test_AC_RMP_05_submits_profile_and_shows_success_after_api_confirmation', async () => {
  createRoommateProfile.mockResolvedValue({ message: 'สร้างโปรไฟล์สำเร็จ' })
  openProfileForm()
  fillValidProfile()
  fireEvent.click(screen.getByRole('button', { name: 'ตรวจสอบข้อมูล' }))
  await act(async () => {
    fireEvent.click(screen.getByRole('button', { name: 'ยืนยันการสร้างโปรไฟล์' }))
  })

  expect(screen.getByRole('status').textContent).toBe('สร้างโปรไฟล์สำเร็จ')
  expect(createRoommateProfile).toHaveBeenCalledWith(
    expect.objectContaining({
      nickname: 'เมท',
      age: '18',
      gender: 'หญิง',
      faculty: 'วิทยาศาสตร์',
      academicYear: '1',
      phone: '0123456789',
      roomType: 'airConditioned',
      occupants: '1',
      sleepBehaviors: ['กรน'],
    }),
    expect.objectContaining({ name: 'profile.png', type: 'image/png' }),
  )
  expect(screen.queryByRole('button', { name: 'ยืนยันการสร้างโปรไฟล์' })).toBeNull()
})

// AC-RMP-02A: พฤติกรรมที่ไม่อยู่ในรายการหรือเลือกตัวเลือกพิเศษร่วมกันต้องไม่ผ่าน validation
test('test_AC_RMP_02A_rejects_invalid_sleep_behavior_selections', () => {
  const mixedNoneSelection = validateProfile(
    validProfileValues({ sleepBehaviors: ['ไม่มีพฤติกรรมดังกล่าว', 'กรน'] }),
  )
  const missingOtherDescription = validateProfile(
    validProfileValues({ sleepBehaviors: ['อื่น ๆ'] }),
  )

  expect(mixedNoneSelection.sleepBehaviors).toBe(
    'ไม่สามารถเลือก "ไม่มีพฤติกรรมดังกล่าว" ร่วมกับรายการอื่นได้',
  )
  expect(missingOtherDescription.otherSleepBehavior).toBe('กรุณาระบุพฤติกรรมการนอนเพิ่มเติม')
})

// AC-RMP-03: เมื่อเลือก "อื่น ๆ" แต่ไม่ระบุคำอธิบาย ต้องแจ้งให้กรอกและไม่แสดงผลสำเร็จ
test('test_AC_RMP_03_requires_other_sleep_description', () => {
  openProfileForm()
  fillValidProfile()
  fireEvent.click(screen.getByLabelText('อื่น ๆ'))
  fireEvent.click(screen.getByRole('button', { name: 'ตรวจสอบข้อมูล' }))

  expect(screen.getByText('กรุณาระบุพฤติกรรมการนอนเพิ่มเติม')).toBeTruthy()
  expect(screen.queryByRole('status')).toBeNull()
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

// AC-ERP-02A: ฟิลด์ชื่อและเพศต้องซ่อน/ปิดใช้งานในหน้าแก้ไขโปรไฟล์
test('test_AC_ERP_02A_edit_form_hides_locked_fields', () => {
  render(<App />)
  fireEvent.click(screen.getByRole('button', { name: 'แก้ไขโปรไฟล์' }))

  expect(screen.getByLabelText('อายุ')).toBeTruthy()
  expect(screen.queryByLabelText('ชื่อ')).toBeNull()
  expect(screen.queryByLabelText('เพศ')).toBeNull()
})

// AC-ERP-02B: เจ้าของโปรไฟล์ต้องเห็นและสลับสถานะเปิดให้ค้นหาได้
test('test_AC_ERP_02B_edit_form_shows_searchable_toggle_for_owner', () => {
  render(<App />)
  fireEvent.click(screen.getByRole('button', { name: 'แก้ไขโปรไฟล์' }))

  expect(screen.getByLabelText('เปิดให้ค้นหา')).toBeTruthy()
  expect(screen.getByLabelText('เปิดให้ค้นหา').checked).toBe(true)
})

// AC-ERP-03: ข้อมูลไม่ครบหรือไม่ถูกต้องต้องมีข้อความแจ้งเตือนและไม่บันทึกข้อมูลใหม่
test('test_AC_ERP_03_edit_page_shows_validation_warning_without_mutating_input', () => {
  const profile = {
    age: 22,
    faculty: 'วิศวกรรมศาสตร์',
    academicYear: '3',
    phone: '0812345678',
    roomType: 'airConditioned',
    occupants: 2,
    sleepBehaviors: ['กรน', 'นอนดิ้น'],
    isSearchable: true,
  }

  render(
    <ProfileEditPage
      profile={profile}
      validationErrors={{
        age: 'อายุต้องอยู่ระหว่าง 18–25 ปี',
        sleepBehaviors: 'กรุณาเลือกพฤติกรรมการนอนอย่างน้อยหนึ่งรายการ',
      }}
    />,
  )

  expect(screen.getByText('ข้อมูลไม่ครบหรือไม่ถูกต้อง')).toBeTruthy()
  expect(screen.getByText('อายุต้องอยู่ระหว่าง 18–25 ปี')).toBeTruthy()
  expect(screen.getByText('กรุณาเลือกพฤติกรรมการนอนอย่างน้อยหนึ่งรายการ')).toBeTruthy()
  expect(screen.getByDisplayValue('22')).toBeTruthy()
})

// AC-ERP-04A: การบันทึกล้มเหลวต้องคงข้อมูลเดิมไว้และแจ้งให้ลองใหม่
test('test_AC_ERP_04A_edit_page_keeps_original_values_when_save_fails', () => {
  const profile = {
    age: 22,
    faculty: 'วิศวกรรมศาสตร์',
    academicYear: '3',
    phone: '0812345678',
    roomType: 'airConditioned',
    occupants: 2,
    sleepBehaviors: ['กรน', 'นอนดิ้น'],
    isSearchable: true,
  }

  render(
    <ProfileEditPage
      profile={profile}
      saveError="การบันทึกข้อมูลล้มเหลว กรุณาลองใหม่"
    />,
  )

  expect(screen.getByText('การบันทึกข้อมูลล้มเหลว กรุณาลองใหม่')).toBeTruthy()
  expect(screen.getByDisplayValue('22')).toBeTruthy()
  expect(screen.getByDisplayValue('0812345678')).toBeTruthy()
})

// AC-ERP-04: บันทึกสำเร็จต้องแสดงข้อความยืนยันและอัปเดตสถานะหน้าจอ
test('test_AC_ERP_04_edit_page_shows_success_message_after_save', () => {
  const profile = {
    name: 'นักศึกษา A',
    age: 22,
    faculty: 'วิศวกรรมศาสตร์',
    academicYear: '3',
    phone: '0812345678',
    roomType: 'airConditioned',
    occupants: 2,
    sleepBehaviors: ['กรน'],
    isSearchable: true,
  }

  render(
    <ProfileEditPage
      profile={profile}
      saveSuccess
    />,
  )

  expect(screen.getByText('แก้ไขโปรไฟล์สำเร็จ')).toBeTruthy()
  expect(screen.getByText('ข้อมูลโปรไฟล์ของคุณถูกบันทึกและพร้อมแสดงผลตามสถานะเปิดให้ค้นหา')).toBeTruthy()
})

// AC-ERP-07 และ AC-ERP-07A: หน้าโปรไฟล์ต้องสะท้อนสถานะเปิดให้ค้นหาแบบทันที
test('test_AC_ERP_07_profile_page_reflects_latest_search_visibility_status', () => {
  const baseProfile = {
    name: 'นักศึกษา A',
    age: 22,
    faculty: 'วิศวกรรมศาสตร์',
    academicYear: '3',
    phone: '0812345678',
    roomType: 'airConditioned',
    occupants: 2,
    sleepBehaviors: ['กรน'],
    isSearchable: true,
  }

  const { rerender } = render(<ProfilePage profile={baseProfile} />)
  expect(screen.getByText('แสดงในผลการค้นหา')).toBeTruthy()

  rerender(<ProfilePage profile={{ ...baseProfile, isSearchable: false }} />)
  expect(screen.getByText('ไม่แสดงในผลการค้นหา')).toBeTruthy()
})
