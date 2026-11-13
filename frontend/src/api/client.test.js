import { afterEach, expect, test, vi } from 'vitest'

import { CHAT_CONFIG } from '../config.js'
import {
  fetchChatList,
  fetchChatMessages,
  markChatMessageRead,
  openChat,
  sendChatMessage,
  sendChatMessageWithAttachment,
} from './client.js'

function makeJsonResponse(ok, payload, status = ok ? 200 : 500) {
  return {
    ok,
    status,
    json: async () => payload,
  }
}

afterEach(() => {
  vi.restoreAllMocks()
  vi.unstubAllEnvs()
})

test('test_feature_config_values', () => {
  expect(CHAT_CONFIG).toEqual({
    messageMinLength: 1,
    messageMaxLength: 2_000,
    maxAttachmentsPerMessage: 1,
    attachmentMaxSizeBytes: 10 * 1024 * 1024,
    automaticRetryLimit: 3,
    attachmentRetentionDays: 30,
    sendResponseLimitSeconds: 3,
    usabilityTestUserCount: 5,
    usabilityMinSuccessCount: 4,
    timezone: 'Asia/Bangkok',
  })
})

test('fetchChatList แปลงรายชื่อและ identity จาก API contract', async () => {
  const fetchMock = vi.fn().mockResolvedValue(makeJsonResponse(true, {
    current_user_id: 'demo-student-1',
    demo_mode: true,
    contacts: [{ id: 'demo-student-2', name: 'ผู้ติดต่อสาธิต 1' }],
  }))
  vi.stubGlobal('fetch', fetchMock)

  await expect(fetchChatList()).resolves.toEqual({
    currentUserId: 'demo-student-1',
    demoMode: true,
    contacts: [{
      id: 'demo-student-2',
      name: 'ผู้ติดต่อสาธิต 1',
      avatar: 'ผ',
      summary: '',
    }],
  })
  expect(fetchMock).toHaveBeenCalledWith('/api/chat/list')
})

test('fetchChatList คืนรายการว่างจาก API โดยไม่แทนด้วย mock data', async () => {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue(makeJsonResponse(true, {
    current_user_id: 'student-1',
    demo_mode: false,
    contacts: [],
  })))

  await expect(fetchChatList()).resolves.toMatchObject({
    currentUserId: 'student-1',
    demoMode: false,
    contacts: [],
  })
})

test('API ล้มเหลวใน Development ต้อง throw แทนการใช้ mock data', async () => {
  vi.stubEnv('DEV', true)
  vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('network down')))

  await expect(fetchChatList()).rejects.toThrow('network down')
  await expect(fetchChatMessages('student-2', 'student-1')).rejects.toThrow('network down')
})

test('API ล้มเหลวใน Production ต้อง throw error และไม่ใช้ mock', async () => {
  vi.stubEnv('DEV', false)
  vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('network down')))

  await expect(fetchChatList()).rejects.toThrow('network down')
  await expect(fetchChatMessages('student-2', 'student-1')).rejects.toThrow('network down')
})

test('API คืนข้อมูลผิดชนิด ให้จัดการเป็น API response error', async () => {
  vi.stubEnv('DEV', false)
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue(makeJsonResponse(true, { ok: true })))

  await expect(fetchChatList()).rejects.toThrow('Chat list API returned invalid payload')
  await expect(fetchChatMessages('student-2', 'student-1')).rejects.toThrow('Chat history API returned invalid payload')
})

test('fetchChatMessages รองรับประวัติข้อความทั้งสองทิศทางและกรองข้อมูลผิดรูปแบบ', async () => {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue(makeJsonResponse(true, [
    { id: 10, sender_id: 'student-1', receiver_id: 'student-2', content: 'hello', is_read: true, created_at: '2026-11-13T09:00:00+07:00' },
    { id: 11, sender_id: 'student-2', receiver_id: 'student-1', content: 'hi back', is_read: false, created_at: '2026-11-13T09:02:00+07:00' },
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
      isRead: true,
      attachment: null,
    },
    {
      id: 11,
      senderId: 'student-2',
      receiverId: 'student-1',
      text: 'hi back',
      createdAt: '2026-11-13T09:02:00+07:00',
      status: 'Sent',
      isRead: false,
      attachment: null,
    },
  ])
})

