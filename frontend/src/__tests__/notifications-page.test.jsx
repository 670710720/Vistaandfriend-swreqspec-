import { fireEvent, render, screen } from '@testing-library/react'

import NotificationsPage from '../pages/NotificationsPage.jsx'

const successfulNotification = {
  id: 'req-1',
  sender_id: 'student-a',
  sender_name: 'เอิร์น',
  status: 'pending',
  message: 'สวัสดี อยากเป็นเมท',
  notification_status: 'sent',
  created_at: '2026-11-13T08:30:00Z',
}

const failedNotification = {
  id: 'req-2',
  sender_id: 'student-b',
  sender_name: 'บีม',
  status: 'pending',
  message: 'ช่วยส่งคำขออีกครั้งหน่อย',
  notification_status: 'failed',
  notification_error: 'การแจ้งเตือนคำขอไม่สำเร็จ',
  created_at: '2026-11-13T09:00:00Z',
}

test('test_AC_RRS_11_displays_request_notification_list_and_detail', () => {
  render(<NotificationsPage notifications={[successfulNotification]} />)

  expect(screen.getByRole('heading', { name: 'แจ้งเตือนคำขอเป็นเมท' })).toBeTruthy()
  expect(screen.getAllByText('เอิร์น').length).toBeGreaterThan(0)
  expect(screen.getAllByText('สวัสดี อยากเป็นเมท').length).toBeGreaterThan(0)

  fireEvent.click(screen.getByRole('button', { name: 'เปิดแจ้งเตือนจาก เอิร์น' }))

  expect(screen.getByText('รายละเอียดคำขอ')).toBeTruthy()
  expect(screen.getByText('แจ้งเตือนสำเร็จ')).toBeTruthy()
})

test('test_AC_RRS_04A_displays_failed_notification_status_without_changing_saved_request', () => {
  render(<NotificationsPage notifications={[failedNotification]} />)

  expect(screen.getAllByText('บีม').length).toBeGreaterThan(0)
  expect(screen.getByRole('alert').textContent).toContain('การแจ้งเตือนคำขอไม่สำเร็จ')
  expect(screen.getByText('แจ้งเตือนล้มเหลว')).toBeTruthy()
  expect(screen.getByText('pending')).toBeTruthy()
})
