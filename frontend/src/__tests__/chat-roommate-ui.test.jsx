import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, vi } from 'vitest'

import {
  fetchChatMessages,
  sendChatMessage,
} from '../api/client.js'
import { CHAT_CONFIG } from '../config.js'
import App from '../App.jsx'
import ChatListPage from '../pages/ChatListPage.jsx'
import ChatPage from '../pages/ChatPage.jsx'

const intersectionObservers = []

class TestIntersectionObserver {
  constructor(callback, options) {
    this.callback = callback
    this.options = options
    this.targets = []
    intersectionObservers.push(this)
  }

  observe(target) {
    this.targets.push(target)
  }

  unobserve(target) {
    this.targets = this.targets.filter((item) => item !== target)
  }

  disconnect() {
    this.targets = []
  }

  trigger(target, isIntersecting) {
    this.callback([{ target, isIntersecting }], this)
  }
}

afterEach(() => {
  vi.restoreAllMocks()
  vi.unstubAllEnvs()
  vi.unstubAllGlobals()
  intersectionObservers.length = 0
})

function mockChatApi({
  allowed = true,
  readOnly = false,
  reason = null,
  messages = [],
  attachmentError = null,
} = {}) {
  const savedMessages = [...messages]
  return vi.fn(async (url, options = {}) => {
    if (url === '/api/chat/list') {
      return {
        ok: true,
        json: async () => ({
          current_user_id: 'student-1',
          demo_mode: true,
          contacts: [{ id: 'student-2', name: 'ผู้ติดต่อทดสอบ' }],
        }),
      }
    }

    if (url === '/api/chat/open') {
      return {
        ok: true,
        json: async () => ({
          allowed,
          read_only: readOnly,
          reason,
          room_id: allowed ? 'student-1:student-2' : null,
        }),
      }
    }

    const readMatch = String(url).match(/^\/api\/chat\/messages\/(\d+)\/read$/)
    if (readMatch) {
      const messageId = Number(readMatch[1])
      const message = savedMessages.find((saved) => saved.id === messageId)
      if (message) {
        message.is_read = true
      }
      return {
        ok: true,
        json: async () => ({ id: messageId, is_read: true }),
      }
    }

    if (url === '/api/chat/messages') {
      const payload = JSON.parse(options.body ?? '{}')
      const saved = {
        id: `saved-${savedMessages.length + 1}`,
        ...payload,
        created_at: '2026-11-13T10:15:00+07:00',
      }
      savedMessages.push(saved)
      return { ok: true, json: async () => saved }
    }

    if (url === '/api/chat/messages/with-attachment') {
      if (attachmentError) {
        return {
          ok: false,
          status: 415,
          json: async () => ({ detail: attachmentError }),
        }
      }

      const file = options.body.get('attachments')
      const saved = {
        id: `saved-${savedMessages.length + 1}`,
        sender_id: options.body.get('sender_id'),
        receiver_id: options.body.get('receiver_id'),
        content: options.body.get('content'),
        created_at: '2026-11-13T10:15:00+07:00',
        attachment: {
          id: 17,
          name: file.name,
          content_type: file.type,
          size_bytes: file.size,
          download_url: '/api/chat/attachments/17',
        },
      }
      savedMessages.push(saved)
      return { ok: true, json: async () => saved }
    }

    if (String(url).startsWith('/api/chat/messages?')) {
      return { ok: true, json: async () => [...savedMessages] }
    }

    throw new Error(`Unexpected API request: ${url}`)
  })
}

function selectFile(input, file) {
  Object.defineProperty(input, 'files', {
    configurable: true,
    value: [file],
  })
  fireEvent.change(input)
}

