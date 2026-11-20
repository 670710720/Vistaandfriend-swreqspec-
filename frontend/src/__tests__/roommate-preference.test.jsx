import { fireEvent, render, screen, within } from '@testing-library/react'
import { afterEach, vi } from 'vitest'
import * as roommatePreferenceClient from '../api/client.js'
import { ROOMMATE_PREFERENCE_CONFIG } from '../config.js'
import App from '../App.jsx'
import RoommatePreferencePage from '../pages/RoommatePreferencePage.jsx'

vi.mock('../api/client.js', async (importOriginal) => {
  const actual = await importOriginal()
  return {
    ...actual,
    getRoommatePreferenceOptions: vi.fn(() => new Promise(() => {})),
  }
})

afterEach(() => {
  vi.restoreAllMocks()
  roommatePreferenceClient.getRoommatePreferenceOptions.mockImplementation(() => new Promise(() => {}))
})

test('test_AC_RPS_01_menu_opens_page_and_displays_api_options', async () => {
  roommatePreferenceClient.getRoommatePreferenceOptions.mockResolvedValue(ROOMMATE_PREFERENCE_CONFIG)
  render(<App />)

  fireEvent.click(screen.getByRole('button', { name: 'ความต้องการหาเมท' }))

  expect(await screen.findByRole('option', { name: 'ห้องแอร์' })).toBeTruthy()
  expect(screen.getByRole('option', { name: 'ห้องพัดลม' })).toBeTruthy()
  const roomType = screen.getByLabelText('รูปแบบห้อง')
  expect(
    within(roomType).getAllByRole('option').slice(1).map((option) => option.value),
  ).toEqual(Object.keys(ROOMMATE_PREFERENCE_CONFIG.roomOccupants))
  fireEvent.change(roomType, { target: { value: 'airConditioned' } })
  const airConditionedCapacity = ROOMMATE_PREFERENCE_CONFIG.roomOccupants.airConditioned
  expect(
    within(screen.getByLabelText('จำนวนคนในห้อง'))
      .getAllByRole('option')
      .slice(1)
      .map((option) => Number(option.value)),
  ).toEqual(Array.from(
    { length: airConditionedCapacity.max - airConditionedCapacity.min + 1 },
    (_, index) => airConditionedCapacity.min + index,
  ))
  expect(
    within(screen.getByLabelText('พฤติกรรมการนอน'))
      .getAllByRole('option')
      .slice(1)
      .map((option) => option.textContent),
  ).toEqual(ROOMMATE_PREFERENCE_CONFIG.sleepBehaviors)
  expect(
    within(screen.getByLabelText('ความสะอาด'))
      .getAllByRole('option')
      .slice(1)
      .map((option) => option.textContent),
  ).toEqual(ROOMMATE_PREFERENCE_CONFIG.cleanliness)
  expect(
    within(screen.getByLabelText('เวลาเข้านอน'))
      .getAllByRole('option')
      .slice(1)
      .map((option) => option.textContent),
  ).toEqual(ROOMMATE_PREFERENCE_CONFIG.sleepTime)
  expect(screen.getByLabelText('ข้อมูลเพิ่มเติม').maxLength).toBe(
    ROOMMATE_PREFERENCE_CONFIG.additionalText.maxLength,
  )
  expect(roommatePreferenceClient.getRoommatePreferenceOptions).toHaveBeenCalledOnce()
})

