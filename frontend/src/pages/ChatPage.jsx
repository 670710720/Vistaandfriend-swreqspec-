import { useEffect, useRef, useState } from 'react'

import {
  markChatMessageRead,
  sendChatMessage,
  sendChatMessageWithAttachment,
  validateChatMessage,
} from '../api/client.js'
import { CHAT_CONFIG } from '../config.js'

// Supports FR-CHAT-03/04/05/06/07/09/11/13/14/16, CON-REL-01 and AC-CHAT-02/02A/02B/02C/03/03A/03C/03D/04/04A.
// A message is shown as sent only after the Backend confirms and returns it.

const styles = {
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    minWidth: 0,
    background: '#fff',
    height: '100%',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '18px 22px',
    borderBottom: '1px solid #e2e7ea',
    background: '#fff',
  },
  avatar: {
    width: '42px',
    height: '42px',
    borderRadius: '50%',
    background: '#dce9e5',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
    color: '#1f3d38',
    flexShrink: 0,
  },
  headerMeta: {
    flex: 1,
    minWidth: 0,
  },
  title: {
    margin: 0,
    fontSize: '18px',
    fontWeight: 700,
  },
  subtitle: {
    margin: '4px 0 0',
    color: '#718087',
    fontSize: '13px',
  },
  messages: {
    flex: 1,
    padding: '22px',
    background: '#fafbfc',
    minHeight: '340px',
    overflowY: 'auto',
  },
  message: {
    maxWidth: '78%',
    padding: '12px 14px',
    borderRadius: '12px',
    marginBottom: '14px',
    lineHeight: 1.5,
    background: '#e9eef1',
    color: '#1c2c2f',
    boxShadow: '0 1px 1px rgba(15, 23, 42, 0.04)',
  },
  messageMine: {
    marginLeft: 'auto',
    background: '#dcefe7',
  },
  timestamp: {
    display: 'block',
    marginTop: '6px',
    color: '#64736d',
    textAlign: 'right',
    fontSize: '11px',
  },
  attachment: {
    display: 'block',
    padding: '10px',
    border: '1px solid #cbd7d2',
    borderRadius: '8px',
    marginTop: '8px',
    background: '#fff',
    fontSize: '13px',
    color: '#245b4e',
    textDecoration: 'none',
  },
  composer: {
    padding: '16px 20px',
    borderTop: '1px solid #e2e7ea',
    background: '#fff',
  },
  textarea: {
    width: '100%',
    minHeight: '65px',
    padding: '12px',
    resize: 'vertical',
    border: '1px solid #cbd4d9',
    borderRadius: '8px',
    font: 'inherit',
  },
  composerFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '12px',
    marginTop: '10px',
  },
  button: {
    padding: '9px 16px',
    border: 0,
    borderRadius: '7px',
    background: '#286b59',
    color: '#fff',
    font: 'inherit',
    cursor: 'pointer',
  },
  secondaryButton: {
    padding: '9px 16px',
    border: 0,
    borderRadius: '7px',
    background: '#e8edef',
    color: '#35434a',
    font: 'inherit',
    cursor: 'pointer',
  },
  actionButton: {
    padding: '8px 12px',
    border: '1px solid #dce2e6',
    borderRadius: '8px',
    background: '#f5f7f8',
    color: '#33464c',
    cursor: 'pointer',
  },
}

function formatMessageTime(timestamp) {
  const date = new Date(timestamp)
  return Number.isNaN(date.getTime()) ? timestamp : date.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })
}