test('test_AC_CHAT_01_ui_selects_contact_and_shows_history', async () => {
  const fetchMock = mockChatApi({
    messages: [{
      id: 'msg-1',
      sender_id: 'student-1',
      receiver_id: 'student-2',
      content: 'ประวัติจาก API',
      created_at: '2026-11-12T09:00:00+07:00',
    }],
  })
  vi.stubGlobal('fetch', fetchMock)
  render(<ChatListPage />)

  const contactButton = await screen.findByRole('button', { name: 'เปิดแชทกับ ผู้ติดต่อทดสอบ' })
  expect(contactButton).toBeTruthy()
  expect(await screen.findByText('ประวัติจาก API')).toBeTruthy()
  expect(fetchMock.mock.calls.map(([url]) => url)).toEqual([
    '/api/chat/list',
    '/api/chat/open',
    '/api/chat/messages?sender_id=student-1&receiver_id=student-2',
  ])
  expect(await screen.findByLabelText('พิมพ์ข้อความ')).toBeTruthy()
})

test('test_AC_CHAT_05_ui_reopens_persisted_history', async () => {
  vi.stubGlobal('fetch', mockChatApi({
    messages: [{
      id: 'msg-saved',
      sender_id: 'student-2',
      receiver_id: 'student-1',
      content: 'ประวัติที่บันทึกไว้',
      created_at: '2026-11-12T09:02:00+07:00',
    }],
  }))

  render(<ChatListPage />)

  expect(await screen.findByText('ประวัติที่บันทึกไว้')).toBeTruthy()
})

test('test_AC_CHAT_02A_ui_sends_supported_attachment', async () => {
  const fetchMock = mockChatApi({
    messages: [{
      id: 'existing-message',
      sender_id: 'student-2',
      receiver_id: 'student-1',
      content: 'ประวัติก่อนแนบ',
      created_at: '2026-11-13T10:00:00+07:00',
    }],
  })
  vi.stubGlobal('fetch', fetchMock)
  render(<ChatListPage />)

  expect(await screen.findByText('ประวัติก่อนแนบ')).toBeTruthy()
  const file = new File(['jpeg bytes'], 'room.jpg', { type: 'image/jpeg' })
  fireEvent.click(await screen.findByRole('button', { name: 'แนบไฟล์' }))
  selectFile(screen.getByLabelText('เลือกไฟล์แนบ'), file)
  expect(await screen.findByText('ไฟล์แนบที่เลือก: room.jpg')).toBeTruthy()
  fireEvent.change(await screen.findByLabelText('พิมพ์ข้อความ'), {
    target: { value: 'ส่งข้อความพร้อมรูป' },
  })
  fireEvent.click(screen.getByRole('button', { name: 'ส่ง' }))

  const attachmentLink = await screen.findByRole('link', {
    name: 'เปิดไฟล์แนบ room.jpg',
  })
  expect(attachmentLink.getAttribute('href')).toBe('/api/chat/attachments/17')
  const uploadCall = fetchMock.mock.calls.find(
    ([url]) => url === '/api/chat/messages/with-attachment',
  )
  expect(uploadCall).toBeTruthy()
  expect(uploadCall[1].body.get('sender_id')).toBe('student-1')
  expect(uploadCall[1].body.get('receiver_id')).toBe('student-2')
  expect(uploadCall[1].body.get('content')).toBe('ส่งข้อความพร้อมรูป')
  expect(uploadCall[1].body.get('attachments').name).toBe('room.jpg')
  expect(uploadCall[1].headers).toBeUndefined()
})

