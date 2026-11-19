import { fireEvent, render, screen, within } from '@testing-library/react'
import { afterEach, vi } from 'vitest'
import RoommatePreferencePage from '../pages/RoommatePreferencePage.jsx'

afterEach(() => {
  vi.restoreAllMocks()
})

test('test_AC_RPS_02_accepts_preference_selection_and_additional_text', async () => {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
    ok: true,
    json: async () => ({ status: 'saved' }),
  }))

  render(<RoommatePreferencePage ownerId="student-1" />)

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
    owner_id: 'student-1',
    room_occupants: 2,
    room_type: 'airConditioned',
    sleep_behavior: 'กรน',
    cleanliness: 'สะอาดมาก',
    sleep_time: '22:00–00:00',
    additional_text: 'ต้องการห้องเงียบ',
  })
})

test('test_AC_RPS_02A_accepts_valid_room_capacity_boundaries', () => {
  render(<RoommatePreferencePage ownerId="student-1" />)

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

test('test_AC_RPS_02B_rejects_incompatible_fan_capacity', () => {
  vi.stubGlobal('fetch', vi.fn())
  render(<RoommatePreferencePage ownerId="student-1" />)

  fireEvent.change(screen.getByLabelText(/รูปแบบห้อง/), {
    target: { value: 'fan' },
  })

  const capacity = screen.getByLabelText(/จำนวนคนในห้อง/)
  expect(within(capacity).queryByRole('option', { name: '4 คน' })).toBeNull()

  fireEvent.click(screen.getByRole('button', { name: 'บันทึกความต้องการ' }))
  expect(screen.getByRole('alert').textContent).toContain('กรุณาเลือกรูปแบบห้องและจำนวนคนในห้อง')
  expect(fetch).not.toHaveBeenCalled()
})

test('test_AC_RPS_02C_rejects_invalid_additional_text_without_submit', () => {
  vi.stubGlobal('fetch', vi.fn())
  render(<RoommatePreferencePage ownerId="student-1" />)

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
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
    ok: true,
    json: async () => ({ status: 'saved' }),
  }))
  render(<RoommatePreferencePage ownerId="student-1" />)

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

test('test_AC_RPS_03_rejects_missing_one_required_field', () => {
  vi.stubGlobal('fetch', vi.fn())
  render(<RoommatePreferencePage ownerId="student-1" />)

  fireEvent.change(screen.getByLabelText(/รูปแบบห้อง/), {
    target: { value: 'airConditioned' },
  })
  fireEvent.click(screen.getByRole('button', { name: 'บันทึกความต้องการ' }))

  expect(screen.getByRole('alert').textContent).toContain('กรุณาเลือกรูปแบบห้องและจำนวนคนในห้อง')
  expect(screen.queryByRole('status')).toBeNull()
  expect(fetch).not.toHaveBeenCalled()
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