test('test_AC_RPS_02_accepts_preference_selection_and_additional_text', async () => {
  roommatePreferenceClient.getRoommatePreferenceOptions.mockResolvedValue(ROOMMATE_PREFERENCE_CONFIG)
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
    ok: true,
    json: async () => ({ status: 'saved' }),
  }))

  render(<RoommatePreferencePage ownerId="student-1" />)
  await screen.findByRole('option', { name: 'ห้องแอร์' })

  fireEvent.change(screen.getByLabelText('รูปแบบห้อง'), {
    target: { value: 'airConditioned' },
  })
  fireEvent.change(screen.getByLabelText('จำนวนคนในห้อง'), {
    target: { value: '2' },
  })
  fireEvent.change(screen.getByLabelText('พฤติกรรมการนอน'), {
    target: { value: 'กรน' },
  })
  fireEvent.change(screen.getByLabelText('ความสะอาด'), {
    target: { value: 'สะอาดมาก' },
  })
  fireEvent.change(screen.getByLabelText('เวลาเข้านอน'), {
    target: { value: '22:00–00:00' },
  })
  fireEvent.change(screen.getByLabelText('ข้อมูลเพิ่มเติม'), {
    target: { value: 'ต้องการห้องเงียบ' },
  })
  fireEvent.click(screen.getByRole('button', { name: 'บันทึกความต้องการ' }))

  await screen.findByRole('status')

  expect(fetch).toHaveBeenCalledWith('/api/roommate-preferences', expect.objectContaining({
    method: 'POST',
  }))
  expect(JSON.parse(fetch.mock.calls[0][1].body)).toEqual({
    room_occupants: 2,
    room_type: 'airConditioned',
    sleep_behavior: 'กรน',
    cleanliness: 'สะอาดมาก',
    sleep_time: '22:00–00:00',
    additional_text: 'ต้องการห้องเงียบ',
  })
})

test('test_AC_RPS_02A_accepts_valid_room_capacity_boundaries', async () => {
  roommatePreferenceClient.getRoommatePreferenceOptions.mockResolvedValue(ROOMMATE_PREFERENCE_CONFIG)
  render(<RoommatePreferencePage ownerId="student-1" />)
  await screen.findByRole('option', { name: 'ห้องแอร์' })

  fireEvent.change(screen.getByLabelText(/รูปแบบห้อง/), {
    target: { value: 'airConditioned' },
  })

  expect(screen.getByText('(1–4 คน)')).toBeTruthy()
  const airCapacity = screen.getByLabelText(/จำนวนคนในห้อง/)
  expect(within(airCapacity).getAllByRole('option').map((option) => option.value)).toEqual([
    '',
    '1',
    '2',
    '3',
    '4',
  ])

  fireEvent.change(screen.getByLabelText(/รูปแบบห้อง/), {
    target: { value: 'fan' },
  })

  expect(screen.getByText('(1–3 คน)')).toBeTruthy()
  expect(within(airCapacity).getAllByRole('option').map((option) => option.value)).toEqual([
    '',
    '1',
    '2',
    '3',
  ])
})

test('test_AC_RPS_02B_rejects_incompatible_fan_capacity', async () => {
  roommatePreferenceClient.getRoommatePreferenceOptions.mockResolvedValue(ROOMMATE_PREFERENCE_CONFIG)
  vi.stubGlobal('fetch', vi.fn())
  render(<RoommatePreferencePage ownerId="student-1" />)
  await screen.findByRole('option', { name: 'ห้องพัดลม' })

  fireEvent.change(screen.getByLabelText(/รูปแบบห้อง/), {
    target: { value: 'fan' },
  })

  const capacity = screen.getByLabelText(/จำนวนคนในห้อง/)
  expect(within(capacity).queryByRole('option', { name: '4 คน' })).toBeNull()

  fireEvent.click(screen.getByRole('button', { name: 'บันทึกความต้องการ' }))
  expect(screen.getByRole('alert').textContent).toContain('กรุณาเลือกรูปแบบห้องและจำนวนคนในห้อง')
  expect(fetch).not.toHaveBeenCalled()
})