test('test_AC_CHAT_02B_ui_reports_invalid_attachment', async () => {
  const fetchMock = mockChatApi({
    attachmentError: 'Only JPG, PNG, and PDF attachments are supported',
    messages: [{
      id: 'existing-message',
      sender_id: 'student-2',
      receiver_id: 'student-1',
      content: 'ประวัติก่อนเลือกไฟล์',
      created_at: '2026-11-13T10:00:00+07:00',
    }],
  })
  vi.stubGlobal('fetch', fetchMock)
  render(<ChatListPage />)

  expect(await screen.findByText('ประวัติก่อนเลือกไฟล์')).toBeTruthy()
  const file = new File(['text'], 'notes.txt', { type: 'text/plain' })
  selectFile(await screen.findByLabelText('เลือกไฟล์แนบ'), file)
  fireEvent.change(screen.getByLabelText('พิมพ์ข้อความ'), {
    target: { value: 'ข้อความพร้อมไฟล์ที่ไม่รองรับ' },
  })
  fireEvent.click(screen.getByRole('button', { name: 'ส่ง' }))

  expect((await screen.findByRole('alert')).textContent).toContain(
    'Only JPG, PNG, and PDF attachments are supported',
  )
  expect(document.querySelector('[data-message-side="current-user"]')).toBeNull()
})

test('test_AC_CHAT_02B_ui_rejects_attachment_over_size_limit', async () => {
  const fetchMock = mockChatApi({
    messages: [{
      id: 'existing-message',
      sender_id: 'student-2',
      receiver_id: 'student-1',
      content: 'ประวัติก่อนเลือกไฟล์',
      created_at: '2026-11-13T10:00:00+07:00',
    }],
  })
  vi.stubGlobal('fetch', fetchMock)
  render(<ChatListPage />)

  expect(await screen.findByText('ประวัติก่อนเลือกไฟล์')).toBeTruthy()
  const file = new File(
    [new Uint8Array(CHAT_CONFIG.attachmentMaxSizeBytes + 1)],
    'large.pdf',
    { type: 'application/pdf' },
  )
  selectFile(await screen.findByLabelText('เลือกไฟล์แนบ'), file)

  expect(screen.getByRole('alert').textContent).toContain('ไฟล์แนบมีขนาดใหญ่เกินขีดจำกัด')
  expect(fetchMock.mock.calls.some(
    ([url]) => url === '/api/chat/messages/with-attachment',
  )).toBe(false)
})

test('test_AC_CHAT_03A_ui_shows_attachment_in_history', async () => {
  vi.stubGlobal('fetch', mockChatApi({
    messages: [{
      id: 'msg-attachment',
      sender_id: 'student-2',
      receiver_id: 'student-1',
      content: 'ส่งเอกสารมาให้แล้ว',
      created_at: '2026-11-13T10:00:00+07:00',
      attachment: {
        id: 18,
        name: 'details.pdf',
        content_type: 'application/pdf',
        size_bytes: 32,
        download_url: '/api/chat/attachments/18',
      },
    }],
  }))

  render(<ChatListPage />)

  const attachmentLink = await screen.findByRole('link', {
    name: 'เปิดไฟล์แนบ details.pdf',
  })
  expect(attachmentLink.getAttribute('href')).toBe('/api/chat/attachments/18')
  expect(document.querySelector('[data-message-side="conversation-partner"]')
    .contains(attachmentLink)).toBe(true)
})

test('test_AC_CHAT_03C_ui_opens_attachment_within_retention', async () => {
  vi.stubGlobal('fetch', mockChatApi({
    messages: [{
      id: 'msg-retained',
      sender_id: 'student-2',
      receiver_id: 'student-1',
      content: 'ไฟล์ยังเปิดได้',
      created_at: '2026-11-13T10:00:00+07:00',
      attachment: {
        id: 19,
        name: 'retained.jpg',
        content_type: 'image/jpeg',
        size_bytes: 24,
        download_url: '/api/chat/attachments/19',
      },
    }],
  }))

  render(<ChatListPage />)

  const attachmentLink = await screen.findByRole('link', {
    name: 'เปิดไฟล์แนบ retained.jpg',
  })
  expect(attachmentLink.getAttribute('href')).toBe('/api/chat/attachments/19')
  expect(attachmentLink.getAttribute('target')).toBe('_blank')
})