export default function ChatPage({
  conversation,
  currentUserId,
  onBack,
  readOnly = false,
}) {
  const [draft, setDraft] = useState('')
  const [localMessages, setLocalMessages] = useState(conversation?.messages ?? [])
  const [error, setError] = useState('')
  const [readError, setReadError] = useState('')
  const [sending, setSending] = useState(false)
  const [selectedAttachment, setSelectedAttachment] = useState(null)
  const attachmentInputRef = useRef(null)
  const messagesContainerRef = useRef(null)
  const readRequestsRef = useRef(new Set())
  const activeConversationIdRef = useRef(conversation?.id)
  activeConversationIdRef.current = conversation?.id

  useEffect(() => {
    setLocalMessages(conversation?.messages ?? [])
    setDraft('')
    setError('')
    setReadError('')
    setSelectedAttachment(null)
    if (attachmentInputRef.current) {
      attachmentInputRef.current.value = ''
    }
  }, [conversation, readOnly])

  useEffect(() => {
    readRequestsRef.current.clear()
    setReadError('')
  }, [conversation?.id])

  useEffect(() => {
    const root = messagesContainerRef.current
    if (!root || typeof IntersectionObserver === 'undefined') {
      return undefined
    }

    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) {
          continue
        }

        const messageKey = entry.target.getAttribute('data-message-id')
        const message = localMessages.find((candidate) => String(candidate.id) === messageKey)
        if (
          !message ||
          message.senderId === currentUserId ||
          message.isRead ||
          readRequestsRef.current.has(messageKey)
        ) {
          continue
        }

        readRequestsRef.current.add(messageKey)
        observer.unobserve(entry.target)
        markChatMessageRead(message.id)
          .then((receipt) => {
            if (activeConversationIdRef.current !== conversation?.id) {
              return
            }
            setLocalMessages((currentMessages) => currentMessages.map((currentMessage) => (
              currentMessage.id === receipt.id
                ? { ...currentMessage, isRead: receipt.isRead, status: 'Read' }
                : currentMessage
            )))
            setReadError('')
          })
          .catch((readStatusError) => {
            readRequestsRef.current.delete(messageKey)
            if (activeConversationIdRef.current === conversation?.id) {
              setReadError(
                readStatusError instanceof Error
                  ? readStatusError.message
                  : 'อัปเดตสถานะการอ่านไม่สำเร็จ',
              )
            }
          })
      }
    }, { root })

    const elementsById = new Map(
      Array.from(root.querySelectorAll('[data-message-id]')).map((element) => [
        element.getAttribute('data-message-id'),
        element,
      ]),
    )
    for (const message of localMessages) {
      if (message.senderId !== currentUserId && !message.isRead) {
        const element = elementsById.get(String(message.id))
        if (element) {
          observer.observe(element)
        }
      }
    }

    return () => observer.disconnect()
  }, [conversation?.id, currentUserId, localMessages])

  const handleAttachmentChange = (event) => {
    if (readOnly) {
      return
    }
    const files = Array.from(event.currentTarget.files ?? [])
    event.currentTarget.value = ''
    if (files.length === 0) {
      return
    }
    if (files.length > CHAT_CONFIG.maxAttachmentsPerMessage) {
      setSelectedAttachment(null)
      setError('แนบไฟล์ได้ไม่เกินจำนวนที่กำหนด')
      return
    }

    const file = files[0]
    if (file.size > CHAT_CONFIG.attachmentMaxSizeBytes) {
      setSelectedAttachment(null)
      setError('ไฟล์แนบมีขนาดใหญ่เกินขีดจำกัด')
      return
    }

    setSelectedAttachment(file)
    setError('')
  }

  const handleSend = async () => {
    if (!conversation || readOnly) {
      return
    }
    if (!currentUserId) {
      setError('ไม่พบข้อมูลผู้ใช้ปัจจุบัน')
      return
    }

    const validation = validateChatMessage(draft)
    if (!validation.ok) {
      setError(validation.error)
      return
    }

    try {
      setSending(true)
      setError('')
      const messageInput = {
        senderId: currentUserId,
        receiverId: conversation.id,
        text: validation.value,
      }
      const sentMessage = selectedAttachment
        ? await sendChatMessageWithAttachment({
          ...messageInput,
          file: selectedAttachment,
        })
        : await sendChatMessage(messageInput)

      setLocalMessages((currentMessages) => [
        ...currentMessages,
        {
          id: sentMessage.id,
          senderId: sentMessage.senderId,
          receiverId: sentMessage.receiverId,
          text: sentMessage.text,
          createdAt: sentMessage.createdAt,
          status: sentMessage.status ?? 'Sent',
          attachment: sentMessage.attachment ?? null,
        },
      ])
      setDraft('')
      setSelectedAttachment(null)
      if (attachmentInputRef.current) {
        attachmentInputRef.current.value = ''
      }
    } catch (submissionError) {
      setError(submissionError instanceof Error ? submissionError.message : 'ไม่สามารถส่งข้อความได้')
    } finally {
      setSending(false)
    }
  }

  if (!conversation) {
    return (
      <section aria-live="polite" style={{ ...styles.wrapper, padding: '32px', justifyContent: 'center' }}>
        <p>เลือกนักศึกษาจากรายการเพื่อเปิดหน้าต่างแชท</p>
      </section>
    )
  }

  return (
    <div style={styles.wrapper}>
      <header style={styles.header}>
        {onBack && (
          <button type="button" onClick={onBack} aria-label="กลับไปหน้ารายการแชท" style={styles.actionButton}>
            ←
          </button>
        )}
        <div style={styles.avatar}>{conversation.avatar}</div>
        <div style={styles.headerMeta}>
          <p style={styles.title}>{conversation.name}</p>
          {conversation.status && <p style={styles.subtitle}>{conversation.status}</p>}
        </div>
      </header>

      {readOnly && (
        <p role="status" style={{ margin: 0, padding: '8px 20px', background: '#fff7dd', color: '#674d00' }}>
          แชทนี้อ่านได้อย่างเดียว
        </p>
      )}

      <div ref={messagesContainerRef} style={styles.messages} aria-live="polite">
        {localMessages.map((message) => {
          const isMine = message.senderId === currentUserId
          return (
            <div
              key={message.id}
              data-message-side={isMine ? 'current-user' : 'conversation-partner'}
              data-message-id={message.id}
              style={{
                ...styles.message,
                ...(isMine ? styles.messageMine : {}),
              }}
            >
              <div>{message.text}</div>
              {message.attachment && (
                <a
                  href={message.attachment.downloadUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`เปิดไฟล์แนบ ${message.attachment.name}`}
                  style={styles.attachment}
                >
                  📎 {message.attachment.name}
                </a>
              )}
              <small style={styles.timestamp}>
                {formatMessageTime(message.createdAt)} · {isMine ? 'คุณ' : conversation.name}
                {message.isRead ? ' · Read' : isMine ? ' · Sent' : ''}
              </small>
            </div>
          )
        })}
      </div>

      {readError && (
        <p role="alert" style={{ margin: 0, padding: '8px 20px', color: '#963838' }}>
          อัปเดตสถานะการอ่านไม่สำเร็จ: {readError}
        </p>
      )}

      {!readOnly && (
        <div style={styles.composer}>
          <input
            ref={attachmentInputRef}
            type="file"
            aria-label="เลือกไฟล์แนบ"
            onChange={handleAttachmentChange}
            style={{ display: 'none' }}
          />
          <textarea
            aria-label="พิมพ์ข้อความ"
            placeholder="พิมพ์ข้อความ..."
            value={draft}
            onChange={(event) => {
              setDraft(event.target.value)
              if (error) {
                setError('')
              }
            }}
            style={styles.textarea}
          />
          {selectedAttachment && (
            <p role="status" style={{ marginTop: '8px', color: '#52636a', fontSize: '13px' }}>
              ไฟล์แนบที่เลือก: {selectedAttachment.name}
            </p>
          )}
          {error && (
            <p role="alert" style={{ marginTop: '8px', color: '#963838', fontSize: '13px' }}>
              ไม่สามารถส่งข้อความได้: {error}
            </p>
          )}
          <div style={styles.composerFooter}>
            <button
              type="button"
              style={styles.secondaryButton}
              onClick={() => attachmentInputRef.current?.click()}
              disabled={sending}
            >
              แนบไฟล์
            </button>
            <button type="button" style={styles.button} onClick={handleSend} disabled={sending}>
              {sending ? 'กำลังส่ง...' : error ? 'ลองส่งอีกครั้ง' : 'ส่ง'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
