import { ROOMMATE_REQUEST_CONFIG } from '../config.js'

// รองรับ FR-RRS-01, FR-RRS-02, FR-RRS-11, FR-RRS-14, CON-RRS-07, CON-RRS-09, CON-RRS-10
export const MAX_MESSAGE_LENGTH = ROOMMATE_REQUEST_CONFIG.maxMessageLength

// รองรับ CON-RRS-10, FR-RRS-14
export function getUnicodeCodePointLength(value) {
  return Array.from(value).length
}

export const ROOMMATE_REQUEST_STATUS_LABELS = {
  pending: 'รอการตอบรับ',
  accepted: 'ตอบรับ',
  rejected: 'ปฏิเสธ',
  cancelled: 'ยกเลิก',
}

export function normalizeRoommateRequestStatus(status) {
  const normalized = String(status ?? '').trim().toLowerCase()
  if (!normalized) return 'pending'

  const aliases = {
    'รอการตอบรับ': 'pending',
    pending: 'pending',
    accepted: 'accepted',
    'ตอบรับ': 'accepted',
    rejected: 'rejected',
    'ปฏิเสธ': 'rejected',
    cancelled: 'cancelled',
    'ยกเลิก': 'cancelled',
  }

  return aliases[normalized] || normalized
}

export function getRoommateRequestStatusLabel(status) {
  return ROOMMATE_REQUEST_STATUS_LABELS[normalizeRoommateRequestStatus(status)] || 'รอการตอบรับ'
}

export async function createRoommateRequest({
  senderId,
  receiverId,
  message = '',
  receiverStatus = 'looking_for_roommate',
} = {}) {
  if (!receiverId) {
    throw new Error('กรุณาเลือกโปรไฟล์ผู้รับก่อนส่งคำขอ')
  }

  const normalizedMessage = String(message ?? '')
  if (getUnicodeCodePointLength(normalizedMessage) > MAX_MESSAGE_LENGTH) {
    throw new Error(`ข้อความประกอบต้องไม่เกิน ${MAX_MESSAGE_LENGTH} ตัวอักษร`)
  }

  const payload = {
    senderId,
    receiverId,
    message: normalizedMessage,
    receiverStatus,
  }

  if (typeof fetch === 'undefined') {
    return { ok: true, data: payload }
  }

  const response = await fetch('/api/roommate-requests', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  const result = await response.json().catch(() => ({}))
  if (!response.ok) {
    throw new Error(result.message || result.error || 'ไม่สามารถส่งคำขอเป็นเมทได้')
  }

  return result
}

export const requestRoommate = createRoommateRequest
export const submitRoommateRequest = createRoommateRequest

export default {
  createRoommateRequest,
  requestRoommate,
  submitRoommateRequest,
}
