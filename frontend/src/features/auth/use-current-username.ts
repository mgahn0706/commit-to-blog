import { useEffect, useState } from 'react'
import { fetchCurrentUser } from './api'

const EMPTY_USERNAME = ''

export function useCurrentUsername() {
  const [currentUsername, setCurrentUsername] = useState(EMPTY_USERNAME)

  useEffect(() => {
    let cancelled = false

    async function loadCurrentUser() {
      try {
        const user = await fetchCurrentUser()

        if (!cancelled) {
          setCurrentUsername(user.username)
        }
      } catch {
        if (!cancelled) {
          setCurrentUsername(EMPTY_USERNAME)
        }
      }
    }

    void loadCurrentUser()

    return () => {
      cancelled = true
    }
  }, [])

  return currentUsername
}
