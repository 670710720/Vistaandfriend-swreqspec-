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

test('test_TC_SRS_03D_1_uses_owner_preferences_for_filters', async () => {
  // Given นักศึกษาระบุพฤติกรรมการนอน ความสะอาด และเวลาเข้านอนเป็นตัวกรอง; โปรไฟล์ผู้สมัครมีข้อมูลโปรไฟล์และความต้องการที่ต่างกัน
  render(<SearchRoommatePage currentUserId="user-1" />)
  fireEvent.change(screen.getByLabelText('พฤติกรรมการนอน'), { target: { value: 'กรน' } })
  fireEvent.change(screen.getByLabelText('ความสะอาด'), { target: { value: 'สะอาด' } })
  fireEvent.change(screen.getByLabelText('เวลาเข้านอน'), { target: { value: '22:30' } })

  // When นักศึกษากดค้นหา
  fireEvent.click(screen.getByRole('button', { name: 'ค้นหาเมท' }))

  // Then ระบบเปรียบเทียบตัวกรองทั้งสามกับข้อมูลความต้องการหาเมทของเจ้าของโปรไฟล์
  expect(screen.getByLabelText('พฤติกรรมการนอน').value).toBe('กรน')
  expect(screen.getByLabelText('ความสะอาด').value).toBe('สะอาด')
  expect(screen.getByLabelText('เวลาเข้านอน').value).toBe('22:30')
  await waitFor(() => {
    expect(global.fetch).toHaveBeenCalledTimes(1)
  })
  expect(JSON.parse(global.fetch.mock.calls[0][1].body).filters).toEqual({
    sleep_behavior: 'กรน',
    cleanliness: 'สะอาด',
    sleep_time: '22:30',
  })
})

test('test_TC_SRS_03D_2_uses_preference_data_for_single_filter', async () => {
  // Given นักศึกษาระบุพฤติกรรมการนอนเป็นตัวกรองเพียง 1 รายการ; ข้อมูลพฤติกรรมในโปรไฟล์เจ้าของต่างจากข้อมูลความต้องการของเจ้าของ
  render(<SearchRoommatePage currentUserId="user-1" />)
  fireEvent.change(screen.getByLabelText('พฤติกรรมการนอน'), { target: { value: 'กรน' } })

  // When นักศึกษากดค้นหา
  fireEvent.click(screen.getByRole('button', { name: 'ค้นหาเมท' }))

  // Then ระบบเปรียบเทียบตัวกรองกับข้อมูลความต้องการหาเมทของเจ้าของโปรไฟล์ ไม่ใช้พฤติกรรมในข้อมูลโปรไฟล์แทน
  expect(screen.getByLabelText('พฤติกรรมการนอน').value).toBe('กรน')
  expect(await screen.findByText('น้องแอปเปิล')).toBeTruthy()
  await waitFor(() => {
    expect(global.fetch).toHaveBeenCalledTimes(1)
  })
  expect(JSON.parse(global.fetch.mock.calls[0][1].body).filters).toEqual({
    sleep_behavior: 'กรน',
  })
})

test('test_TC_SRS_03D_3_uses_profile_data_for_age_filter', async () => {
  // Given นักศึกษาระบุเฉพาะตัวกรองอายุจากข้อมูลโปรไฟล์ ไม่ได้ระบุพฤติกรรมการนอน ความสะอาด หรือเวลาเข้านอน
  render(<SearchRoommatePage currentUserId="user-1" />)
  fireEvent.change(screen.getByLabelText('อายุ'), { target: { value: '21' } })

  // When นักศึกษากดค้นหา
  fireEvent.click(screen.getByRole('button', { name: 'ค้นหาเมท' }))

  // Then ระบบเปรียบเทียบตัวกรองอายุกับข้อมูลโปรไฟล์ของเจ้าของ (กติกาแหล่งข้อมูลตัวกรองใน spec)
  expect(screen.getByLabelText('อายุ').value).toBe('21')
  expect(await screen.findByText('น้องแอปเปิล')).toBeTruthy()
  await waitFor(() => {
    expect(global.fetch).toHaveBeenCalledTimes(1)
  })
  expect(JSON.parse(global.fetch.mock.calls[0][1].body).filters).toEqual({ age: '21' })
})

