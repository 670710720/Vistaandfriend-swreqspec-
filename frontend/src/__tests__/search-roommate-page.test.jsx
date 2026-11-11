import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import App from '../App.jsx'
import SearchRoommatePage from '../pages/SearchRoommatePage.js'

beforeEach(() => {
  global.fetch = vi.fn().mockResolvedValue({
    ok: true,
    json: async () => [
      {
        user_id: 'user-2',
        name: 'น้องแอปเปิล',
        age: 21,
        gender: 'หญิง',
        faculty: 'วิศวกรรมศาสตร์',
        academic_year: '2',
        room_type: 'ห้องแยก',
        room_size: 2,
        is_open_for_search: true,
      },
    ],
  })
})

test('test_AC_SRS_01_search_page_renders_filters_and_submit_button', () => {
  render(<SearchRoommatePage currentUserId="user-1" />)

  expect(screen.getByRole('heading', { name: 'ค้นหาเมท' })).toBeTruthy()
  expect(screen.getByText('ผลการค้นหา')).toBeTruthy()
  expect(screen.getByRole('button', { name: 'ค้นหาเมท' })).toBeTruthy()
  expect(screen.getByLabelText('เพศ')).toBeTruthy()
})

test('test_AC_SRS_01_user_sees_search_menu_and_can_open_search_page', () => {
  render(<App />)

  expect(screen.getByRole('button', { name: 'ค้นหาเมท' })).toBeTruthy()

  fireEvent.click(screen.getByRole('button', { name: 'ค้นหาเมท' }))

  expect(screen.getByRole('heading', { name: 'ค้นหาเมท' })).toBeTruthy()
  expect(screen.getByText('ผลการค้นหา')).toBeTruthy()
})

test('test_AC_SRS_06_search_menu_is_hidden_when_not_logged_in', () => {
  render(<App initialLoggedIn={false} />)

  expect(screen.queryByRole('button', { name: 'ค้นหาเมท' })).toBeNull()
  expect(screen.getByText('กรุณาเข้าสู่ระบบก่อนใช้งานฟังก์ชันค้นหาเมท')).toBeTruthy()
})

test('test_AC_SRS_07_logged_in_user_without_roommate_profile_sees_guidance', () => {
  render(<SearchRoommatePage currentUserId="user-99" />)

  expect(screen.getByText('คุณยังไม่มีโปรไฟล์หาเมท')).toBeTruthy()
  expect(screen.getByRole('button', { name: 'สร้างโปรไฟล์หาเมท' })).toBeTruthy()
})

test('test_AC_SRS_02_form_tracks_all_search_filters_before_submit', () => {
  render(<SearchRoommatePage currentUserId="user-1" />)

  fireEvent.change(screen.getByLabelText('อายุ'), { target: { value: '22' } })
  fireEvent.change(screen.getByLabelText('เพศ'), { target: { value: 'หญิง' } })
  fireEvent.change(screen.getByLabelText('คณะ'), { target: { value: 'วิศวกรรมศาสตร์' } })
  fireEvent.change(screen.getByLabelText('ชั้นปี'), { target: { value: '2' } })
  fireEvent.change(screen.getByLabelText('พฤติกรรมการนอน'), { target: { value: 'กรน' } })
  fireEvent.change(screen.getByLabelText('โหมดค้นหา'), { target: { value: 'OR' } })

  expect(screen.getByLabelText('อายุ').value).toBe('22')
  expect(screen.getByLabelText('เพศ').value).toBe('หญิง')
  expect(screen.getByLabelText('คณะ').value).toBe('วิศวกรรมศาสตร์')
  expect(screen.getByLabelText('ชั้นปี').value).toBe('2')
  expect(screen.getByLabelText('พฤติกรรมการนอน').value).toBe('กรน')
  expect(screen.getByLabelText('โหมดค้นหา').value).toBe('OR')
})

test('test_AC_SRS_03D_search_form_tracks_roommate_preference_filters', () => {
  render(<SearchRoommatePage currentUserId="user-1" />)

  fireEvent.change(screen.getByLabelText('พฤติกรรมการนอน'), { target: { value: 'กรน' } })
  fireEvent.change(screen.getByLabelText('ความสะอาด'), { target: { value: 'สะอาด' } })
  fireEvent.change(screen.getByLabelText('เวลาเข้านอน'), { target: { value: '22:30' } })

  expect(screen.getByLabelText('พฤติกรรมการนอน').value).toBe('กรน')
  expect(screen.getByLabelText('ความสะอาด').value).toBe('สะอาด')
  expect(screen.getByLabelText('เวลาเข้านอน').value).toBe('22:30')
})

