// Supports FR-CHAT-01, FR-CHAT-02, FR-CHAT-08 and FR-CHAT-12 through the Backend API.
import { CHAT_CONFIG } from '../config.js'

const API_BASE = import.meta.env.VITE_CHAT_API_BASE || '/api'

export const MESSAGE_RULES = {
  maxLength: CHAT_CONFIG.messageMaxLength,
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
  const response = await fetch(`${API_BASE}/chat/list`)
  if (!response.ok) {
    throw new Error(`Chat list API unavailable (${response.status})`)
  }

  const data = await response.json()
  if (
    !data ||
    typeof data.current_user_id !== 'string' ||
    !data.current_user_id.trim() ||
    typeof data.demo_mode !== 'boolean' ||
    !Array.isArray(data.contacts)
  ) {
    throw new Error('Chat list API returned invalid payload')
  }

  const contacts = data.contacts.map((contact) => {
    if (
      !contact ||
      typeof contact.id !== 'string' ||
      !contact.id.trim() ||
      typeof contact.name !== 'string' ||
      !contact.name.trim()
    ) {
      throw new Error('Chat list API returned invalid contact')
    }

    return {
      id: contact.id,
      name: contact.name,
      avatar: contact.name.trim().slice(0, 1),
      summary: '',
    }
  })

  return {
    currentUserId: data.current_user_id,
    demoMode: data.demo_mode,
    contacts,
  }
}

export async function openChat(senderId, recipientId) {
  const response = await fetch(`${API_BASE}/chat/open`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sender_id: senderId, recipient_id: recipientId }),
  })
  if (!response.ok) {
    throw new Error(`Chat start API unavailable (${response.status})`)
  }

  const data = await response.json()
  if (typeof data?.allowed !== 'boolean' || typeof data?.read_only !== 'boolean') {
    throw new Error('Chat start API returned invalid payload')
  }
  if (!data.allowed && (typeof data.reason !== 'string' || !data.reason.trim())) {
    throw new Error('Chat start API returned denial without a reason')
  }
  if (!data.allowed && data.read_only) {
    throw new Error('Chat start API returned read-only state for a denied chat')
  }
  if (data.allowed && (typeof data.room_id !== 'string' || !data.room_id.trim())) {
    throw new Error('Chat start API returned invalid room')
  }

  return {
    allowed: data.allowed,
    readOnly: data.read_only,
    reason: data.reason ?? null,
    roomId: data.room_id ?? null,
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

  let attachment = null
  if (rawMessage.attachment !== undefined && rawMessage.attachment !== null) {
    const rawAttachment = rawMessage.attachment
    const downloadUrl = rawAttachment?.download_url
    if (
      !rawAttachment ||
      typeof rawAttachment !== 'object' ||
      typeof rawAttachment.name !== 'string' ||
      !rawAttachment.name.trim() ||
      typeof rawAttachment.content_type !== 'string' ||
      !Number.isInteger(rawAttachment.size_bytes) ||
      rawAttachment.size_bytes < 0 ||
      typeof downloadUrl !== 'string' ||
      !/^\/api\/chat\/attachments\/\d+$/.test(downloadUrl)
    ) {
      return null
    }

    attachment = {
      id: rawAttachment.id,
      name: rawAttachment.name,
      contentType: rawAttachment.content_type,
      sizeBytes: rawAttachment.size_bytes,
      downloadUrl,
    }
  }

  return {
    id: rawMessage.id,
    senderId: String(senderId),
    receiverId: String(receiverId),
    text: String(text),
    createdAt: String(createdAt),
    isRead: rawMessage.is_read === true,
    status: String(rawMessage.status ?? (rawMessage.is_read === true ? 'Read' : fallbackStatus)),
    attachment,
  }
}

export async function fetchChatMessages(peerId, currentUserId) {
  if (!peerId || !currentUserId) {
    throw new Error('Chat history requires both conversation participants')
  }

  const params = new URLSearchParams({
    sender_id: currentUserId,
    receiver_id: peerId,
  })
  const response = await fetch(`${API_BASE}/chat/messages?${params.toString()}`)
  if (!response.ok) {
    throw new Error(`Chat history API unavailable (${response.status})`)
  }

  const data = await response.json()
  if (!Array.isArray(data)) {
    throw new Error('Chat history API returned invalid payload')
  }

  return data
    .map((message) => normalizeChatMessage(message, 'Sent'))
    .filter(Boolean)
}

