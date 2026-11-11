import { fireEvent, render, screen, within } from '@testing-library/react'
import App from '../App.jsx'
import ProfileForm from '../components/ProfileForm.jsx'
import ProfileEditPage from '../pages/ProfileEditPage.jsx'
import ProfilePage from '../pages/ProfilePage.jsx'
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

test('test_F_001_profile_page_displays_social_channels', () => {
  const profile = {
    name: 'นักศึกษา A',
    faculty: 'วิศวกรรมศาสตร์',
    academicYear: '3',
    isSearchable: true,
    social: {
      Facebook: 'studenta',
      Instagram: 'studenta_ig',
      LINE: 'studenta.line',
      TikTok: 'studenta_tiktok',
    },
  }

  render(<ProfilePage profile={profile} />)

  expect(screen.getByText('Facebook')).toBeTruthy()
  expect(screen.getAllByText(/studenta/).length).toBeGreaterThan(0)
  expect(screen.getByText('Instagram')).toBeTruthy()
  expect(screen.getAllByText(/studenta_ig/).length).toBeGreaterThan(0)
  expect(screen.getByText('LINE')).toBeTruthy()
  expect(screen.getAllByText(/studenta\.line/).length).toBeGreaterThan(0)
  expect(screen.getByText('TikTok')).toBeTruthy()
  expect(screen.getAllByText(/studenta_tiktok/).length).toBeGreaterThan(0)
})

test('test_F_002_edit_success_returns_to_profile_page', () => {
  render(<App />)

  fireEvent.click(screen.getByRole('button', { name: 'แก้ไขโปรไฟล์' }))
  fireEvent.click(screen.getByRole('button', { name: 'บันทึกการแก้ไข' }))

  expect(screen.getByRole('heading', { name: 'โปรไฟล์ของฉัน' })).toBeTruthy()
  expect(screen.queryByRole('heading', { name: 'แก้ไขโปรไฟล์หาเมท' })).toBeNull()
})

// Given นักศึกษาเปิดดูโปรไฟล์หาเมทของตนเอง
// When นักศึกษาแก้ไขข้อมูลที่อนุญาตและพฤติกรรมการนอน
// Then ระบบรับข้อมูลที่นักศึกษาแก้ไข
test('test_TC_ERP_02_1_accepts_profile_edits', () => {
  const profile = {
    age: 22,
    faculty: 'วิศวกรรมศาสตร์',
    academicYear: '3',
    phone: '0812345678',
    roomType: 'airConditioned',
    occupants: 2,
    sleepBehaviors: ['กรน'],
    otherSleepBehavior: '',
    isSearchable: true,
  }

  render(<ProfileForm profile={profile} />)

  fireEvent.change(screen.getByDisplayValue('22'), { target: { value: '23' } })
  fireEvent.change(screen.getByDisplayValue('วิศวกรรมศาสตร์'), { target: { value: 'วิทยาศาสตร์' } })
  fireEvent.click(screen.getByLabelText('นอนดิ้น'))

  expect(screen.getByDisplayValue('23')).toBeTruthy()
  expect(screen.getByDisplayValue('วิทยาศาสตร์')).toBeTruthy()
  expect(screen.getByLabelText('นอนดิ้น').checked).toBe(true)
})

// Given นักศึกษาเปิดดูโปรไฟล์หาเมทของตนเอง
// When นักศึกษาแก้ไขอายุเป็น 18 ปีซึ่งเป็นค่าต่ำสุดที่อนุญาต และระบุพฤติกรรมการนอน
// Then ระบบรับข้อมูลที่นักศึกษาแก้ไข
test('test_TC_ERP_02_2_accepts_minimum_age_edit', () => {
  const profile = {
    age: 22,
    faculty: 'วิศวกรรมศาสตร์',
    academicYear: '3',
    phone: '0812345678',
    roomType: 'airConditioned',
    occupants: 2,
    sleepBehaviors: ['กรน'],
    otherSleepBehavior: '',
    isSearchable: true,
  }

  render(<ProfileForm profile={profile} />)

  fireEvent.change(screen.getByDisplayValue('22'), { target: { value: '18' } })
  fireEvent.click(screen.getByLabelText('นอนดิ้น'))

  expect(screen.getByDisplayValue('18')).toBeTruthy()
  expect(screen.getByLabelText('นอนดิ้น').checked).toBe(true)
})

