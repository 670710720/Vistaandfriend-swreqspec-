// Supports FR-CHAT-01, FR-CHAT-02 and AC-CHAT-01 while keeping the API
// connection isolated from the UI; backend is still pending, so mock data is
// explicitly used only as a fallback.

const mockContacts = [
  {
    id: 'student-2',
    name: 'แพรว',
    summary: 'สวัสดีครับ กำลังดูห้องแถว ม.กังสดาล',
    online: true,
    avatar: 'P',
    status: 'ออนไลน์',
  },
  {
    id: 'student-3',
    name: 'เจน',
    summary: 'ได้โปรดตรวจสอบค่าเช่ารอบเดือน',
    online: false,
    avatar: 'J',
    status: 'ออฟไลน์',
  },
  {
    id: 'student-4',
    name: 'นัท',
    summary: 'ห้องเช่าของเราอยู่ใกล้ BTS',
    online: true,
    avatar: 'N',
    status: 'ออนไลน์',
  },
]

const mockConversationById = {
  'student-2': [
    {
      id: 'msg-1',
      senderId: 'student-1',
      receiverId: 'student-2',
      text: 'สวัสดี แพรวครับ ผมสนใจห้องพักของคุณ',
      createdAt: '2026-11-12T09:00:00+07:00',
      status: 'Read',
      attachment: null,
    },
    {
      id: 'msg-2',
      senderId: 'student-2',
      receiverId: 'student-1',
      text: 'สวัสดีครับ ห้องพักยังว่างอยู่ตอนนี้',
      createdAt: '2026-11-12T09:02:00+07:00',
      status: 'Read',
      attachment: null,
    },
    {
      id: 'msg-3',
      senderId: 'student-1',
      receiverId: 'student-2',
      text: 'ดีมากครับ ขอรายละเอียดเพิ่มเติมได้ไหม',
      createdAt: '2026-11-12T09:04:00+07:00',
      status: 'Sent',
      attachment: null,
    },
  ],
  'student-3': [
    {
      id: 'msg-4',
      senderId: 'student-3',
      receiverId: 'student-1',
      text: 'ค่าเช่า 4,500 บาท สัปดาห์นี้มีเรื่องรอชี้แจง',
      createdAt: '2026-11-11T18:30:00+07:00',
      status: 'Read',
      attachment: null,
    },
  ],
  'student-4': [
    {
      id: 'msg-5',
      senderId: 'student-1',
      receiverId: 'student-4',
      text: 'ห้องของคุณอยู่ใกล้ MRT ใช่ไหมครับ',
      createdAt: '2026-11-09T15:10:00+07:00',
      status: 'Read',
      attachment: null,
    },
  ],
}

const API_BASE = import.meta.env.VITE_CHAT_API_BASE || '/api'

export const MESSAGE_RULES = {
  maxLength: 2000,
}

function shouldUseMockData() {
  return Boolean(import.meta.env.DEV)
}

function handleFallbackError(featureName, fallbackData, error) {
  if (shouldUseMockData()) {
    return fallbackData
  }

  if (error instanceof Error) {
    throw error
  }

  throw new Error(`${featureName} API failed`)
}

export function validateChatMessage(rawText) {
  const text = String(rawText ?? '').trim()

  if (!text) {
    return { ok: false, error: 'กรุณาพิมพ์ข้อความก่อนส่ง' }
  }

  if (text.length > MESSAGE_RULES.maxLength) {
    return { ok: false, error: `ข้อความต้องไม่เกิน ${MESSAGE_RULES.maxLength} ตัวอักษร` }
  }

  return { ok: true, value: text }
}

export async function fetchChatList() {
  try {
    const response = await fetch(`${API_BASE}/chat/list`)
    if (!response.ok) {
      throw new Error('Chat list API unavailable')
    }

    const data = await response.json()
    if (!Array.isArray(data)) {
      throw new Error('Chat list API returned invalid payload')
    }

    return data
  } catch (error) {
    return handleFallbackError('Chat list', mockContacts, error)
  }
}

function normalizeChatMessage(rawMessage, fallbackStatus = 'Read') {
  if (!rawMessage || typeof rawMessage !== 'object') {
    return null
  }

  const senderId = rawMessage.senderId ?? rawMessage.sender_id
  const receiverId = rawMessage.receiverId ?? rawMessage.receiver_id
  const createdAt = rawMessage.createdAt ?? rawMessage.created_at
  const text = rawMessage.text ?? rawMessage.content

  const hasRequiredFields =
    rawMessage.id !== undefined &&
    rawMessage.id !== null &&
    senderId !== undefined &&
    senderId !== null &&
    receiverId !== undefined &&
    receiverId !== null &&
    text !== undefined &&
    text !== null &&
    createdAt !== undefined &&
    createdAt !== null &&
    String(senderId).trim() !== '' &&
    String(receiverId).trim() !== '' &&
    String(text).trim() !== '' &&
    String(createdAt).trim() !== ''

  if (!hasRequiredFields) {
    return null
  }

  return {
    id: rawMessage.id,
    senderId: String(senderId),
    receiverId: String(receiverId),
    text: String(text),
    createdAt: String(createdAt),
    status: String(rawMessage.status ?? fallbackStatus),
    attachment: rawMessage.attachment ?? null,
  }
}

export async function fetchChatMessages(peerId, currentUserId = 'student-1') {
  try {
    const params = new URLSearchParams({
      sender_id: currentUserId,
      receiver_id: peerId,
    })
    const response = await fetch(`${API_BASE}/chat/messages?${params.toString()}`)
    if (!response.ok) {
      throw new Error('Chat history API unavailable')
    }

    const data = await response.json()
    if (!Array.isArray(data)) {
      throw new Error('Chat history API returned invalid payload')
    }

    return data
      .map((message) => normalizeChatMessage(message, 'Read'))
      .filter(Boolean)
  } catch (error) {
    const fallbackData = mockConversationById[peerId] ?? []
    return handleFallbackError('Chat history', fallbackData, error)
  }
}

export async function sendChatMessage({ senderId, receiverId, text }) {
  const validation = validateChatMessage(text)
  if (!validation.ok) {
    throw new Error(validation.error)
  }

  const payload = {
    sender_id: senderId,
    receiver_id: receiverId,
    content: validation.value,
  }

  try {
    const response = await fetch(`${API_BASE}/chat/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      throw new Error('Send message API unavailable')
    }

    const data = await response.json()
    const normalizedMessage = normalizeChatMessage(data, 'Sent')
    if (!normalizedMessage || !normalizedMessage.text || !normalizedMessage.senderId || !normalizedMessage.receiverId || !normalizedMessage.createdAt) {
      throw new Error('Send message API returned invalid payload')
    }

    return {
      ...normalizedMessage,
      status: normalizedMessage.status ?? 'Sent',
    }
  } catch (error) {
    if (error instanceof Error) {
      throw error
    }

    throw new Error('Send message API failed')
  }
}

export { mockContacts, mockConversationById }