test('test_AC_SRS_05_search_page_shows_no_results_message_when_search_has_no_matches', async () => {
  global.fetch = vi.fn().mockResolvedValue({ ok: true, json: async () => [] })

  render(<SearchRoommatePage currentUserId="user-1" />)

  fireEvent.change(screen.getByLabelText('เพศ'), { target: { value: 'หญิง' } })
  fireEvent.click(screen.getByRole('button', { name: 'ค้นหาเมท' }))

  expect(await screen.findByText('ไม่พบผลการค้นหา')).toBeTruthy()
})

test('test_TC_SRS_05_1_shows_no_results_message', async () => {
  // Given ไม่มีนักศึกษาที่ตรงตามเงื่อนไขที่ระบุ
  global.fetch = vi.fn().mockResolvedValue({ ok: true, json: async () => [] })
  render(<SearchRoommatePage currentUserId="user-1" />)

  // When นักศึกษากดค้นหา
  fireEvent.change(screen.getByLabelText('เพศ'), { target: { value: 'หญิง' } })
  fireEvent.click(screen.getByRole('button', { name: 'ค้นหาเมท' }))

  // Then ระบบแสดงข้อความว่าไม่พบผลการค้นหา
  expect(await screen.findByText('ไม่พบผลการค้นหา')).toBeTruthy()
})

test('test_TC_SRS_05_2_shows_no_results_for_near_match', async () => {
  // Given มีโปรไฟล์ผู้สมัครที่แตกต่างจากเงื่อนไขที่ค้นหาเพียง 1 ค่า จึงไม่มีผู้ใดตรงตามเงื่อนไขทั้งหมด
  global.fetch = vi.fn().mockResolvedValue({ ok: true, json: async () => [] })
  render(<SearchRoommatePage currentUserId="user-1" />)

  // When นักศึกษากดค้นหา
  fireEvent.change(screen.getByLabelText('เพศ'), { target: { value: 'หญิง' } })
  fireEvent.click(screen.getByRole('button', { name: 'ค้นหาเมท' }))

  // Then ระบบแสดงข้อความว่าไม่พบผลการค้นหา
  expect(await screen.findByText('ไม่พบผลการค้นหา')).toBeTruthy()
})