test('test_AC_RPS_02C_rejects_invalid_additional_text_without_submit', async () => {
  roommatePreferenceClient.getRoommatePreferenceOptions.mockResolvedValue(ROOMMATE_PREFERENCE_CONFIG)
  vi.stubGlobal('fetch', vi.fn())
  render(<RoommatePreferencePage ownerId="student-1" />)
  await screen.findByRole('option', { name: 'ห้องแอร์' })

  fireEvent.change(screen.getByLabelText(/รูปแบบห้อง/), {
    target: { value: 'airConditioned' },
  })
  fireEvent.change(screen.getByLabelText(/จำนวนคนในห้อง/), {
    target: { value: '2' },
  })
  fireEvent.change(screen.getByLabelText('ข้อมูลเพิ่มเติม'), {
    target: { value: 'ก'.repeat(501) },
  })

  fireEvent.click(screen.getByRole('button', { name: 'บันทึกความต้องการ' }))

  expect(screen.getByRole('alert').textContent).toContain('ข้อมูลเพิ่มเติม')
  expect(fetch).not.toHaveBeenCalled()

  fireEvent.change(screen.getByLabelText('ข้อมูลเพิ่มเติม'), {
    target: { value: '   ' },
  })
  fireEvent.click(screen.getByRole('button', { name: 'บันทึกความต้องการ' }))
  expect(screen.getByRole('alert').textContent).toContain('ข้อมูลเพิ่มเติม')
  expect(fetch).not.toHaveBeenCalled()
})

test('test_AC_RPS_02C_accepts_exactly_500_characters', async () => {
  roommatePreferenceClient.getRoommatePreferenceOptions.mockResolvedValue(ROOMMATE_PREFERENCE_CONFIG)
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
    ok: true,
    json: async () => ({ status: 'saved' }),
  }))
  render(<RoommatePreferencePage ownerId="student-1" />)
  await screen.findByRole('option', { name: 'ห้องพัดลม' })

  fireEvent.change(screen.getByLabelText(/รูปแบบห้อง/), {
    target: { value: 'fan' },
  })
  fireEvent.change(screen.getByLabelText(/จำนวนคนในห้อง/), {
    target: { value: '3' },
  })
  fireEvent.change(screen.getByLabelText('ข้อมูลเพิ่มเติม'), {
    target: { value: 'ก'.repeat(500) },
  })
  fireEvent.click(screen.getByRole('button', { name: 'บันทึกความต้องการ' }))

  await screen.findByRole('status')
  expect(fetch).toHaveBeenCalledTimes(1)
})

test('test_AC_RPS_03_requires_room_type_and_capacity', () => {
  vi.stubGlobal('fetch', vi.fn())
  render(<RoommatePreferencePage ownerId="student-1" />)

  fireEvent.click(screen.getByRole('button', { name: 'บันทึกความต้องการ' }))

  expect(screen.getByRole('alert').textContent).toContain('กรุณาเลือกรูปแบบห้องและจำนวนคนในห้อง')
  expect(screen.queryByRole('status')).toBeNull()
  expect(fetch).not.toHaveBeenCalled()
})

test('test_AC_RPS_03_rejects_missing_one_required_field', async () => {
  roommatePreferenceClient.getRoommatePreferenceOptions.mockResolvedValue(ROOMMATE_PREFERENCE_CONFIG)
  vi.stubGlobal('fetch', vi.fn())
  render(<RoommatePreferencePage ownerId="student-1" />)
  await screen.findByRole('option', { name: 'ห้องแอร์' })

  fireEvent.change(screen.getByLabelText(/รูปแบบห้อง/), {
    target: { value: 'airConditioned' },
  })
  fireEvent.click(screen.getByRole('button', { name: 'บันทึกความต้องการ' }))

  expect(screen.getByRole('alert').textContent).toContain('กรุณาเลือกรูปแบบห้องและจำนวนคนในห้อง')
  expect(screen.queryByRole('status')).toBeNull()
  expect(fetch).not.toHaveBeenCalled()
})