test('test_AC_SRS_05_search_page_shows_no_results_message_when_search_has_no_matches', async () => {
  global.fetch = vi.fn().mockResolvedValue({ ok: true, json: async () => [] })

  render(<SearchRoommatePage currentUserId="user-1" />)

  fireEvent.change(screen.getByLabelText('เพศ'), { target: { value: 'หญิง' } })
  fireEvent.click(screen.getByRole('button', { name: 'ค้นหาเมท' }))

  expect(await screen.findByText('ไม่พบผลการค้นหา')).toBeTruthy()
})

test('test_AC_SRS_03_search_page_displays_results_as_cards', async () => {
  render(<SearchRoommatePage currentUserId="user-1" />)

  fireEvent.change(screen.getByLabelText('เพศ'), { target: { value: 'หญิง' } })
  fireEvent.change(screen.getByLabelText('คณะ'), { target: { value: 'วิศวกรรมศาสตร์' } })
  fireEvent.click(screen.getByRole('button', { name: 'ค้นหาเมท' }))

  expect(await screen.findByText('น้องแอปเปิล')).toBeTruthy()
  expect(screen.getByText('อายุ 21 • หญิง • 2')).toBeTruthy()
})

test('test_AC_SRS_03_search_page_calls_api_and_displays_results', async () => {
  render(<SearchRoommatePage currentUserId="user-1" />)

  fireEvent.change(screen.getByLabelText('เพศ'), { target: { value: 'หญิง' } })
  fireEvent.change(screen.getByLabelText('คณะ'), { target: { value: 'วิศวกรรมศาสตร์' } })
  fireEvent.click(screen.getByRole('button', { name: 'ค้นหาเมท' }))

  await waitFor(() => {
    expect(global.fetch).toHaveBeenCalledTimes(1)
  })

  expect(global.fetch).toHaveBeenCalledWith(
    'http://localhost:8000/search-roommates',
    expect.objectContaining({
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    }),
  )

  expect(await screen.findByText('น้องแอปเปิล')).toBeTruthy()
})

test('test_AC_SRS_03E_search_page_resets_to_first_page_and_supports_pagination_controls', async () => {
  const pageOneResults = Array.from({ length: 20 }, (_, index) => ({
    user_id: `user-${index + 1}`,
    name: `ผู้ใช้ ${index + 1}`,
    age: 20 + index,
    gender: 'หญิง',
    faculty: 'วิศวกรรมศาสตร์',
    academic_year: '2',
    room_type: 'ห้องแยก',
    room_size: 2,
    is_open_for_search: true,
  }))
  const pageTwoResults = Array.from({ length: 2 }, (_, index) => ({
    user_id: `user-page-two-${index + 1}`,
    name: `ผู้ใช้หน้า 2 ${index + 1}`,
    age: 30 + index,
    gender: 'ชาย',
    faculty: 'แพทยศาสตร์',
    academic_year: '3',
    room_type: 'ห้องรวม',
    room_size: 4,
    is_open_for_search: true,
  }))

  global.fetch = vi
    .fn()
    .mockResolvedValueOnce({ ok: true, json: async () => pageOneResults })
    .mockResolvedValueOnce({ ok: true, json: async () => pageTwoResults })

  render(<SearchRoommatePage currentUserId="user-1" />)

  fireEvent.change(screen.getByLabelText('เพศ'), { target: { value: 'หญิง' } })
  fireEvent.click(screen.getByRole('button', { name: 'ค้นหาเมท' }))

  await waitFor(() => {
    expect(global.fetch).toHaveBeenCalledTimes(1)
  })

  expect(JSON.parse(global.fetch.mock.calls[0][1].body).page).toBe(1)
  expect(screen.getByRole('button', { name: 'ถัดไป' })).toBeTruthy()

  fireEvent.click(screen.getByRole('button', { name: 'ถัดไป' }))

  await waitFor(() => {
    expect(global.fetch).toHaveBeenCalledTimes(2)
  })

  expect(JSON.parse(global.fetch.mock.calls[1][1].body).page).toBe(2)
})
