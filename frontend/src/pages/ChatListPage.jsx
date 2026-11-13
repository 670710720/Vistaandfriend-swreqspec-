import { useEffect, useMemo, useState } from 'react'
import { fetchChatList, fetchChatMessages } from '../api/client.js'
import ChatPage from './ChatPage.jsx'

// Supports AC-CHAT-01 and AC-CHAT-05 by loading the contact list and the
// previous conversation before the user opens the selected chat thread.

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
  section: {
    marginBottom: '18px',
    borderBottom: '1px solid #e2e7ea',
    paddingBottom: '12px',
  },
  newChatButton: {
    display: 'inline-flex',
    alignItems: 'center',
    background: '#f5f7f8',
    color: '#33464c',
    border: '1px solid #dce2e6',
    borderRadius: '8px',
    padding: '8px 12px',
    font: 'inherit',
    cursor: 'pointer',
  },
}

export default function ChatListPage() {
  const [contacts, setContacts] = useState([])
  const [selectedId, setSelectedId] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let ignore = false

    async function loadChats() {
      setLoading(true)
      const list = await fetchChatList()
      if (ignore) return
      setContacts(list)
      setSelectedId((current) => current || list[0]?.id || '')
      setLoading(false)
    }

    loadChats()
    return () => {
      ignore = true
    }
  }, [])

  const selectedConversation = useMemo(() => {
    if (!selectedId) return null
    const contact = contacts.find((entry) => entry.id === selectedId)
    if (!contact) return null

    return {
      ...contact,
      status: contact.status || 'ออนไลน์',
      messages: contact.messages || [],
    }
  }, [contacts, selectedId])

  useEffect(() => {
    if (!selectedId) return

    let ignore = false

    async function loadConversation() {
      const messages = await fetchChatMessages(selectedId)
      if (ignore) return
      setContacts((current) =>
        current.map((contact) =>
          contact.id === selectedId
            ? { ...contact, messages }
            : contact,
        ),
      )
    }

    loadConversation()
    return () => {
      ignore = true
    }
  }, [selectedId])

  const viewConversation = selectedConversation && {
    ...selectedConversation,
    messages: selectedConversation.messages ?? [],
  }

  return (
    <main style={styles.page}>
      <header style={styles.pageHeader}>
        <p style={{ ...styles.subtitle, textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: '12px', fontWeight: 700 }}>Vista &amp; Friend</p>
        <h1 style={styles.title}>แชทกับรูมเมท</h1>
      </header>

      {loading ? (
        <p>กำลังโหลดประวัติแชท...</p>
      ) : (
        <div style={styles.layout}>
          <aside style={styles.sidebar}>
            <div style={styles.section}>
              <h2 style={styles.panelTitle}>รายการแชท</h2>
              <button type="button" style={styles.newChatButton}>
                + เริ่มแชทใหม่
              </button>
            </div>

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
              >
                <div style={styles.avatar}>{contact.avatar}</div>
                <div style={styles.detail}>
                  <strong style={styles.name}>{contact.name}</strong>
                  <p style={styles.summary}>{contact.summary}</p>
                </div>
              </button>
            ))}
          </aside>

          <ChatPage conversation={viewConversation} onBack={null} />
        </div>
      )}
    </main>
  )
}