test('test_AC_RPS_04B_preserves_values_and_allows_retry_when_save_fails', async () => {
  // Given นักศึกษากรอกข้อมูลครบถ้วนและมีข้อมูลเดิม
  roommatePreferenceClient.getRoommatePreferenceOptions.mockResolvedValue(ROOMMATE_PREFERENCE_CONFIG)
  vi.stubGlobal('fetch', vi.fn()
    .mockResolvedValueOnce({
      ok: false,
      json: async () => ({ detail: 'ไม่สามารถบันทึกความต้องการได้ กรุณาลองใหม่' }),
    })
    .mockResolvedValueOnce({
      ok: true,
      json: async () => ({ preference: { room_type: 'fan', room_occupants: 3 } }),
    }))
  render(<RoommatePreferencePage ownerId="student-1" />)
  await screen.findByRole('option', { name: 'ห้องพัดลม' })

  fireEvent.change(screen.getByLabelText(/รูปแบบห้อง/), {
    target: { value: 'fan' },
  })
  fireEvent.change(screen.getByLabelText(/จำนวนคนในห้อง/), {
    target: { value: '3' },
  })
  fireEvent.change(screen.getByLabelText('ข้อมูลเพิ่มเติม'), {
    target: { value: 'ข้อมูลใหม่' },
  })

  // When การบันทึกครั้งแรกล้มเหลว
  fireEvent.click(screen.getByRole('button', { name: 'บันทึกความต้องการ' }))

  // Then หน้าแจ้งผิดพลาด คงค่าที่กรอก และให้ลองใหม่
  expect((await screen.findByRole('alert')).textContent).toContain(
    'ไม่สามารถบันทึกความต้องการได้',
  )
  expect(screen.queryByRole('status')).toBeNull()
  expect(screen.getByLabelText('ข้อมูลเพิ่มเติม').value).toBe('ข้อมูลใหม่')

  fireEvent.click(screen.getByRole('button', { name: 'บันทึกความต้องการ' }))
  expect(await screen.findByRole('status')).toBeTruthy()
  expect(fetch).toHaveBeenCalledTimes(2)
})

test('test_TC_RPS_07_1_redirects_without_roommate_profile', async () => {
  roommatePreferenceClient.getRoommatePreferenceOptions.mockResolvedValue({
    status: 'missing_profile',
  })
  render(<App />)

  fireEvent.click(screen.getByRole('button', { name: 'ความต้องการหาเมท' }))

  expect(await screen.findByRole('heading', { name: 'สร้างโปรไฟล์หาเมท' })).toBeTruthy()
  expect(screen.queryByRole('heading', { name: 'ความต้องการหาเมท' })).toBeNull()
})

test('test_TC_RPS_07_2_shows_options_with_roommate_profile', async () => {
  roommatePreferenceClient.getRoommatePreferenceOptions.mockResolvedValue(ROOMMATE_PREFERENCE_CONFIG)
  render(<App />)

  fireEvent.click(screen.getByRole('button', { name: 'ความต้องการหาเมท' }))

  expect(await screen.findByRole('heading', { name: 'ความต้องการหาเมท' })).toBeTruthy()
  expect(await screen.findByRole('option', { name: 'ห้องแอร์' })).toBeTruthy()
})

test('test_TC_RPS_01_2_shows_options_with_existing_profile', () => {
  // Given นักศึกษาเข้าสู่ระบบแล้วและมีโปรไฟล์หาเมท 1 โปรไฟล์
  render(<RoommatePreferencePage ownerId="student-1001" />)

  // When นักศึกษาเลือกเมนู "ความต้องการหาเมท"
  expect(screen.getByRole('heading', { name: 'ความต้องการหาเมท' })).toBeTruthy()

  // Then ระบบแสดงตัวเลือกความต้องการ
  expect(screen.getByLabelText('รูปแบบห้อง')).toBeTruthy()
  expect(screen.getByLabelText('จำนวนคนในห้อง')).toBeTruthy()
  expect(screen.getByLabelText('พฤติกรรมการนอน')).toBeTruthy()
  expect(screen.getByLabelText('ความสะอาด')).toBeTruthy()
  expect(screen.getByLabelText('เวลาเข้านอน')).toBeTruthy()
  expect(screen.getByLabelText('ข้อมูลเพิ่มเติม')).toBeTruthy()
})