test('test_AC_CHAT_03D_ui_hides_expired_attachment', async () => {
  vi.stubGlobal('fetch', mockChatApi({
    messages: [{
      id: 'msg-expired',
      sender_id: 'student-2',
      receiver_id: 'student-1',
      content: 'ข้อความยังอยู่',
      created_at: '2026-10-01T10:00:00+07:00',
      attachment: null,
    }],
  }))

  render(<ChatListPage />)

  expect(await screen.findByText('ข้อความยังอยู่')).toBeTruthy()
  expect(screen.queryByRole('link', { name: /เปิดไฟล์แนบ/ })).toBeNull()
})

test('test_AC_CHAT_03B_ui_marks_only_visible_message_read', async () => {
  vi.stubGlobal('IntersectionObserver', TestIntersectionObserver)
  const fetchMock = mockChatApi({
    messages: [
      {
        id: 41,
        sender_id: 'student-2',
        receiver_id: 'student-1',
        content: 'ข้อความที่เห็น',
        is_read: false,
        created_at: '2026-11-13T10:00:00+07:00',
      },
      {
        id: 42,
        sender_id: 'student-2',
        receiver_id: 'student-1',
        content: 'ข้อความที่ยังอยู่นอกจอ',
        is_read: false,
        created_at: '2026-11-13T10:01:00+07:00',
      },
      {
        id: 43,
        sender_id: 'student-1',
        receiver_id: 'student-2',
        content: 'ข้อความของฉัน',
        is_read: false,
        created_at: '2026-11-13T10:02:00+07:00',
      },
    ],
  })
  vi.stubGlobal('fetch', fetchMock)
  render(<ChatListPage />)

  const visibleMessage = await screen.findByText('ข้อความที่เห็น')
  const observer = intersectionObservers.at(-1)
  const visibleElement = visibleMessage.closest('[data-message-id]')
  const offscreenElement = screen.getByText('ข้อความที่ยังอยู่นอกจอ').closest('[data-message-id]')
  expect(observer.options.root.contains(visibleElement)).toBe(true)

  act(() => observer.trigger(visibleElement, false))
  expect(fetchMock.mock.calls.some(([url]) => url === '/api/chat/messages/41/read')).toBe(false)

  act(() => observer.trigger(visibleElement, true))
  await waitFor(() => {
    expect(fetchMock.mock.calls.some(([url]) => url === '/api/chat/messages/41/read')).toBe(true)
  })
  expect(fetchMock.mock.calls.some(([url]) => url === '/api/chat/messages/42/read')).toBe(false)
  expect(fetchMock.mock.calls.some(([url]) => url === '/api/chat/messages/43/read')).toBe(false)
  expect(visibleElement.textContent).toContain('Read')
  expect(offscreenElement.textContent).not.toContain(' · Read')
})

test('test_AC_CHAT_07B_ui_loads_existing_history_read_only', async () => {
  const fetchMock = mockChatApi({
    readOnly: true,
    reason: 'A participant is not searchable',
    messages: [{
      id: 51,
      sender_id: 'student-2',
      receiver_id: 'student-1',
      content: 'ประวัติเดิมแบบอ่านอย่างเดียว',
      is_read: true,
      created_at: '2026-11-13T10:03:00+07:00',
    }],
  })
  vi.stubGlobal('fetch', fetchMock)
  render(<ChatListPage />)

  expect(await screen.findByText('ประวัติเดิมแบบอ่านอย่างเดียว')).toBeTruthy()
  expect(await screen.findByText('แชทนี้อ่านได้อย่างเดียว')).toBeTruthy()
  expect(screen.queryByLabelText('พิมพ์ข้อความ')).toBeNull()
  expect(screen.queryByRole('button', { name: 'แนบไฟล์' })).toBeNull()
  expect(fetchMock.mock.calls.some(
    ([url]) => url === '/api/chat/messages?sender_id=student-1&receiver_id=student-2',
  )).toBe(true)
  expect(fetchMock.mock.calls.some(
    ([url]) => url === '/api/chat/messages' || url === '/api/chat/messages/with-attachment',
  )).toBe(false)
})

