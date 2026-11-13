import { useEffect, useState } from 'react'

import { sendChatMessage, validateChatMessage } from '../api/client.js'

// Supports FR-CHAT-03, FR-CHAT-04, FR-CHAT-13 and AC-CHAT-02 / AC-CHAT-02C.
// The UI only submits when the API boundary confirms the message was sent.

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
    padding: '10px',
    border: '1px solid #cbd7d2',
    borderRadius: '8px',
    marginTop: '8px',
    background: '#fff',
    fontSize: '13px',
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

export default function ChatPage({ conversation, currentUserId = 'student-1', onBack }) {
  const [draft, setDraft] = useState('')
  const [localMessages, setLocalMessages] = useState(conversation?.messages ?? [])
  const [error, setError] = useState('')
  const [sending, setSending] = useState(false)

  useEffect(() => {
    setLocalMessages(conversation?.messages ?? [])
    setDraft('')
    setError('')
  }, [conversation])

  const handleSend = async () => {
    if (!conversation) {
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
      const sentMessage = await sendChatMessage({
        senderId: currentUserId,
        receiverId: conversation.id,
        text: validation.value,
      })

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
          <p style={styles.subtitle}>{conversation.status}</p>
        </div>
      </header>

      <div style={styles.messages} aria-live="polite">
        {localMessages.map((message) => {
          const isMine = message.senderId === currentUserId
          return (
            <div
              key={message.id}
              style={{
                ...styles.message,
                ...(isMine ? styles.messageMine : {}),
              }}
            >
              <div>{message.text}</div>
              {message.attachment && (
                <div style={styles.attachment}>📎 {message.attachment.name}</div>
              )}
              <small style={styles.timestamp}>
                {formatMessageTime(message.createdAt)} · {isMine ? 'คุณ' : conversation.name} · {message.status || 'Sent'}
              </small>
            </div>
          )
        })}
      </div>

      <div style={styles.composer}>
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
        {error && (
          <p role="alert" style={{ marginTop: '8px', color: '#963838', fontSize: '13px' }}>
            {error}
          </p>
        )}
        <div style={styles.composerFooter}>
          <button type="button" style={styles.secondaryButton}>
            แนบไฟล์
          </button>
          <button type="button" style={styles.button} onClick={handleSend} disabled={sending}>
            {sending ? 'กำลังส่ง...' : 'ส่ง'}
          </button>
        </div>
      </div>
    </div>
  )
}