test('openChat ส่งคู่สนทนาไปตรวจและคืนเหตุผลเมื่อถูกปฏิเสธ', async () => {
  const fetchMock = vi.fn().mockResolvedValue(makeJsonResponse(true, {
    allowed: false,
    read_only: false,
    reason: 'recipient is not searchable',
    room_id: null,
  }))
  vi.stubGlobal('fetch', fetchMock)

  await expect(openChat('student-1', 'student-3')).resolves.toEqual({
    allowed: false,
    readOnly: false,
    reason: 'recipient is not searchable',
    roomId: null,
  })
  expect(fetchMock).toHaveBeenCalledWith('/api/chat/open', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sender_id: 'student-1', recipient_id: 'student-3' }),
  })
})

test('openChat returns existing conversation in read-only mode', async () => {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue(makeJsonResponse(true, {
    allowed: true,
    read_only: true,
    reason: 'recipient is not searchable',
    room_id: 'student-1:student-2',
  })))

  await expect(openChat('student-1', 'student-2')).resolves.toEqual({
    allowed: true,
    readOnly: true,
    reason: 'recipient is not searchable',
    roomId: 'student-1:student-2',
  })
})

test('markChatMessageRead confirms the specific message is Read', async () => {
  const fetchMock = vi.fn().mockResolvedValue(makeJsonResponse(true, {
    id: 25,
    is_read: true,
  }))
  vi.stubGlobal('fetch', fetchMock)

  await expect(markChatMessageRead(25)).resolves.toEqual({ id: 25, isRead: true })
  expect(fetchMock).toHaveBeenCalledWith('/api/chat/messages/25/read', { method: 'POST' })
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

test('sendChatMessage อ่านเหตุผลจาก Backend และ retry 5xx ตาม config จนสำเร็จ', async () => {
  const fetchMock = vi.fn()
    .mockResolvedValueOnce(makeJsonResponse(false, {
      detail: 'ไม่สามารถบันทึกข้อความได้ กรุณาลองใหม่',
    }, 503))
    .mockResolvedValueOnce(makeJsonResponse(true, {
      id: 12,
      sender_id: 'student-1',
      receiver_id: 'student-2',
      content: 'ส่งข้อความจริง',
      created_at: '2026-11-13T10:05:00+07:00',
    }))
  vi.stubGlobal('fetch', fetchMock)

  await expect(sendChatMessage({
    senderId: 'student-1',
    receiverId: 'student-2',
    text: 'ส่งข้อความจริง',
  })).resolves.toMatchObject({ id: 12, text: 'ส่งข้อความจริง' })
  expect(fetchMock).toHaveBeenCalledTimes(2)
})

test('sendChatMessage หยุดหลัง retry ครบจำนวนและคืนเหตุผลปลอดภัยจาก Backend', async () => {
  const fetchMock = vi.fn().mockResolvedValue(makeJsonResponse(false, {
    detail: 'ไม่สามารถบันทึกข้อความได้ กรุณาลองใหม่',
  }, 503))
  vi.stubGlobal('fetch', fetchMock)

  await expect(sendChatMessage({
    senderId: 'student-1',
    receiverId: 'student-2',
    text: 'ข้อความที่ยังไม่ถูกบันทึก',
  })).rejects.toThrow('ไม่สามารถบันทึกข้อความได้ กรุณาลองใหม่')
  expect(fetchMock).toHaveBeenCalledTimes(CHAT_CONFIG.automaticRetryLimit + 1)
})

test('sendChatMessage ไม่ retry ข้อผิดพลาดจาก validation หรือ authorization', async () => {
  const fetchMock = vi.fn().mockResolvedValue(makeJsonResponse(false, {
    detail: 'sender_id must match authenticated user',
  }, 403))
  vi.stubGlobal('fetch', fetchMock)

  await expect(sendChatMessage({
    senderId: 'student-1',
    receiverId: 'student-2',
    text: 'ข้อความ',
  })).rejects.toThrow('sender_id must match authenticated user')
  expect(fetchMock).toHaveBeenCalledTimes(1)
})

test('sendChatMessage ไม่ยอมรับข้อความตอบกลับที่ sender หรือ content ไม่ตรงกับคำขอ', async () => {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue(makeJsonResponse(true, {
    id: 13,
    sender_id: 'another-student',
    receiver_id: 'student-2',
    content: 'ข้อความอื่น',
    created_at: '2026-11-13T10:05:00+07:00',
  })))

  await expect(sendChatMessage({
    senderId: 'student-1',
    receiverId: 'student-2',
    text: 'ข้อความจริง',
  })).rejects.toThrow('Send message API returned a message that does not match the request')
})

test('sendChatMessageWithAttachment ส่ง multipart และรับเฉพาะผลที่ยืนยันไฟล์แนบ', async () => {
  const file = new File(['png bytes'], 'room.png', { type: 'image/png' })
  const fetchMock = vi.fn().mockResolvedValue(makeJsonResponse(true, {
    id: 21,
    sender_id: 'student-1',
    receiver_id: 'student-2',
    content: 'ส่งข้อความพร้อมรูป',
    created_at: '2026-11-13T10:05:00+07:00',
    attachment: {
      id: 31,
      name: file.name,
      content_type: file.type,
      size_bytes: file.size,
      download_url: '/api/chat/attachments/31',
    },
  }))
  vi.stubGlobal('fetch', fetchMock)

  await expect(sendChatMessageWithAttachment({
    senderId: 'student-1',
    receiverId: 'student-2',
    text: 'ส่งข้อความพร้อมรูป',
    file,
  })).resolves.toMatchObject({
    senderId: 'student-1',
    receiverId: 'student-2',
    text: 'ส่งข้อความพร้อมรูป',
    status: 'Sent',
    attachment: {
      id: 31,
      name: 'room.png',
      contentType: 'image/png',
      downloadUrl: '/api/chat/attachments/31',
    },
  })

  const [url, options] = fetchMock.mock.calls[0]
  expect(url).toBe('/api/chat/messages/with-attachment')
  expect(options.method).toBe('POST')
  expect(options.headers).toBeUndefined()
  expect(options.body).toBeInstanceOf(FormData)
  expect(options.body.get('sender_id')).toBe('student-1')
  expect(options.body.get('receiver_id')).toBe('student-2')
  expect(options.body.get('content')).toBe('ส่งข้อความพร้อมรูป')
  expect(options.body.get('attachments').name).toBe('room.png')
})

test('sendChatMessageWithAttachment แสดงเหตุผลจาก Backend และไม่ยืนยันผลผิดรูปแบบ', async () => {
  vi.stubGlobal('fetch', vi.fn()
    .mockResolvedValueOnce(makeJsonResponse(false, {
      detail: 'Only JPG, PNG, and PDF attachments are supported',
    }, 415))
    .mockResolvedValueOnce(makeJsonResponse(true, {
      id: 22,
      sender_id: 'student-1',
      receiver_id: 'student-2',
      content: 'ส่งเอกสาร',
      created_at: '2026-11-13T10:05:00+07:00',
    })))

  const input = {
    senderId: 'student-1',
    receiverId: 'student-2',
    text: 'ส่งเอกสาร',
    file: new File(['pdf'], 'file.pdf', { type: 'application/pdf' }),
  }
  await expect(sendChatMessageWithAttachment(input))
    .rejects.toThrow('Only JPG, PNG, and PDF attachments are supported')
  await expect(sendChatMessageWithAttachment(input))
    .rejects.toThrow('Send attachment API returned an invalid response')
})