test('test_AC_CHAT_07_ui_displays_start_denial_reason', async () => {
  const fetchMock = mockChatApi({
    allowed: false,
    reason: 'ผู้รับไม่อยู่ในสถานะที่อนุญาตให้เริ่มแชท',
  })
  vi.stubGlobal('fetch', fetchMock)

  render(<ChatListPage />)

  expect((await screen.findByRole('alert')).textContent).toContain(
    'ไม่สามารถเริ่มแชทได้: ผู้รับไม่อยู่ในสถานะที่อนุญาตให้เริ่มแชท',
  )
  expect(fetchMock.mock.calls.some(([url]) => String(url).startsWith('/api/chat/messages?'))).toBe(false)
})

test('test_AC_CHAT_07A_ui_opens_allowed_recipient', async () => {
  vi.stubGlobal('fetch', mockChatApi())

  render(<ChatListPage />)

  expect(await screen.findByRole('button', { name: 'เปิดแชทกับ ผู้ติดต่อทดสอบ' })).toBeTruthy()
  expect((await screen.findAllByText('ผู้ติดต่อทดสอบ')).length).toBeGreaterThanOrEqual(2)
  expect(screen.queryByRole('alert')).toBeNull()
})

test('dev demo flag renders the Chat UI in the app entry point', async () => {
  vi.stubEnv('DEV', true)
  vi.stubEnv('MODE', 'development')
  vi.stubEnv('VITE_CHAT_DEMO_MODE', 'true')
  vi.stubGlobal('fetch', mockChatApi())

  render(<App />)

  expect(await screen.findByText('แชทกับรูมเมท')).toBeTruthy()
  expect(await screen.findByText('โหมดสาธิต: รายชื่อและข้อมูลนี้เป็นข้อมูลตัวอย่าง')).toBeTruthy()
})

test('dev defaults to the Chat UI when the demo flag is unset', async () => {
  vi.stubEnv('DEV', true)
  vi.stubEnv('MODE', 'development')
  vi.stubEnv('VITE_CHAT_DEMO_MODE', '')
  vi.stubGlobal('fetch', mockChatApi())

  render(<App />)

  expect(await screen.findByText('แชทกับรูมเมท')).toBeTruthy()
})

test('dev can opt out of the default Chat UI', () => {
  vi.stubEnv('DEV', true)
  vi.stubEnv('MODE', 'development')
  vi.stubEnv('VITE_CHAT_DEMO_MODE', 'false')

  render(<App />)

  expect(screen.getByText('โปรไฟล์หาเมท')).toBeTruthy()
  expect(screen.queryByText('แชทกับรูมเมท')).toBeNull()
})

test('production build keeps the existing profile page despite the demo flag', () => {
  vi.stubEnv('DEV', false)
  vi.stubEnv('VITE_CHAT_DEMO_MODE', 'true')

  render(<App />)

  expect(screen.getByText('โปรไฟล์หาเมท')).toBeTruthy()
  expect(screen.queryByText('แชทกับรูมเมท')).toBeNull()
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

  render(<ChatPage conversation={conversation} currentUserId="student-1" />)

  expect(screen.getByText('สวัสดี แพรวครับ ผมสนใจห้องพักของคุณ')).toBeTruthy()
  expect(screen.getByText('สวัสดีครับ ห้องพักยังว่างอยู่ตอนนี้')).toBeTruthy()
  expect(screen.getByLabelText('พิมพ์ข้อความ')).toBeTruthy()
})

