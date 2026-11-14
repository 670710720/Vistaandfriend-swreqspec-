import { fireEvent, render, screen } from '@testing-library/react'

import RoommateRequestListPage from '../pages/RoommateRequestListPage.jsx'

const requestList = [
  {
    id: 'req-1',
    sender_id: 'student-a',
    receiver_id: 'student-b',
    status: 'pending',
    message: 'ยังรอการตอบรับ',
  },
  {
    id: 'req-2',
    sender_id: 'student-a',
    receiver_id: 'student-c',
    status: 'accepted',
    message: 'ตอบรับแล้ว',
  },
  {
    id: 'req-3',
    sender_id: 'student-a',
    receiver_id: 'student-d',
    status: 'rejected',
    message: 'ปฏิเสธแล้ว',
  },
  {
    id: 'req-4',
    sender_id: 'student-a',
    receiver_id: 'student-e',
    status: 'cancelled',
    message: 'ยกเลิกแล้ว',
  },
]

test('test_AC_RRS_10_displays_all_request_statuses_from_real_request_data', () => {
  render(<RoommateRequestListPage requests={requestList} studentId="student-a" />)

  expect(screen.getByRole('heading', { name: 'รายการคำขอเป็นเมท' })).toBeTruthy()
  const pendingLabels = screen.getAllByText('รอการตอบรับ')
  const acceptedLabels = screen.getAllByText('ตอบรับ')
  const rejectedLabels = screen.getAllByText('ปฏิเสธ')
  const cancelledLabels = screen.getAllByText('ยกเลิก')

  expect(pendingLabels.length).toBeGreaterThan(0)
  expect(acceptedLabels.length).toBeGreaterThan(0)
  expect(rejectedLabels.length).toBeGreaterThan(0)
  expect(cancelledLabels.length).toBeGreaterThan(0)

  fireEvent.click(screen.getByRole('button', { name: 'เปิดคำขอจาก student-d สถานะ ปฏิเสธ' }))

  expect(screen.getByText('รายละเอียดคำขอ')).toBeTruthy()
  expect(screen.getAllByText('ปฏิเสธ').length).toBeGreaterThan(0)
})

test('test_AC_RRS_10_displays_pending_status_when_request_is_waiting_for_response', () => {
  render(
    <RoommateRequestListPage
      requests={[{ id: 'req-5', sender_id: 'student-a', receiver_id: 'student-z', status: 'pending', message: 'รอเผื่อ' }]}
      studentId="student-a"
    />,
  )

  expect(screen.getAllByText('รอการตอบรับ').length).toBeGreaterThan(0)
  expect(screen.getAllByText('รอเผื่อ').length).toBeGreaterThan(0)
})

test('test_AC_RRS_10_displays_empty_state_when_no_related_requests_exist', () => {
  render(<RoommateRequestListPage requests={[]} studentId="student-a" />)

  expect(screen.getByText('ยังไม่มีคำขอเป็นเมทในระบบ')).toBeTruthy()
})
