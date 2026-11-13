import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { vi } from 'vitest'

import { fetchChatMessages, sendChatMessage } from '../api/client.js'
import ChatListPage from '../pages/ChatListPage.jsx'
import ChatPage from '../pages/ChatPage.jsx'

test('test_AC_CHAT_01_select_chat_and_show_history', async () => {
  render(<ChatListPage />)

  await waitFor(() => {
    expect(screen.getByText('แชทกับรูมเมท')).toBeTruthy()
  })

  const contactButton = await screen.findByRole('button', { name: 'เปิดแชทกับ แพรว' })
  expect(contactButton).toBeTruthy()

  await waitFor(() => {
    expect(screen.getByText('สวัสดี แพรวครับ ผมสนใจห้องพักของคุณ')).toBeTruthy()
  })
})

test('test_AC_CHAT_05_show_existing_history_when_opening_conversation', () => {
  const conversation = {
    id: 'student-2',
    name: 'แพรว',
    avatar: 'P',
    status: 'ออนไลน์',
    messages: [
      {
        id: 'msg-1',
        senderId: 'student-1',
        receiverId: 'student-2',
        text: 'สวัสดี แพรวครับ ผมสนใจห้องพักของคุณ',
        createdAt: '2026-11-12T09:00:00+07:00',
        status: 'Read',
      },
      {
        id: 'msg-2',
        senderId: 'student-2',
        receiverId: 'student-1',
        text: 'สวัสดีครับ ห้องพักยังว่างอยู่ตอนนี้',
        createdAt: '2026-11-12T09:02:00+07:00',
        status: 'Read',
      },
    ],
  }

  render(<ChatPage conversation={conversation} />)

  expect(screen.getByText('สวัสดี แพรวครับ ผมสนใจห้องพักของคุณ')).toBeTruthy()
  expect(screen.getByText('สวัสดีครับ ห้องพักยังว่างอยู่ตอนนี้')).toBeTruthy()
  expect(screen.getByLabelText('พิมพ์ข้อความ')).toBeTruthy()
})

test('test_AC_CHAT_02_send_valid_message_only_after_api_confirms_success', async () => {
  vi.stubEnv('DEV', false)
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
    ok: true,
    json: async () => ({
      id: 'msg-new',
      senderId: 'student-1',
      receiverId: 'student-2',
      text: 'สวัสดีครับ ผมอยากคุยเรื่องห้องพัก',
      createdAt: '2026-11-13T10:15:00+07:00',
      status: 'Sent',
    }),
  }))

  const conversation = {
    id: 'student-2',
    name: 'แพรว',
    avatar: 'P',
    status: 'ออนไลน์',
    messages: [],
  }

  render(<ChatPage conversation={conversation} />)

  fireEvent.change(screen.getByLabelText('พิมพ์ข้อความ'), { target: { value: 'สวัสดีครับ ผมอยากคุยเรื่องห้องพัก' } })
  fireEvent.click(screen.getByRole('button', { name: 'ส่ง' }))

  await waitFor(() => {
    expect(screen.getByText('สวัสดีครับ ผมอยากคุยเรื่องห้องพัก')).toBeTruthy()
  })
})

test('test_AC_CHAT_02C_rejects_blank_or_too_long_messages_before_send', () => {
  const conversation = {
    id: 'student-2',
    name: 'แพรว',
    avatar: 'P',
    status: 'ออนไลน์',
    messages: [],
  }

  render(<ChatPage conversation={conversation} />)

  fireEvent.change(screen.getByLabelText('พิมพ์ข้อความ'), { target: { value: '   ' } })
  fireEvent.click(screen.getByRole('button', { name: 'ส่ง' }))
  expect(screen.getByRole('alert').textContent).toContain('กรุณาพิมพ์ข้อความก่อนส่ง')

  const longText = 'a'.repeat(2001)
  fireEvent.change(screen.getByLabelText('พิมพ์ข้อความ'), { target: { value: longText } })
  fireEvent.click(screen.getByRole('button', { name: 'ส่ง' }))
  expect(screen.getByRole('alert').textContent).toContain('ข้อความต้องไม่เกิน 2000 ตัวอักษร')
})

test('sendChatMessage_dev_mode_throws_when_api_fails', async () => {
  vi.stubEnv('DEV', true)
  vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('network down')))

  await expect(fetchChatMessages('student-2')).resolves.toEqual(expect.any(Array))
  await expect(sendChatMessage({ senderId: 'student-1', receiverId: 'student-2', text: 'hello' })).rejects.toThrow('network down')
})

test('sendChatMessage_rejects_response_missing_required_fields', async () => {
  vi.stubEnv('DEV', false)
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
    ok: true,
    json: async () => ({ id: 'msg-new', text: 'hello', createdAt: '2026-11-13T10:15:00+07:00' }),
  }))

  await expect(sendChatMessage({ senderId: 'student-1', receiverId: 'student-2', text: 'hello' })).rejects.toThrow('Send message API returned invalid payload')
})