test('test_AC_CHAT_02_ui_sends_confirmed_message', async () => {
  const fetchMock = mockChatApi({
    messages: [{
      id: 'msg-initial',
      sender_id: 'student-2',
      receiver_id: 'student-1',
      content: 'ประวัติพร้อมก่อนส่ง',
      created_at: '2026-11-13T10:00:00+07:00',
    }],
  })
  vi.stubGlobal('fetch', fetchMock)
  const { unmount } = render(<ChatListPage />)

  const composer = await screen.findByLabelText('พิมพ์ข้อความ')
  expect(await screen.findByText('ประวัติพร้อมก่อนส่ง')).toBeTruthy()
  fireEvent.change(composer, { target: { value: 'ส่งผ่าน API จริง' } })
  fireEvent.click(screen.getByRole('button', { name: 'ส่ง' }))

  expect(await screen.findByText('ส่งผ่าน API จริง')).toBeTruthy()
  expect(fetchMock).toHaveBeenCalledWith('/api/chat/messages', expect.objectContaining({
    method: 'POST',
    body: JSON.stringify({
      sender_id: 'student-1',
      receiver_id: 'student-2',
      content: 'ส่งผ่าน API จริง',
    }),
  }))

  unmount()
  render(<ChatListPage />)
  expect(await screen.findByText('ส่งผ่าน API จริง')).toBeTruthy()
})

test('test_AC_CHAT_03_ui_loads_received_message', async () => {
  vi.stubGlobal('fetch', mockChatApi({
    messages: [
      {
        id: 21,
        sender_id: 'student-1',
        receiver_id: 'student-2',
        content: 'ข้อความที่ฉันส่ง',
        created_at: '2026-11-13T10:10:00+07:00',
      },
      {
        id: 22,
        sender_id: 'student-2',
        receiver_id: 'student-1',
        content: 'ข้อความที่ได้รับ',
        created_at: '2026-11-13T10:12:00+07:00',
      },
    ],
  }))

  render(<ChatListPage />)

  expect(await screen.findByText('ข้อความที่ฉันส่ง')).toBeTruthy()
  expect(await screen.findByText('ข้อความที่ได้รับ')).toBeTruthy()
  expect(document.querySelector('[data-message-side="current-user"]')?.textContent)
    .toContain('ข้อความที่ฉันส่ง')
  expect(document.querySelector('[data-message-side="conversation-partner"]')?.textContent)
    .toContain('ข้อความที่ได้รับ')
})

test('test_AC_CHAT_02C_ui_rejects_invalid_text', () => {
  const conversation = {
    id: 'student-2',
    name: 'แพรว',
    avatar: 'P',
    status: 'ออนไลน์',
    messages: [],
  }

  const fetchMock = vi.fn()
  vi.stubGlobal('fetch', fetchMock)
  render(<ChatPage conversation={conversation} currentUserId="student-1" />)

  fireEvent.change(screen.getByLabelText('พิมพ์ข้อความ'), { target: { value: '   ' } })
  fireEvent.click(screen.getByRole('button', { name: 'ส่ง' }))
  expect(screen.getByRole('alert').textContent).toContain('กรุณาพิมพ์ข้อความก่อนส่ง')

  const longText = 'a'.repeat(2001)
  fireEvent.change(screen.getByLabelText('พิมพ์ข้อความ'), { target: { value: longText } })
  fireEvent.click(screen.getByRole('button', { name: 'ส่ง' }))
  expect(screen.getByRole('alert').textContent).toContain('ข้อความต้องไม่เกิน 2000 ตัวอักษร')
  expect(fetchMock).not.toHaveBeenCalled()
})

function failedResponse(reason, status = 503) {
  return {
    ok: false,
    status,
    json: async () => ({ detail: reason }),
  }
}

function sentResponse(id, content) {
  return {
    ok: true,
    status: 200,
    json: async () => ({
      id,
      sender_id: 'student-1',
      receiver_id: 'student-2',
      content,
      created_at: '2026-11-13T10:15:00+07:00',
    }),
  }
}