test('test_TC_SRS_05_3_displays_single_matching_result', async () => {
  // Given มีนักศึกษา 1 คนที่ตรงตามเงื่อนไขที่ระบุ
  global.fetch = vi.fn().mockResolvedValue({
    ok: true,
    json: async () => [{
      user_id: 'user-2',
      name: 'โปรไฟล์ที่ตรง',
      age: 21,
      gender: 'หญิง',
      faculty: 'วิศวกรรมศาสตร์',
      academic_year: '2',
      room_type: 'ห้องแยก',
      room_size: 2,
      is_open_for_search: true,
    }],
  })
  render(<SearchRoommatePage currentUserId="user-1" />)

  // When นักศึกษากดค้นหา
  fireEvent.change(screen.getByLabelText('เพศ'), { target: { value: 'หญิง' } })
  fireEvent.click(screen.getByRole('button', { name: 'ค้นหาเมท' }))

  // Then ระบบแสดงโปรไฟล์ที่ตรงตามเงื่อนไข (AC-SRS-03)
  expect(await screen.findByText('โปรไฟล์ที่ตรง')).toBeTruthy()
  // ไม่ assert ข้อความไม่พบผล เพราะ spec ไม่ได้กำหนดพฤติกรรมสำหรับกรณีที่มีผลลัพธ์
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

test('test_TC_SRS_03E_1_new_search_starts_page_one', async () => {
  // Given นักศึกษาอยู่หน้าผลการค้นหาหน้า 3 และมีผลลัพธ์อย่างน้อย 20 รายการสำหรับคำค้นหาใหม่
  const results = (prefix) => Array.from({ length: 20 }, (_, index) => ({
    user_id: `${prefix}-${index}`,
    name: `${prefix} นักศึกษา ${index}`,
    age: 20,
    gender: 'หญิง',
    faculty: 'วิศวกรรมศาสตร์',
    academic_year: '2',
    room_type: 'ห้องแยก',
    room_size: 2,
    is_open_for_search: true,
  }))
  global.fetch = vi.fn()
    .mockResolvedValueOnce({ ok: true, json: async () => results('page-1') })
    .mockResolvedValueOnce({ ok: true, json: async () => results('page-2') })
    .mockResolvedValueOnce({ ok: true, json: async () => results('page-3') })
    .mockResolvedValueOnce({ ok: true, json: async () => results('new-search') })

  render(<SearchRoommatePage currentUserId="user-1" />)
  fireEvent.click(screen.getByRole('button', { name: 'ค้นหาเมท' }))
  await screen.findByText('หน้า 1')
  fireEvent.click(screen.getByRole('button', { name: 'ถัดไป' }))
  await screen.findByText('หน้า 2')
  fireEvent.click(screen.getByRole('button', { name: 'ถัดไป' }))
  await screen.findByText('หน้า 3')

  // When นักศึกษาแก้ไขตัวกรองและส่งคำค้นหาใหม่
  fireEvent.change(screen.getByLabelText('เพศ'), { target: { value: 'หญิง' } })
  fireEvent.click(screen.getByRole('button', { name: 'ค้นหาเมท' }))

  // Then ระบบเริ่มแสดงผลลัพธ์ที่หน้า 1; ระบบแสดงหน้าละ 20 รายการ
  await waitFor(() => {
    expect(global.fetch).toHaveBeenCalledTimes(4)
  })
  expect(JSON.parse(global.fetch.mock.calls[3][1].body).page).toBe(1)
  expect(screen.getByText('หน้า 1')).toBeTruthy()
  expect(screen.getAllByRole('listitem')).toHaveLength(20)
  expect(screen.getByText('new-search นักศึกษา 0')).toBeTruthy()
})

test('test_TC_SRS_03E_2_displays_exactly_20_results_on_page_one', async () => {
  // Given นักศึกษาส่งคำค้นหาใหม่ที่มีผลลัพธ์ตรงทั้งหมด 20 รายการ
  const results = Array.from({ length: 20 }, (_, index) => ({
    user_id: `exact-${index}`,
    name: `ผลลัพธ์ ${index}`,
    age: 20,
    gender: 'หญิง',
    faculty: 'วิศวกรรมศาสตร์',
    academic_year: '2',
    room_type: 'ห้องแยก',
    room_size: 2,
    is_open_for_search: true,
  }))
  global.fetch = vi.fn().mockResolvedValue({ ok: true, json: async () => results })

  render(<SearchRoommatePage currentUserId="user-1" />)

  // When ระบบแสดงผลคำค้นหาใหม่
  fireEvent.click(screen.getByRole('button', { name: 'ค้นหาเมท' }))

  // Then ระบบเริ่มที่หน้า 1; ระบบแสดง 20 รายการในหน้านั้น
  expect(await screen.findByText('หน้า 1')).toBeTruthy()
  expect(screen.getAllByRole('listitem')).toHaveLength(20)
  expect(JSON.parse(global.fetch.mock.calls[0][1].body).page).toBe(1)
})

test('test_TC_SRS_03E_3_paginates_21_results', async () => {
  // Given นักศึกษาส่งคำค้นหาใหม่ที่มีผลลัพธ์ตรงทั้งหมด 21 รายการ
  const pageResults = (start, count) => Array.from({ length: count }, (_, index) => ({
    user_id: `page-${start + index}`,
    name: `ผลลัพธ์ ${start + index}`,
    age: 20,
    gender: 'หญิง',
    faculty: 'วิศวกรรมศาสตร์',
    academic_year: '2',
    room_type: 'ห้องแยก',
    room_size: 2,
    is_open_for_search: true,
  }))
  global.fetch = vi.fn()
    .mockResolvedValueOnce({ ok: true, json: async () => pageResults(1, 20) })
    .mockResolvedValueOnce({ ok: true, json: async () => pageResults(21, 1) })

  render(<SearchRoommatePage currentUserId="user-1" />)
  fireEvent.click(screen.getByRole('button', { name: 'ค้นหาเมท' }))
  expect(await screen.findByText('หน้า 1')).toBeTruthy()
  expect(screen.getAllByRole('listitem')).toHaveLength(20)

  // When ระบบแสดงผลคำค้นหาใหม่และนักศึกษาเปิดหน้าถัดไป
  fireEvent.click(screen.getByRole('button', { name: 'ถัดไป' }))

  // Then ระบบเริ่มที่หน้า 1 และแสดง 20 รายการ; หน้าถัดไปแสดงรายการที่เหลือ 1 รายการ
  expect(await screen.findByText('หน้า 2')).toBeTruthy()
  expect(screen.getAllByRole('listitem')).toHaveLength(1)
  expect(screen.getByText('ผลลัพธ์ 21')).toBeTruthy()
  expect(JSON.parse(global.fetch.mock.calls[0][1].body).page).toBe(1)
  expect(JSON.parse(global.fetch.mock.calls[1][1].body).page).toBe(2)
})

test('test_TC_SRS_03E_4_new_search_from_search_page', async () => {
  // Given นักศึกษาอยู่หน้าค้นหาเมทก่อนมีหน้าผลลัพธ์
  const results = Array.from({ length: 20 }, (_, index) => ({
    user_id: `initial-${index}`,
    name: `ผลลัพธ์เริ่มต้น ${index}`,
    age: 20,
    gender: 'หญิง',
    faculty: 'วิศวกรรมศาสตร์',
    academic_year: '2',
    room_type: 'ห้องแยก',
    room_size: 2,
    is_open_for_search: true,
  }))
  global.fetch = vi.fn().mockResolvedValue({ ok: true, json: async () => results })

  render(<SearchRoommatePage currentUserId="user-1" />)
  fireEvent.change(screen.getByLabelText('เพศ'), { target: { value: 'หญิง' } })

  // When นักศึกษาแก้ไขตัวกรองหรือส่งคำค้นหาใหม่
  fireEvent.click(screen.getByRole('button', { name: 'ค้นหาเมท' }))

  // Then ระบบเริ่มแสดงผลคำค้นหาใหม่ที่หน้า 1; ระบบแสดงหน้าละ 20 รายการ
  expect(await screen.findByText('หน้า 1')).toBeTruthy()
  expect(screen.getAllByRole('listitem')).toHaveLength(20)
  const request = JSON.parse(global.fetch.mock.calls[0][1].body)
  expect(request.page).toBe(1)
  expect(request.filters).toEqual({ gender: 'หญิง' })
})

test('test_TC_SRS_03A_1_filters_closed_and_own_profiles', async () => {
  // Given มีโปรไฟล์ของนักศึกษาหลายคน ทั้งที่เปิดและไม่เปิดสถานะให้ค้นหา และมีโปรไฟล์ของผู้ค้นหาเอง
  global.fetch = vi.fn().mockResolvedValue({
    ok: true,
    json: async () => [{
      user_id: 'user-2',
      name: 'โปรไฟล์ที่เปิด',
      age: 21,
      gender: 'หญิง',
      faculty: 'วิศวกรรมศาสตร์',
      academic_year: '2',
      room_type: 'ห้องแยก',
      room_size: 2,
      is_open_for_search: true,
    }],
  })

  render(<SearchRoommatePage currentUserId="user-1" />)

  // When นักศึกษาค้นหาเมท
  fireEvent.click(screen.getByRole('button', { name: 'ค้นหาเมท' }))

  // Then ระบบแสดงเฉพาะโปรไฟล์ที่เจ้าของเปิดสถานะ; ระบบไม่แสดงโปรไฟล์ของผู้ค้นหาเอง
  expect(await screen.findByText('โปรไฟล์ที่เปิด')).toBeTruthy()
  expect(screen.queryByText('ผู้ค้นหา')).toBeNull()
  expect(screen.queryByText('โปรไฟล์ที่ปิด')).toBeNull()
})

test('test_TC_SRS_03A_2_includes_single_open_profile', async () => {
  // Given มีโปรไฟล์ของผู้สมัครคนอื่นที่เปิดสถานะให้ค้นหาเพียง 1 โปรไฟล์
  global.fetch = vi.fn().mockResolvedValue({
    ok: true,
    json: async () => [{
      user_id: 'user-2',
      name: 'โปรไฟล์ที่เปิดเพียงรายการเดียว',
      age: 21,
      gender: 'หญิง',
      faculty: 'วิศวกรรมศาสตร์',
      academic_year: '2',
      room_type: 'ห้องแยก',
      room_size: 2,
      is_open_for_search: true,
    }],
  })

  render(<SearchRoommatePage currentUserId="user-1" />)

  // When นักศึกษาค้นหาเมท
  fireEvent.click(screen.getByRole('button', { name: 'ค้นหาเมท' }))

  // Then ระบบแสดงโปรไฟล์ที่เปิดสถานะนั้น
  expect(await screen.findByText('โปรไฟล์ที่เปิดเพียงรายการเดียว')).toBeTruthy()
  expect(screen.getAllByRole('listitem')).toHaveLength(1)
})

test('test_TC_SRS_03A_3_excludes_only_own_profile', async () => {
  // Given มีเพียงโปรไฟล์ของผู้ค้นหาเองและเจ้าของเปิดสถานะให้ค้นหา
  global.fetch = vi.fn().mockResolvedValue({ ok: true, json: async () => [] })

  render(<SearchRoommatePage currentUserId="user-1" />)

  // When นักศึกษาค้นหาเมท
  fireEvent.click(screen.getByRole('button', { name: 'ค้นหาเมท' }))

  // Then ระบบไม่แสดงโปรไฟล์ของผู้ค้นหาเอง
  await screen.findByText('ไม่พบผลการค้นหา')
  expect(screen.queryByText('ผู้ใช้หลัก')).toBeNull()
  expect(screen.queryAllByRole('listitem')).toHaveLength(0)
})

test('test_TC_SRS_03B_1_lists_all_open_profiles_without_own', async () => {
  // Given นักศึกษาอยู่ในหน้าค้นหาเมทและมีโปรไฟล์ของหลายคนที่เปิดสถานะให้ค้นหา รวมถึงโปรไฟล์ของผู้ค้นหาเอง
  global.fetch = vi.fn().mockResolvedValue({
    ok: true,
    json: async () => [
      {
        user_id: 'user-2',
        name: 'โปรไฟล์เปิด 1',
        age: 21,
        gender: 'หญิง',
        faculty: 'วิศวกรรมศาสตร์',
        academic_year: '2',
        room_type: 'ห้องแยก',
        room_size: 2,
        is_open_for_search: true,
      },
      {
        user_id: 'user-4',
        name: 'โปรไฟล์เปิด 2',
        age: 20,
        gender: 'หญิง',
        faculty: 'วิทยาศาสตร์',
        academic_year: '1',
        room_type: 'ห้องแยก',
        room_size: 1,
        is_open_for_search: true,
      },
    ],
  })

  render(<SearchRoommatePage currentUserId="user-1" />)

  // When นักศึกษาไม่เลือกตัวกรองและกดค้นหา
  fireEvent.click(screen.getByRole('button', { name: 'ค้นหาเมท' }))

  // Then ระบบแสดงโปรไฟล์ทั้งหมดที่เจ้าของเปิดสถานะให้ค้นหา; ระบบไม่แสดงโปรไฟล์ของผู้ค้นหาเอง
  expect(await screen.findByText('โปรไฟล์เปิด 1')).toBeTruthy()
  expect(screen.getByText('โปรไฟล์เปิด 2')).toBeTruthy()
  expect(screen.queryByText('ผู้ใช้หลัก')).toBeNull()
  await waitFor(() => {
    expect(global.fetch).toHaveBeenCalledTimes(1)
  })
  expect(JSON.parse(global.fetch.mock.calls[0][1].body).filters).toEqual({})
})

test('test_TC_SRS_03B_2_lists_single_open_profile_without_filters', async () => {
  // Given นักศึกษาอยู่ในหน้าค้นหาเมทและมีโปรไฟล์เปิดให้ค้นหาของผู้อื่นตรงตามเงื่อนไขโดยรวมเพียง 1 โปรไฟล์
  global.fetch = vi.fn().mockResolvedValue({
    ok: true,
    json: async () => [{
      user_id: 'user-2',
      name: 'โปรไฟล์เปิดเพียงรายการเดียว',
      age: 21,
      gender: 'หญิง',
      faculty: 'วิศวกรรมศาสตร์',
      academic_year: '2',
      room_type: 'ห้องแยก',
      room_size: 2,
      is_open_for_search: true,
    }],
  })

  render(<SearchRoommatePage currentUserId="user-1" />)

  // When นักศึกษาไม่เลือกตัวกรองและกดค้นหา
  fireEvent.click(screen.getByRole('button', { name: 'ค้นหาเมท' }))

  // Then ระบบแสดงโปรไฟล์ที่เปิดสถานะของผู้อื่น; ระบบไม่แสดงโปรไฟล์ผู้ค้นหาเอง
  expect(await screen.findByText('โปรไฟล์เปิดเพียงรายการเดียว')).toBeTruthy()
  expect(screen.getAllByRole('listitem')).toHaveLength(1)
  expect(screen.queryByText('ผู้ใช้หลัก')).toBeNull()
  await waitFor(() => {
    expect(global.fetch).toHaveBeenCalledTimes(1)
  })
  expect(JSON.parse(global.fetch.mock.calls[0][1].body).filters).toEqual({})
})

test('test_TC_SRS_03B_3_rejects_unauthenticated_unfiltered_search', () => {
  // Given นักศึกษายังไม่ได้เข้าสู่ระบบและไม่ได้อยู่ในหน้าค้นหาเมท
  render(<App initialLoggedIn={false} />)

  // When นักศึกษาพยายามค้นหาโดยไม่เลือกตัวกรอง
  // Then ระบบปฏิเสธการเข้าใช้งานและให้นักศึกษาเข้าสู่ระบบก่อน (AC-SRS-06)
  expect(screen.queryByRole('button', { name: 'ค้นหาเมท' })).toBeNull()
  expect(screen.getByText('กรุณาเข้าสู่ระบบก่อนใช้งานฟังก์ชันค้นหาเมท')).toBeTruthy()
})

test('test_TC_SRS_03C_1_applies_and_or_and_ranks_results', async () => {
  // Given นักศึกษาระบุหลายตัวกรองและเลือก AND หรือ OR; มีโปรไฟล์ที่ตรง 0, 1 หรือทุกตัวกรอง
  const bothMatches = {
    user_id: 'user-2',
    name: 'ตรงทั้งสองตัวกรอง',
    age: 21,
    gender: 'หญิง',
    faculty: 'วิศวกรรมศาสตร์',
    academic_year: '2',
    room_type: 'ห้องแยก',
    room_size: 2,
    is_open_for_search: true,
    match_count: 2,
  }
  const oneMatch = {
    user_id: 'user-4',
    name: 'ตรงหนึ่งตัวกรอง',
    age: 20,
    gender: 'หญิง',
    faculty: 'วิทยาศาสตร์',
    academic_year: '1',
    room_type: 'ห้องแยก',
    room_size: 1,
    is_open_for_search: true,
    match_count: 1,
  }
  global.fetch = vi
    .fn()
    .mockResolvedValueOnce({ ok: true, json: async () => [bothMatches] })
    .mockResolvedValueOnce({ ok: true, json: async () => [bothMatches, oneMatch] })

  render(<SearchRoommatePage currentUserId="user-1" />)
  fireEvent.change(screen.getByLabelText('เพศ'), { target: { value: 'หญิง' } })
  fireEvent.change(screen.getByLabelText('คณะ'), { target: { value: 'วิศวกรรมศาสตร์' } })

  // When นักศึกษากดค้นหาโดยทดสอบทั้ง AND และ OR
  fireEvent.click(screen.getByRole('button', { name: 'ค้นหาเมท' }))
  expect(await screen.findByText('ตรงทั้งสองตัวกรอง')).toBeTruthy()
  expect(screen.getAllByRole('listitem')).toHaveLength(1)
  fireEvent.change(screen.getByLabelText('โหมดค้นหา'), { target: { value: 'OR' } })
  expect(screen.getByLabelText('โหมดค้นหา').value).toBe('OR')
  fireEvent.click(screen.getByRole('button', { name: 'ค้นหาเมท' }))

  // Then ระบบใช้ตัวดำเนินการเดียวกันกับทุกตัวกรอง
  await waitFor(() => {
    expect(global.fetch).toHaveBeenCalledTimes(2)
  })
  const andRequest = JSON.parse(global.fetch.mock.calls[0][1].body)
  const orRequest = JSON.parse(global.fetch.mock.calls[1][1].body)
  expect(andRequest.mode).toBe('AND')
  expect(andRequest.filters).toEqual({ gender: 'หญิง', faculty: 'วิศวกรรมศาสตร์' })
  expect(orRequest.mode).toBe('OR')
  expect(orRequest.filters).toEqual({ gender: 'หญิง', faculty: 'วิศวกรรมศาสตร์' })
  // AND แสดงเฉพาะโปรไฟล์ที่ตรงทุกตัวกรอง
  expect(screen.getByText('ตรงทั้งสองตัวกรอง')).toBeTruthy()
  // OR แสดงเฉพาะโปรไฟล์ที่ตรงอย่างน้อยหนึ่งตัวกรอง
  expect(await screen.findByText('ตรงหนึ่งตัวกรอง')).toBeTruthy()
  expect(screen.queryByText('ไม่ตรงตัวกรอง')).toBeNull()
  // OR เรียงจำนวนตัวกรองที่ตรงจากมากไปน้อย
  expect(screen.getAllByRole('listitem').map((item) => item.textContent)).toEqual([
    expect.stringContaining('ตรงทั้งสองตัวกรอง'),
    expect.stringContaining('ตรงหนึ่งตัวกรอง'),
  ])
})

test('test_TC_SRS_03C_2_handles_two_filter_match_boundary', async () => {
  // Given นักศึกษาระบุ 2 ตัวกรองและเลือก OR; มีโปรไฟล์หนึ่งตรง 2 ตัวกรองและอีกโปรไฟล์ตรงเพียง 1 ตัวกรอง
  const bothMatches = {
    user_id: 'user-2',
    name: 'ตรงสองตัวกรอง',
    age: 21,
    gender: 'หญิง',
    faculty: 'วิศวกรรมศาสตร์',
    academic_year: '2',
    room_type: 'ห้องแยก',
    room_size: 2,
    is_open_for_search: true,
    match_count: 2,
  }
  const oneMatch = {
    user_id: 'user-4',
    name: 'ตรงหนึ่งตัวกรอง',
    age: 21,
    gender: 'ชาย',
    faculty: 'วิทยาศาสตร์',
    academic_year: '2',
    room_type: 'ห้องแยก',
    room_size: 2,
    is_open_for_search: true,
    match_count: 1,
  }
  global.fetch = vi
    .fn()
    .mockResolvedValueOnce({ ok: true, json: async () => [bothMatches, oneMatch] })
    .mockResolvedValueOnce({ ok: true, json: async () => [bothMatches] })

  render(<SearchRoommatePage currentUserId="user-1" />)
  fireEvent.change(screen.getByLabelText('เพศ'), { target: { value: 'หญิง' } })
  fireEvent.change(screen.getByLabelText('คณะ'), { target: { value: 'วิศวกรรมศาสตร์' } })

  // When นักศึกษากดค้นหา แล้วเปลี่ยนเป็น AND และค้นหาอีกครั้ง
  expect(screen.getByLabelText('โหมดค้นหา').value).toBe('AND')
  fireEvent.change(screen.getByLabelText('โหมดค้นหา'), { target: { value: 'OR' } })
  fireEvent.click(screen.getByRole('button', { name: 'ค้นหาเมท' }))
  expect(await screen.findByText('ตรงสองตัวกรอง')).toBeTruthy()
  expect(screen.getByText('ตรงหนึ่งตัวกรอง')).toBeTruthy()
  expect(screen.getAllByRole('listitem').map((item) => item.textContent)).toEqual([
    expect.stringContaining('ตรงสองตัวกรอง'),
    expect.stringContaining('ตรงหนึ่งตัวกรอง'),
  ])
  const orRequest = JSON.parse(global.fetch.mock.calls[0][1].body)
  expect(orRequest.mode).toBe('OR')
  expect(orRequest.filters).toEqual({ gender: 'หญิง', faculty: 'วิศวกรรมศาสตร์' })

  fireEvent.change(screen.getByLabelText('โหมดค้นหา'), { target: { value: 'AND' } })
  fireEvent.click(screen.getByRole('button', { name: 'ค้นหาเมท' }))

  // Then OR แสดงทั้งสองโปรไฟล์และเรียงโปรไฟล์ที่ตรง 2 ตัวกรองก่อน
  await waitFor(() => {
    expect(global.fetch).toHaveBeenCalledTimes(2)
  })
  // AND แสดงเฉพาะโปรไฟล์ที่ตรงทั้ง 2 ตัวกรอง
  const andRequest = JSON.parse(global.fetch.mock.calls[1][1].body)
  expect(andRequest.mode).toBe('AND')
  expect(await screen.findByText('ตรงสองตัวกรอง')).toBeTruthy()
  expect(screen.queryByText('ตรงหนึ่งตัวกรอง')).toBeNull()
})

test('test_TC_SRS_06_1_requires_login_for_search', () => {
  // Given นักศึกษายังไม่ได้เข้าสู่ระบบ
  render(<App initialLoggedIn={false} />)

  // When นักศึกษาพยายามเข้าสู่หน้าค้นหาเมท
  // Then ระบบปฏิเสธการเข้าใช้งาน; ระบบให้นักศึกษาเข้าสู่ระบบก่อน
  expect(screen.queryByRole('button', { name: 'ค้นหาเมท' })).toBeNull()
  expect(screen.getByRole('alert').textContent).toBe('กรุณาเข้าสู่ระบบก่อนใช้งานฟังก์ชันค้นหาเมท')
})

test('test_TC_SRS_06_2_allows_authenticated_search', () => {
  // Given นักศึกษาเข้าสู่ระบบแล้วและมีโปรไฟล์หาเมท
  render(<App />)

  // When นักศึกษาเข้าสู่หน้าค้นหาเมท
  fireEvent.click(screen.getByRole('button', { name: 'ค้นหาเมท' }))

  // Then ระบบอนุญาตให้เข้าสู่หน้าค้นหาและแสดงเงื่อนไขค้นหา (AC-SRS-01)
  expect(screen.getByRole('heading', { name: 'ค้นหาเมท' })).toBeTruthy()
  expect(screen.getByLabelText('เพศ')).toBeTruthy()
})

test('test_TC_SRS_06_3_requires_profile_before_search', () => {
  // Given นักศึกษาเข้าสู่ระบบแล้วแต่ยังไม่มีโปรไฟล์หาเมท
  const previousHash = window.location.hash
  window.location.hash = ''
  render(<SearchRoommatePage currentUserId="user-99" />)

  // When นักศึกษาพยายามเข้าสู่หน้าค้นหาเมท
  // Then ระบบแจ้งว่ายังไม่มีโปรไฟล์และพาไปหน้าสร้างโปรไฟล์หาเมท (AC-SRS-07)
  expect(screen.getByText('คุณยังไม่มีโปรไฟล์หาเมท')).toBeTruthy()
  fireEvent.click(screen.getByRole('button', { name: 'สร้างโปรไฟล์หาเมท' }))
  expect(window.location.hash).toBe('#create-profile')
  window.location.hash = previousHash
})

test('test_TC_SRS_07_1_redirects_without_profile', () => {
  // Given นักศึกษาเข้าสู่ระบบแล้วแต่ยังไม่มีโปรไฟล์หาเมท
  const previousHash = window.location.hash
  window.location.hash = ''
  render(<SearchRoommatePage currentUserId="user-99" />)

  // When นักศึกษาเลือกเมนู "ค้นหาเมท"
  // Then ระบบแจ้งว่ายังไม่มีโปรไฟล์; ระบบพาไปยังหน้าสร้างโปรไฟล์หาเมท
  expect(screen.getByText('คุณยังไม่มีโปรไฟล์หาเมท')).toBeTruthy()
  fireEvent.click(screen.getByRole('button', { name: 'สร้างโปรไฟล์หาเมท' }))
  expect(window.location.hash).toBe('#create-profile')
  window.location.hash = previousHash
})

test('test_TC_SRS_07_2_opens_search_with_profile', () => {
  // Given นักศึกษาเข้าสู่ระบบแล้วและมีโปรไฟล์หาเมท
  render(<App />)

  // When นักศึกษาเลือกเมนู "ค้นหาเมท"
  fireEvent.click(screen.getByRole('button', { name: 'ค้นหาเมท' }))

  // Then ระบบแสดงหน้าค้นหาและเงื่อนไขที่สามารถใช้ค้นหาได้ (AC-SRS-01)
  expect(screen.getByRole('heading', { name: 'ค้นหาเมท' })).toBeTruthy()
  expect(screen.getByLabelText('เพศ')).toBeTruthy()
})

test('test_TC_SRS_07_3_unauthenticated_without_profile', () => {
  // Given นักศึกษายังไม่ได้เข้าสู่ระบบและยังไม่มีโปรไฟล์หาเมท
  render(<App initialLoggedIn={false} />)

  // When นักศึกษาเลือกเมนู "ค้นหาเมท"
  // Then ระบบปฏิเสธการเข้าใช้งานและให้นักศึกษาเข้าสู่ระบบก่อน (AC-SRS-06)
  expect(screen.queryByRole('button', { name: 'ค้นหาเมท' })).toBeNull()
  expect(screen.getByRole('alert').textContent).toBe('กรุณาเข้าสู่ระบบก่อนใช้งานฟังก์ชันค้นหาเมท')
  // ไม่ตรวจว่าจะแสดงคำเตือนไม่มีโปรไฟล์ก่อนเข้าสู่ระบบหรือไม่ เพราะ spec ไม่ได้ระบุ
})
