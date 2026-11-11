import { createElement, useState } from 'react'
import SearchFiltersForm from '../components/SearchFiltersForm.js'
import SearchResultsList from '../components/SearchResultsList.js'
import { searchRoommates } from '../api/client.js'

const KNOWN_PROFILE_USERS = ['user-1', 'user-2', 'user-3', 'user-4']

const initialFilters = {
  age: '',
  gender: '',
  faculty: '',
  academicYear: '',
  roomType: '',
  roomSize: '',
  sleepBehavior: '',
  cleanliness: '',
  sleepTime: '',
}

function field(label, inputNode) {
  return createElement(
    'label',
    { className: 'block text-sm font-medium' },
    label,
    createElement('div', { className: 'mt-2' }, inputNode),
  )
}

function hasProfileForUser(userId) {
  return KNOWN_PROFILE_USERS.includes(userId)
}

export default function SearchRoommatePage({ currentUserId = 'user-1' }) {
  const [filters, setFilters] = useState(initialFilters)
  const [mode, setMode] = useState('AND')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [hasSearched, setHasSearched] = useState(false)
  const [page, setPage] = useState(1)
  const [hasNextPage, setHasNextPage] = useState(false)
  const hasProfile = hasProfileForUser(currentUserId)

  function updateFilter(fieldName, value) {
    setFilters((current) => ({ ...current, [fieldName]: value }))
  }

  async function requestSearch(nextPage) {
    setLoading(true)
    setError('')
    setHasSearched(true)

    try {
      const normalizedFilters = Object.fromEntries(
        Object.entries(filters).filter(([, value]) => value !== '' && value !== null && value !== undefined),
      )
      const data = await searchRoommates({
        current_user_id: currentUserId,
        filters: normalizedFilters,
        mode,
        page: nextPage,
      })
      setResults(data)
      setPage(nextPage)
      setHasNextPage(Array.isArray(data) && data.length >= 20)
    } catch (requestError) {
      setError('ไม่สามารถค้นหาเมทได้ กรุณาลองใหม่อีกครั้ง')
      setResults([])
      setPage(nextPage)
      setHasNextPage(false)
    } finally {
      setLoading(false)
    }
  }

  async function handleSubmit(event) {
    event.preventDefault()
    await requestSearch(1)
  }

  async function handlePageChange(nextPage) {
    if (nextPage < 1) {
      return
    }
    await requestSearch(nextPage)
  }

  if (!hasProfile) {
    return createElement(
      'main',
      { className: 'mx-auto max-w-3xl px-4 py-10 text-slate-800' },
      createElement(
        'header',
        { className: 'mb-6' },
        createElement('p', { className: 'text-sm font-semibold uppercase tracking-wide text-teal-700' }, 'Vista & Friend'),
        createElement('h1', { className: 'mt-2 text-3xl font-bold text-slate-900' }, 'ค้นหาเมท'),
      ),
      createElement(
        'div',
        { className: 'rounded-2xl border border-amber-200 bg-amber-50 p-6 shadow-sm', role: 'alert' },
        createElement('p', { className: 'text-lg font-semibold text-amber-900' }, 'คุณยังไม่มีโปรไฟล์หาเมท'),
        createElement(
          'p',
          { className: 'mt-2 text-sm text-amber-800' },
          'กรุณาสร้างโปรไฟล์หาเมทก่อนใช้งานฟังก์ชันค้นหาเมท',
        ),
        createElement(
          'button',
          {
            className: 'mt-4 rounded-lg bg-teal-700 px-5 py-3 font-semibold text-white hover:bg-teal-800',
            onClick: () => {
              if (typeof window !== 'undefined') {
                window.location.hash = '#create-profile'
              }
            },
            type: 'button',
          },
          'สร้างโปรไฟล์หาเมท',
        ),
      ),
    )
  }

  return createElement(
    'main',
    { className: 'mx-auto max-w-5xl px-4 py-10 text-slate-800' },
    createElement(
      'header',
      { className: 'mb-6' },
      createElement('p', { className: 'text-sm font-semibold uppercase tracking-wide text-teal-700' }, 'Vista & Friend'),
      createElement('h1', { className: 'mt-2 text-3xl font-bold text-slate-900' }, 'ค้นหาเมท'),
    ),
    createElement(SearchFiltersForm, {
      filters,
      mode,
      loading,
      error,
      onChangeFilter: updateFilter,
      onModeChange: setMode,
      onSubmit: handleSubmit,
    }),
    createElement(
      'section',
      { 'aria-live': 'polite', className: 'mt-6' },
      createElement('h2', { className: 'mb-3 text-xl font-bold text-slate-900' }, 'ผลการค้นหา'),
      !hasSearched && !loading && createElement('p', null, 'ยังไม่มีผลการค้นหา'),
      hasSearched && !loading && createElement(SearchResultsList, {
        results,
        page,
        hasNextPage,
        onPreviousPage: () => handlePageChange(page - 1),
        onNextPage: () => handlePageChange(page + 1),
      }),
    ),
  )
}
