import { afterEach, expect, test, vi } from 'vitest'

import {
  fetchChatList,
  fetchChatMessages,
  mockContacts,
  mockConversationById,
  sendChatMessage,
} from './client.js'

function makeJsonResponse(ok, payload) {
  return {
    ok,
    json: async () => payload,
  }
}

afterEach(() => {
  vi.restoreAllMocks()
  vi.unstubAllEnvs()
})

test('API สำเร็จและมีข้อมูล ให้คืน array ที่ได้จาก API', async () => {
  vi.stubEnv('DEV', false)
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue(
    makeJsonResponse(true, [{ id: 'm-1', text: 'ok' }]),
  ))

  await expect(fetchChatList()).resolves.toEqual([{ id: 'm-1', text: 'ok' }])
})

test('API สำเร็จแต่ array ว่าง ให้คืน [] โดยไม่ใช้ mock', async () => {
  vi.stubEnv('DEV', false)
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue(makeJsonResponse(true, [])))

  await expect(fetchChatList()).resolves.toEqual([])
})

test('API ล้มเหลวใน Development ให้ใช้ mock data', async () => {
  vi.stubEnv('DEV', true)
  vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('network down')))

  await expect(fetchChatList()).resolves.toEqual(mockContacts)
  await expect(fetchChatMessages('student-2')).resolves.toEqual(mockConversationById['student-2'])
})

test('API ล้มเหลวใน Production ต้อง throw error และไม่ใช้ mock', async () => {
  vi.stubEnv('DEV', false)
  vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('network down')))

  await expect(fetchChatList()).rejects.toThrow('network down')
  await expect(fetchChatMessages('student-2')).rejects.toThrow('network down')
})

test('API คืนข้อมูลผิดชนิด ให้จัดการเป็น API response error', async () => {
  vi.stubEnv('DEV', false)
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue(makeJsonResponse(true, { ok: true })))

  await expect(fetchChatList()).rejects.toThrow('Chat list API returned invalid payload')
  await expect(fetchChatMessages('student-2')).rejects.toThrow('Chat history API returned invalid payload')
})

test('fetchChatMessages รองรับประวัติข้อความทั้งสองทิศทางและกรองข้อมูลผิดรูปแบบ', async () => {
  vi.stubEnv('DEV', false)
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue(makeJsonResponse(true, [
    { id: 10, sender_id: 'student-1', receiver_id: 'student-2', content: 'hello', created_at: '2026-11-13T09:00:00+07:00' },
    { id: 11, sender_id: 'student-2', receiver_id: 'student-1', content: 'hi back', created_at: '2026-11-13T09:02:00+07:00' },
    { id: 12, sender_id: 'student-1', receiver_id: 'student-2', created_at: '2026-11-13T09:04:00+07:00' },
  ])))

  await expect(fetchChatMessages('student-2', 'student-1')).resolves.toEqual([
    {
      id: 10,
      senderId: 'student-1',
      receiverId: 'student-2',
      text: 'hello',
      createdAt: '2026-11-13T09:00:00+07:00',
      status: 'Read',
      attachment: null,
    },
    {
      id: 11,
      senderId: 'student-2',
      receiverId: 'student-1',
      text: 'hi back',
      createdAt: '2026-11-13T09:02:00+07:00',
      status: 'Read',
      attachment: null,
    },
  ])
})

test('sendChatMessage ต้องไม่ใช้ validation.value เป็น fallback เมื่อ backend ส่ง content ไม่ครบ', async () => {
  vi.stubEnv('DEV', false)
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue(makeJsonResponse(true, {
    id: 11,
    sender_id: 'student-1',
    receiver_id: 'student-2',
    created_at: '2026-11-13T09:05:00+07:00',
  })))

  await expect(sendChatMessage({
    senderId: 'student-1',
    receiverId: 'student-2',
    text: 'ส่งแล้ว',
  })).rejects.toThrow('Send message API returned invalid payload')
})

test('sendChatMessage ส่ง payload backend ที่ใช้ snake_case และ map response ให้ UI', async () => {
  vi.stubEnv('DEV', false)
  const fetchMock = vi.fn().mockResolvedValue(makeJsonResponse(true, {
    id: 11,
    sender_id: 'student-1',
    receiver_id: 'student-2',
    content: 'ส่งแล้ว',
    created_at: '2026-11-13T09:05:00+07:00',
  }))
  vi.stubGlobal('fetch', fetchMock)

  await expect(sendChatMessage({
    senderId: 'student-1',
    receiverId: 'student-2',
    text: 'ส่งแล้ว',
  })).resolves.toMatchObject({
    senderId: 'student-1',
    receiverId: 'student-2',
    text: 'ส่งแล้ว',
    status: 'Sent',
  })

  expect(fetchMock).toHaveBeenCalledWith(
    expect.stringContaining('/api/chat/messages'),
    expect.objectContaining({
      method: 'POST',
      body: JSON.stringify({ sender_id: 'student-1', receiver_id: 'student-2', content: 'ส่งแล้ว' }),
    }),
  )
})