// Given นักศึกษาเปิดดูโปรไฟล์หาเมทของนักศึกษาคนอื่น
// When นักศึกษาแก้ไขข้อมูลที่อนุญาตและพฤติกรรมการนอน
// Then ระบบปฏิเสธการแก้ไขโปรไฟล์ดังกล่าว (AC-ERP-05)
test('test_TC_ERP_02_3_rejects_other_profile_edit', () => {
  const profile = {
    age: 22,
    faculty: 'วิศวกรรมศาสตร์',
    academicYear: '3',
    phone: '0812345678',
    roomType: 'airConditioned',
    occupants: 2,
    sleepBehaviors: ['กรน'],
    otherSleepBehavior: '',
    isSearchable: true,
  }

  render(<ProfileForm profile={profile} />)

  fireEvent.change(screen.getByDisplayValue('22'), { target: { value: '23' } })
  fireEvent.click(screen.getByLabelText('นอนดิ้น'))

  expect(screen.getByDisplayValue('23')).toBeTruthy()
  expect(screen.getByLabelText('นอนดิ้น').checked).toBe(true)
})

// Given นักศึกษาเข้าสู่ระบบแล้วและมีโปรไฟล์หาเมท
// When นักศึกษาเลือกเมนู "โปรไฟล์"
// Then ระบบแสดงข้อมูลโปรไฟล์หาเมทปัจจุบัน
test('test_TC_ERP_01_1_shows_current_profile', () => {
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

  render(<ProfilePage profile={profile} />)

  expect(screen.getByText('โปรไฟล์ของฉัน')).toBeTruthy()
  expect(screen.getByText('นักศึกษา A')).toBeTruthy()
  expect(screen.getByText('วิศวกรรมศาสตร์')).toBeTruthy()
  expect(screen.getByText('3')).toBeTruthy()
  expect(screen.getByText('แสดงในผลการค้นหา')).toBeTruthy()
})

// Given นักศึกษาเข้าสู่ระบบแล้วและมีโปรไฟล์หาเมท 1 รายการ (ASM-ERP-02)
// When นักศึกษาเลือกเมนู "โปรไฟล์"
// Then ระบบแสดงข้อมูลโปรไฟล์หาเมทปัจจุบัน
test('test_TC_ERP_01_2_shows_single_current_profile', () => {
  const profile = {
    name: 'นักศึกษา B',
    age: 25,
    faculty: 'คณะเศรษฐศาสตร์',
    academicYear: '2',
    phone: '0998765432',
    roomType: 'fan',
    occupants: 3,
    sleepBehaviors: ['นอนดิ้น'],
    isSearchable: false,
  }

  render(<ProfilePage profile={profile} />)

  expect(screen.getByText('นักศึกษา B')).toBeTruthy()
  expect(screen.getByText('คณะเศรษฐศาสตร์')).toBeTruthy()
  expect(screen.getByText('2')).toBeTruthy()
  expect(screen.getByText('ไม่แสดงในผลการค้นหา')).toBeTruthy()
})

// Given นักศึกษาเข้าสู่ระบบแล้วแต่ยังไม่มีโปรไฟล์หาเมท
// When นักศึกษาเลือกเมนู "โปรไฟล์"
// Then ระบบแจ้งว่ายังไม่มีโปรไฟล์และพาไปยังหน้าสร้างโปรไฟล์หาเมท
test('test_TC_ERP_01_3_redirects_without_profile', () => {
  render(<App />)
  fireEvent.click(screen.getByRole('button', { name: 'สร้างโปรไฟล์หาเมท' }))

  expect(screen.getByRole('heading', { name: 'สร้างโปรไฟล์หาเมท' })).toBeTruthy()
  expect(screen.getByLabelText('ชื่อเล่น')).toBeTruthy()
})
