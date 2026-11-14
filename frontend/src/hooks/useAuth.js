import { useEffect, useState } from 'react'

const AUTH_STORAGE_KEY = 'vista_friend_auth'

export function useAuth(initialState = true) {
  const hasExplicitState = initialState !== undefined
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    if (typeof window === 'undefined' || hasExplicitState) {
      return initialState
    }

    const savedValue = window.localStorage.getItem(AUTH_STORAGE_KEY)
    if (savedValue === null) {
      return initialState
    }

    return savedValue === 'true'
  })

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(AUTH_STORAGE_KEY, String(isLoggedIn))
    }
  }, [isLoggedIn])

  return {
    isLoggedIn,
    setIsLoggedIn,
    login: () => setIsLoggedIn(true),
    logout: () => setIsLoggedIn(false),
  }
}
