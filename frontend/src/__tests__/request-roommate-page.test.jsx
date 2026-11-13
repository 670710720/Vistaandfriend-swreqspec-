import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { vi } from 'vitest'

import { createRoommateRequest } from '../api/client.js'
import RequestRoommatePage from '../pages/RequestRoommatePage.jsx'

const sampleProfiles = [
  { id: 'profile-1', name: 'เอิร์น', faculty: 'วิทยาศาสตร์', status: 'หาเมท' },
  { id: 'profile-2', name: 'บีม', faculty: 'คณะวิศวกรรมศาสตร์', status: 'หาเมท' },
]

// AC-RRS-01: เลือกโปรไฟล์และเปิดฟอร์มส่งคำขอได้
test('test_AC_RRS_01_selects_profile_and_submits_request_form', async () => {
  const onSubmit = vi.fn().mockResolvedValue({ ok: true })

  render(<RequestRoommatePage profiles={sampleProfiles} senderId="student-current" onSubmit={onSubmit} />)

  fireEvent.click(screen.getByRole('button', { name: 'เลือก บีม' }))
  fireEvent.change(screen.getByLabelText('ข้อความประกอบ'), { target: { value: 'สวัสดี อยากเป็นเมท' } })
  fireEvent.click(screen.getByRole('button', { name: 'ส่งคำขอเป็นเมท' }))

  await waitFor(() => {
    expect(onSubmit).toHaveBeenCalledWith({
      senderId: 'student-current',
      receiverId: 'profile-2',
      message: 'สวัสดี อยากเป็นเมท',
      receiverStatus: 'หาเมท',
    })
  })
})

// AC-RRS-04B: ข้อความไม่เกิน 500 Unicode code points ส่งได้
test('test_AC_RRS_04B_accepts_message_with_exactly_500_unicode_code_points', async () => {
  const onSubmit = vi.fn().mockResolvedValue({ ok: true })
  const message = 'ก'.repeat(499) + '😀'

  render(<RequestRoommatePage profiles={sampleProfiles} senderId="student-current" onSubmit={onSubmit} />)

  fireEvent.change(screen.getByLabelText('ข้อความประกอบ'), { target: { value: message } })
  fireEvent.click(screen.getByRole('button', { name: 'ส่งคำขอเป็นเมท' }))

  await waitFor(() => {
    expect(onSubmit).toHaveBeenCalledWith({
      senderId: 'student-current',
      receiverId: 'profile-1',
      message,
      receiverStatus: 'หาเมท',
    })
  })
})

// AC-RRS-04B: ข้อความเกิน 500 Unicode code points ต้องไม่ถูกส่ง
test('test_AC_RRS_04B_rejects_message_longer_than_500_unicode_code_points', async () => {
  const onSubmit = vi.fn()
  const message = 'ก'.repeat(500) + '😀'

  render(<RequestRoommatePage profiles={sampleProfiles} senderId="student-current" onSubmit={onSubmit} />)

  fireEvent.change(screen.getByLabelText('ข้อความประกอบ'), { target: { value: message } })

  expect(screen.getByRole('alert').textContent).toContain('ข้อความประกอบต้องไม่เกิน 500 ตัวอักษร')
  fireEvent.click(screen.getByRole('button', { name: 'ส่งคำขอเป็นเมท' }))

  expect(onSubmit).not.toHaveBeenCalled()
})

test('test_AC_RRS_04B_api_client_rejects_over_limit_before_fetch', async () => {
  const fetchMock = vi.fn()
  vi.stubGlobal('fetch', fetchMock)

  try {
    await expect(
      createRoommateRequest({
        senderId: 'student-current',
        receiverId: 'profile-1',
        message: 'ก'.repeat(500) + '😀',
      }),
    ).rejects.toThrow('ข้อความประกอบต้องไม่เกิน 500 ตัวอักษร')

    expect(fetchMock).not.toHaveBeenCalled()
  } finally {
    vi.unstubAllGlobals()
  }
})

// AC-RRS-12: เมื่อไม่มีโปรไฟล์หาเมท ให้แจ้งให้สร้างโปรไฟล์ก่อน
test('test_AC_RRS_12_requires_profile_before_requesting_roommate', () => {
  render(<RequestRoommatePage profiles={[]} senderId="student-current" />)

  expect(screen.getByRole('alert').textContent).toContain('คุณยังไม่มีโปรไฟล์หาเมท')
  expect(screen.queryByLabelText('ข้อความประกอบ')).toBeNull()
})
