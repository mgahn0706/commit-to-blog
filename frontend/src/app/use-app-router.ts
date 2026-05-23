import { useEffect, useState } from 'react'
import {
  isComposePath,
  isSavedPostsPath,
  parseBlogListPath,
  parseBlogPostPath,
  parseEditPostPath,
} from '@/app/routes'

export type RouteMatch =
  | { kind: 'compose' }
  | { kind: 'saved-posts' }
  | { kind: 'edit-post'; postId: string }
  | { kind: 'blog-list'; username: string }
  | { kind: 'blog-detail'; username: string; postId: string }
  | { kind: 'not-found' }

function matchRoute(pathname: string): RouteMatch {
  if (isComposePath(pathname)) {
    return { kind: 'compose' }
  }

  if (isSavedPostsPath(pathname)) {
    return { kind: 'saved-posts' }
  }

  const editRoute = parseEditPostPath(pathname)

  if (editRoute) {
    return { kind: 'edit-post', postId: editRoute.postId }
  }

  const blogDetailRoute = parseBlogPostPath(pathname)

  if (blogDetailRoute) {
    return {
      kind: 'blog-detail',
      username: blogDetailRoute.username,
      postId: blogDetailRoute.postId,
    }
  }

  const blogListRoute = parseBlogListPath(pathname)

  if (blogListRoute) {
    return { kind: 'blog-list', username: blogListRoute.username }
  }

  return { kind: 'not-found' }
}

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
    pathname,
    route: matchRoute(pathname),
    navigate,
  }
}
