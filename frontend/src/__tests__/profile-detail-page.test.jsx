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