test('test_AC_CHAT_04_ui_reports_failure_and_allows_retry', async () => {
  const fetchMock = vi.fn()
    .mockResolvedValueOnce(failedResponse('ระบบบันทึกข้อความไม่ได้', 403))
    .mockResolvedValueOnce(sentResponse('msg-retried', 'ลองใหม่แล้วสำเร็จ'))
  vi.stubGlobal('fetch', fetchMock)

  const conversation = {
    id: 'student-2',
    name: 'คู่สนทนาจาก API',
    avatar: 'ค',
    messages: [],
  }
  render(<ChatPage conversation={conversation} currentUserId="student-1" />)

  fireEvent.change(screen.getByLabelText('พิมพ์ข้อความ'), { target: { value: 'ลองใหม่แล้วสำเร็จ' } })
  fireEvent.click(screen.getByRole('button', { name: 'ส่ง' }))

  expect((await screen.findByRole('alert')).textContent).toContain('ระบบบันทึกข้อความไม่ได้')
  expect(document.querySelector('[data-message-side]')?.textContent ?? '')
    .not.toContain('ลองใหม่แล้วสำเร็จ')
  fireEvent.click(screen.getByRole('button', { name: 'ลองส่งอีกครั้ง' }))
  expect(await screen.findByText('ลองใหม่แล้วสำเร็จ')).toBeTruthy()
  expect(fetchMock).toHaveBeenCalledTimes(2)
})

test('test_AC_CHAT_04A_ui_shows_final_failure_and_manual_retry', async () => {
  const reason = 'ไม่สามารถบันทึกข้อความได้ กรุณาลองใหม่'
  const fetchMock = vi.fn()
    .mockResolvedValueOnce(failedResponse(reason))
    .mockResolvedValueOnce(failedResponse(reason))
    .mockResolvedValueOnce(failedResponse(reason))
    .mockResolvedValueOnce(failedResponse(reason))
    .mockResolvedValueOnce(sentResponse('msg-after-manual-retry', 'ส่งสำเร็จหลังลองอีกครั้ง'))
  vi.stubGlobal('fetch', fetchMock)

  const conversation = {
    id: 'student-2',
    name: 'คู่สนทนาจาก API',
    avatar: 'ค',
    messages: [],
  }
  render(<ChatPage conversation={conversation} currentUserId="student-1" />)

  fireEvent.change(screen.getByLabelText('พิมพ์ข้อความ'), { target: { value: 'ส่งสำเร็จหลังลองอีกครั้ง' } })
  fireEvent.click(screen.getByRole('button', { name: 'ส่ง' }))

  expect((await screen.findByRole('alert')).textContent).toContain(reason)
  expect(fetchMock).toHaveBeenCalledTimes(CHAT_CONFIG.automaticRetryLimit + 1)
  expect(document.querySelector('[data-message-side]')?.textContent ?? '')
    .not.toContain('ส่งสำเร็จหลังลองอีกครั้ง')

  fireEvent.click(screen.getByRole('button', { name: 'ลองส่งอีกครั้ง' }))
  expect(await screen.findByText('ส่งสำเร็จหลังลองอีกครั้ง')).toBeTruthy()
  expect(fetchMock).toHaveBeenCalledTimes(CHAT_CONFIG.automaticRetryLimit + 2)
})

test('sendChatMessage_dev_mode_throws_when_api_fails', async () => {
  vi.stubEnv('DEV', true)
  vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('network down')))

  await expect(fetchChatMessages('student-2', 'student-1')).rejects.toThrow('network down')
  await expect(sendChatMessage({ senderId: 'student-1', receiverId: 'student-2', text: 'hello' })).rejects.toThrow('ไม่สามารถเชื่อมต่อระบบได้ กรุณาลองใหม่')
})

test('sendChatMessage_rejects_response_missing_required_fields', async () => {
  vi.stubEnv('DEV', false)
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
    ok: true,
    json: async () => ({ id: 'msg-new', text: 'hello', createdAt: '2026-11-13T10:15:00+07:00' }),
  }))

  await expect(sendChatMessage({ senderId: 'student-1', receiverId: 'student-2', text: 'hello' })).rejects.toThrow('Send message API returned invalid payload')
})
