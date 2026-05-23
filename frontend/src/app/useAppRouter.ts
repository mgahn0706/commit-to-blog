import { useEffect, useState } from 'react'
import { matchRoute } from '@/app/routes'

export function useAppRouter() {
  const [pathname, setPathname] = useState(window.location.pathname)

  useEffect(() => {
    function handlePopstate() {
      setPathname(window.location.pathname)
    }

    window.addEventListener('popstate', handlePopstate)

    return () => {
      window.removeEventListener('popstate', handlePopstate)
    }
  }, [])

  function navigate(path: string) {
    if (path === window.location.pathname) {
      return
    }

    window.history.pushState({}, '', path)
    setPathname(path)
  }

  return {
    route: matchRoute(pathname),
    navigate,
  }
}
