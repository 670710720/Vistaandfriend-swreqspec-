import { useEffect, useMemo, useState } from 'react'
import { fetchChatList, fetchChatMessages, openChat } from '../api/client.js'
import ChatPage from './ChatPage.jsx'

// Supports AC-CHAT-01, AC-CHAT-05, AC-CHAT-07 and AC-CHAT-07A via the Backend API.

const styles = {
  page: {
    maxWidth: '1100px',
    margin: 'auto',
    padding: '24px',
    background: '#f3f5f7',
    minHeight: '100vh',
  },
  pageHeader: {
    marginBottom: '18px',
  },
  title: {
    margin: '0 0 8px',
    fontSize: '28px',
    fontWeight: 700,
    color: '#1f2933',
  },
  subtitle: {
    margin: 0,
    color: '#607078',
  },
  demoNotice: {
    marginBottom: '16px',
    padding: '10px 12px',
    borderRadius: '8px',
    background: '#fff7dd',
    color: '#674d00',
  },
  layout: {
    display: 'grid',
    gridTemplateColumns: '280px 1fr',
    minHeight: '570px',
    background: '#fff',
    border: '1px solid #dce2e6',
    borderRadius: '12px',
    overflow: 'hidden',
  },
  sidebar: {
    borderRight: '1px solid #e2e7ea',
    padding: '20px',
    background: '#fff',
  },
  panelTitle: {
    fontSize: '18px',
    marginBottom: '16px',
    color: '#263238',
  },
  contactButton: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 8px',
    border: 0,
    borderRadius: '8px',
    background: '#fff',
    borderBottom: '1px solid #edf0f2',
    textAlign: 'left',
    cursor: 'pointer',
  },
  contactButtonActive: {
    background: '#eef5f3',
  },
  avatar: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    background: '#dce9e5',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
    color: '#1f3d38',
    flexShrink: 0,
  },
  detail: {
    flex: 1,
    minWidth: 0,
  },
  name: {
    display: 'block',
    marginBottom: '4px',
    color: '#1f2933',
    fontWeight: 700,
  },
  summary: {
    margin: 0,
    color: '#718087',
    fontSize: '13px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
}

function errorMessage(error) {
  return error instanceof Error ? error.message : 'เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ'
}

export default function ChatListPage() {
  const [contacts, setContacts] = useState([])
  const [currentUserId, setCurrentUserId] = useState('')
  const [demoMode, setDemoMode] = useState(false)
  const [selectedId, setSelectedId] = useState('')
  const [messages, setMessages] = useState([])
  const [loadingList, setLoadingList] = useState(true)
  const [loadingConversation, setLoadingConversation] = useState(false)
  const [readOnly, setReadOnly] = useState(false)
  const [listError, setListError] = useState('')
  const [conversationError, setConversationError] = useState('')
  const [denialReason, setDenialReason] = useState('')

  useEffect(() => {
    let ignore = false

    async function loadChats() {
      try {
        const result = await fetchChatList()
        if (ignore) return
        setContacts(result.contacts)
        setCurrentUserId(result.currentUserId)
        setDemoMode(result.demoMode)
        setSelectedId(result.contacts[0]?.id ?? '')
      } catch (error) {
        if (!ignore) setListError(errorMessage(error))
      } finally {
        if (!ignore) setLoadingList(false)
      }
    }

    loadChats()
    return () => {
      ignore = true
    }
  }, [])

  useEffect(() => {
    if (!selectedId || !currentUserId) return undefined

    let ignore = false

    async function loadConversation() {
      setLoadingConversation(true)
      setConversationError('')
      setDenialReason('')
      setReadOnly(false)
      setMessages([])

      try {
        const startResult = await openChat(currentUserId, selectedId)
        if (ignore) return
        if (!startResult.allowed) {
          setDenialReason(startResult.reason)
          return
        }

        const history = await fetchChatMessages(selectedId, currentUserId)
        if (!ignore) {
          setMessages(history)
          setReadOnly(startResult.readOnly)
        }
      } catch (error) {
        if (!ignore) setConversationError(errorMessage(error))
      } finally {
        if (!ignore) setLoadingConversation(false)
      }
    }

    loadConversation()
    return () => {
      ignore = true
    }
  }, [currentUserId, selectedId])

  const selectedContact = useMemo(
    () => contacts.find((contact) => contact.id === selectedId) ?? null,
    [contacts, selectedId],
  )
  const conversation = useMemo(
    () => selectedContact ? { ...selectedContact, messages } : null,
    [messages, selectedContact],
  )

  return (
    <main style={styles.page}>
      <header style={styles.pageHeader}>
        <p style={{ ...styles.subtitle, textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: '12px', fontWeight: 700 }}>Vista &amp; Friend</p>
        <h1 style={styles.title}>แชทกับรูมเมท</h1>
      </header>

      {demoMode && (
        <p style={styles.demoNotice} role="status">
          โหมดสาธิต: รายชื่อและข้อมูลนี้เป็นข้อมูลตัวอย่าง
        </p>
      )}

      {loadingList ? (
        <p role="status">กำลังโหลดรายการแชท...</p>
      ) : listError ? (
        <p role="alert">ไม่สามารถโหลดรายการแชทได้: {listError}</p>
      ) : contacts.length === 0 ? (
        <p role="status">ไม่มีผู้ติดต่อในรายการ</p>
      ) : (
        <div style={styles.layout}>
          <aside style={styles.sidebar}>
            <h2 style={styles.panelTitle}>รายการแชท</h2>
            {contacts.map((contact) => (
              <button
                key={contact.id}
                type="button"
                onClick={() => setSelectedId(contact.id)}
                style={{
                  ...styles.contactButton,
                  ...(selectedId === contact.id ? styles.contactButtonActive : {}),
                }}
                aria-label={`เปิดแชทกับ ${contact.name}`}
                aria-pressed={selectedId === contact.id}
              >
                <div style={styles.avatar}>{contact.avatar}</div>
                <div style={styles.detail}>
                  <strong style={styles.name}>{contact.name}</strong>
                  {contact.summary && <p style={styles.summary}>{contact.summary}</p>}
                </div>
              </button>
            ))}
          </aside>

          <section aria-live="polite">
            {loadingConversation ? (
              <p role="status">กำลังโหลดประวัติแชท...</p>
            ) : denialReason ? (
              <p role="alert">ไม่สามารถเริ่มแชทได้: {denialReason}</p>
            ) : conversationError ? (
              <p role="alert">ไม่สามารถเปิดประวัติแชทได้: {conversationError}</p>
            ) : (
              <ChatPage
                conversation={conversation}
                currentUserId={currentUserId}
                readOnly={readOnly}
                onBack={null}
              />
            )}
          </section>
        </div>
      )}
    </main>
  )
}
