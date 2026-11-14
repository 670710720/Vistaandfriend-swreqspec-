import { render, screen } from '@testing-library/react'
import ProfileDetailPage from '../pages/ProfileDetailPage.js'

test('test_AC_SRS_04_profile_detail_page_shows_allowed_information_only', () => {
  const profile = {
    user_id: 'user-2',
    name: 'น้องแอปเปิล',
    age: 21,
    gender: 'หญิง',
    faculty: 'วิศวกรรมศาสตร์',
    academic_year: '2',
    room_type: 'ห้องแยก',
    room_size: 2,
    is_open_for_search: true,
    social_links: {
      Facebook: 'fb-user-2',
      Instagram: 'ig-user-2',
    },
    phone_number: '0998765432',
  }

  render(<ProfileDetailPage profile={profile} />)

  expect(screen.getByRole('heading', { name: 'รายละเอียดโปรไฟล์' })).toBeTruthy()
  expect(screen.getByRole('heading', { name: 'น้องแอปเปิล' })).toBeTruthy()
  expect(screen.getByText('วิศวกรรมศาสตร์')).toBeTruthy()
  expect(screen.getByText('Facebook: fb-user-2')).toBeTruthy()
  expect(screen.getByText('Instagram: ig-user-2')).toBeTruthy()
  expect(screen.queryByText('0998765432')).toBeNull()
  expect(screen.getByText('ข้อมูลที่ไม่เปิดเผย: เบอร์โทรศัพท์')).toBeTruthy()
})

test('test_TC_SRS_04_1_opens_profile_without_phone', () => {
  // Given ระบบแสดงรายการผลการค้นหาและมีโปรไฟล์ที่สนใจพร้อมเบอร์โทรศัพท์และโซเชียลที่เจ้าของบันทึก
  const profile = {
    user_id: 'user-2',
    name: 'น้องแอปเปิล',
    age: 21,
    gender: 'หญิง',
    faculty: 'วิศวกรรมศาสตร์',
    academic_year: '2',
    room_type: 'ห้องแยก',
    room_size: 2,
    is_open_for_search: true,
    social_links: {
      Facebook: 'fb-user-2',
      Instagram: 'ig-user-2',
    },
    phone_number: '0998765432',
  }

  // When นักศึกษาเลือกโปรไฟล์ดังกล่าว
  render(<ProfileDetailPage profile={profile} />)

  // Then ระบบเปิดโปรไฟล์ของนักศึกษาที่เลือก; ระบบไม่แสดงเบอร์โทรศัพท์; ระบบแสดงโซเชียลที่เจ้าของบันทึกไว้
  expect(screen.getByRole('heading', { name: 'รายละเอียดโปรไฟล์' })).toBeTruthy()
  expect(screen.getByRole('heading', { name: 'น้องแอปเปิล' })).toBeTruthy()
  expect(screen.queryByText('0998765432')).toBeNull()
  expect(screen.getByText('Facebook: fb-user-2')).toBeTruthy()
  expect(screen.getByText('Instagram: ig-user-2')).toBeTruthy()
})

test('test_TC_SRS_04_2_shows_saved_social_channel', () => {
  // Given ระบบแสดงผลการค้นหาและโปรไฟล์ที่เลือกมีโซเชียลที่เจ้าของบันทึกไว้เพียง 1 ช่องทาง
  const profile = {
    user_id: 'user-4',
    name: 'เบลล่า',
    age: 20,
    gender: 'หญิง',
    faculty: 'วิทยาศาสตร์',
    academic_year: '1',
    room_type: 'ห้องแยก',
    room_size: 1,
    is_open_for_search: true,
    social_links: {
      LINE: 'line-user-4',
    },
    phone_number: '0834567890',
  }

  // When นักศึกษาเลือกโปรไฟล์ดังกล่าว
  render(<ProfileDetailPage profile={profile} />)

  // Then ระบบเปิดโปรไฟล์; ระบบไม่แสดงเบอร์โทรศัพท์; ระบบแสดงโซเชียลช่องทางที่บันทึกไว้
  expect(screen.getByRole('heading', { name: 'รายละเอียดโปรไฟล์' })).toBeTruthy()
  expect(screen.getByRole('heading', { name: 'เบลล่า' })).toBeTruthy()
  expect(screen.queryByText('0834567890')).toBeNull()
  expect(screen.getByText('LINE: line-user-4')).toBeTruthy()
})