export async function markChatMessageRead(messageId) {
  const parsedMessageId = Number(messageId)
  if (!Number.isInteger(parsedMessageId) || parsedMessageId < 1) {
    throw new Error('Read status requires a valid message ID')
  }

  const response = await fetch(`${API_BASE}/chat/messages/${parsedMessageId}/read`, {
    method: 'POST',
  })
  if (!response.ok) {
    const errorPayload = await response.json().catch(() => null)
    const detail = typeof errorPayload?.detail === 'string'
      ? errorPayload.detail.trim()
      : ''
    throw new Error(detail || `อัปเดตสถานะการอ่านไม่สำเร็จ (HTTP ${response.status})`)
  }

  const data = await response.json()
  if (data?.id !== parsedMessageId || data?.is_read !== true) {
    throw new Error('Read status API returned invalid payload')
  }

  return { id: data.id, isRead: data.is_read }
}

export async function sendChatMessage({ senderId, receiverId, text }) {
  // FR-CHAT-03/04/05/07/13/14, CON-REL-01: retry transient failures and accept only confirmed messages.
  const validation = validateChatMessage(text)
  if (!validation.ok) {
    throw new Error(validation.error)
  }

  const payload = {
    sender_id: senderId,
    receiver_id: receiverId,
    content: validation.value,
  }

  for (let retry = 0; ; retry += 1) {
    let response
    try {
      response = await fetch(`${API_BASE}/chat/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
    } catch {
      if (retry < CHAT_CONFIG.automaticRetryLimit) {
        continue
      }
      throw new Error('ไม่สามารถเชื่อมต่อระบบได้ กรุณาลองใหม่')
    }

    if (!response.ok) {
      const errorPayload = await response.json().catch(() => null)
      const detail = typeof errorPayload?.detail === 'string'
        ? errorPayload.detail.trim()
        : ''
      const reason = detail || `ส่งข้อความไม่สำเร็จ (HTTP ${response.status})`

      if (response.status >= 500 && retry < CHAT_CONFIG.automaticRetryLimit) {
        continue
      }
      throw new Error(reason)
    }

    const data = await response.json()
    const normalizedMessage = normalizeChatMessage(data, 'Sent')
    if (
      !normalizedMessage ||
      !normalizedMessage.text ||
      !normalizedMessage.senderId ||
      !normalizedMessage.receiverId ||
      !normalizedMessage.createdAt
    ) {
      throw new Error('Send message API returned invalid payload')
    }
    if (
      normalizedMessage.senderId !== senderId ||
      normalizedMessage.receiverId !== receiverId ||
      normalizedMessage.text !== validation.value
    ) {
      throw new Error('Send message API returned a message that does not match the request')
    }

    return {
      ...normalizedMessage,
      status: normalizedMessage.status ?? 'Sent',
    }
  }
}

export async function sendChatMessageWithAttachment({ senderId, receiverId, text, file }) {
  // FR-CHAT-09/11/16 and AC-CHAT-02A: accept only Backend-confirmed message and attachment data.
  const validation = validateChatMessage(text)
  if (!validation.ok) {
    throw new Error(validation.error)
  }
  if (!file) {
    throw new Error('กรุณาเลือกไฟล์แนบก่อนส่ง')
  }

  const formData = new FormData()
  formData.append('sender_id', senderId)
  formData.append('receiver_id', receiverId)
  formData.append('content', validation.value)
  formData.append('attachments', file)

  const response = await fetch(`${API_BASE}/chat/messages/with-attachment`, {
    method: 'POST',
    body: formData,
  })
  if (!response.ok) {
    const errorPayload = await response.json().catch(() => null)
    const detail = typeof errorPayload?.detail === 'string'
      ? errorPayload.detail.trim()
      : ''
    throw new Error(detail || `ส่งข้อความไม่สำเร็จ (HTTP ${response.status})`)
  }

  const data = await response.json()
  const normalizedMessage = normalizeChatMessage(data, 'Sent')
  if (
    !normalizedMessage ||
    !normalizedMessage.attachment ||
    normalizedMessage.senderId !== senderId ||
    normalizedMessage.receiverId !== receiverId ||
    normalizedMessage.text !== validation.value
  ) {
    throw new Error('Send attachment API returned an invalid response')
  }

  return {
    ...normalizedMessage,
    status: normalizedMessage.status ?? 'Sent',
  }
}
