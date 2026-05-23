import { useEffect, useState } from 'react'
import './App.css'
import {
  buildBlogListPath,
  buildComposePath,
  buildSavedPostsPath,
  isComposePath,
  isSavedPostsPath,
  parseBlogListPath,
  parseBlogPostPath,
  parseEditPostPath,
} from '@/app/routes'
import { BlogPostPage } from '@/app/blog/[username]/[postId]/page'
import { BlogIndexPage } from '@/app/blog/[username]/page'
import { MyBlogPage } from '@/app/my-blog/page'
import { EditPostPage } from '@/app/posts/[postId]/edit/page'
import { SavedPostsPage } from '@/app/saved-posts/page'
import { fetchCurrentUser } from '@/features/auth/api'

type RouteMatch =
  | { kind: 'compose' }
  | { kind: 'saved-posts' }
  | { kind: 'edit-post'; postId: string }
  | { kind: 'blog-list'; username: string }
  | { kind: 'blog-detail'; username: string; postId: string }
  | { kind: 'not-found' }

type NavItem = {
  label: string
  isActive: boolean
  onClick?: () => void
  isDisabled?: boolean
}

const APP_NAME = 'Smart Blog'
const DEFAULT_ACCOUNT_LABEL = 'Account'
const FOOTER_TITLE = 'SMART_BLOG_SYSTEM'
const FOOTER_COPY = 'Smart Blog Automation. Optimized for developers.'
const FOOTER_LINK_LABELS = ['Documentation', 'GitHub Support', 'Privacy Policy']

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

function App() {
  const [pathname, setPathname] = useState(window.location.pathname)
  const [currentUsername, setCurrentUsername] = useState('')
  const route = matchRoute(pathname)

  useEffect(() => {
    function handlePopstate() {
      setPathname(window.location.pathname)
    }

    window.addEventListener('popstate', handlePopstate)

    return () => {
      window.removeEventListener('popstate', handlePopstate)
    }
  }, [])

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
          setCurrentUsername('')
        }
      }
    }

    void loadCurrentUser()

    return () => {
      cancelled = true
    }
  }, [])

  function navigate(path: string) {
    if (path === window.location.pathname) {
      return
    }

    window.history.pushState({}, '', path)
    setPathname(path)
  }

  const navItems: NavItem[] = [
    {
      label: 'My Blog',
      isActive: route.kind === 'compose',
      onClick: () => navigate(buildComposePath()),
    },
    {
      label: 'Saved Posts',
      isActive: route.kind === 'saved-posts' || route.kind === 'edit-post',
      onClick: () => navigate(buildSavedPostsPath()),
    },
    {
      label: 'Published',
      isActive: route.kind === 'blog-list' || route.kind === 'blog-detail',
      onClick: currentUsername ? () => navigate(buildBlogListPath(currentUsername)) : undefined,
      isDisabled: !currentUsername,
    },
    {
      label: 'Settings',
      isActive: false,
      isDisabled: true,
    },
  ]

  let page

  if (route.kind === 'compose') {
    page = <MyBlogPage navigate={navigate} />
  } else if (route.kind === 'saved-posts') {
    page = <SavedPostsPage navigate={navigate} />
  } else if (route.kind === 'edit-post') {
    page = <EditPostPage postId={route.postId} navigate={navigate} />
  } else if (route.kind === 'blog-list') {
    page = <BlogIndexPage username={route.username} navigate={navigate} />
  } else if (route.kind === 'blog-detail') {
    page = <BlogPostPage username={route.username} postId={route.postId} />
  } else {
    page = <section className="feature-panel">Page not found.</section>
  }

  return (
    <main className="app-shell">
      <header className="app-header">
        <div className="app-header__inner">
          <div className="app-header__left">
            <button
              type="button"
              className="brand-mark"
              onClick={() => navigate(buildComposePath())}
            >
              {APP_NAME}
            </button>
            <nav className="app-nav" aria-label="Primary">
              {navItems.map((item) => (
                <button
                  key={item.label}
                  type="button"
                  className={item.isActive ? 'nav-link is-active' : 'nav-link'}
                  onClick={item.onClick}
                  disabled={item.isDisabled}
                >
                  {item.label}
                </button>
              ))}
            </nav>
          </div>
          <div className="app-header__right">
            <span className="account-label">{currentUsername || DEFAULT_ACCOUNT_LABEL}</span>
            <button type="button" className="profile-button" aria-label="Account">
              <span className="profile-button__ring" />
            </button>
          </div>
        </div>
      </header>

      <section className="app-body">{page}</section>

      <footer className="app-footer">
        <div>
          <p className="footer-title">{FOOTER_TITLE}</p>
          <p className="footer-copy">{FOOTER_COPY}</p>
        </div>
        <div className="footer-links">
          {FOOTER_LINK_LABELS.map((label) => (
            <span key={label}>{label}</span>
          ))}
        </div>
      </footer>
    </main>
  )
}

export default App
