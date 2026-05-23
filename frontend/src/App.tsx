import { useEffect, useState } from 'react'
import './App.css'
import { BlogPostPage } from '@/app/blog/[username]/[postId]/page'
import { MyBlogPage } from '@/app/my-blog/page'
import { EditPostPage } from '@/app/posts/[postId]/edit/page'
import { SavedPostsPage } from '@/app/saved-posts/page'

type RouteMatch =
  | { kind: 'compose' }
  | { kind: 'saved-posts' }
  | { kind: 'edit-post' }
  | { kind: 'blog-detail' }
  | { kind: 'not-found' }

function matchRoute(pathname: string): RouteMatch {
  if (pathname === '/' || pathname === '/my-blog') {
    return { kind: 'compose' }
  }

  if (pathname === '/saved-posts') {
    return { kind: 'saved-posts' }
  }

  if (/^\/posts\/[^/]+\/edit$/.test(pathname)) {
    return { kind: 'edit-post' }
  }

  if (/^\/blog\/[^/]+\/[^/]+$/.test(pathname)) {
    return { kind: 'blog-detail' }
  }

  return { kind: 'not-found' }
}

function App() {
  const [pathname, setPathname] = useState(window.location.pathname)
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

  function navigate(path: string) {
    if (path === window.location.pathname) {
      return
    }

    window.history.pushState({}, '', path)
    setPathname(path)
  }

  let page

  if (route.kind === 'compose') {
    page = <MyBlogPage navigate={navigate} />
  } else if (route.kind === 'saved-posts') {
    page = <SavedPostsPage navigate={navigate} />
  } else if (route.kind === 'edit-post') {
    page = <EditPostPage />
  } else if (route.kind === 'blog-detail') {
    page = <BlogPostPage />
  } else {
    page = <section className="feature-panel">Page not found.</section>
  }

  return (
    <main className="shell">
      <header className="hero-panel">
        <div>
          <p className="eyebrow">Commit to Blog</p>
          <h1>Turn selected commits into a saved internal blog draft</h1>
          <p className="hero-copy">
            The compose flow now uses the backend APIs for repository browsing,
            commit selection, AI draft generation, and draft saving.
          </p>
        </div>
        <div className="hero-card">
          <p>Navigation</p>
          <div className="action-row">
            <button type="button" className="secondary-button" onClick={() => navigate('/my-blog')}>
              Compose
            </button>
            <button
              type="button"
              className="secondary-button"
              onClick={() => navigate('/saved-posts')}
            >
              Saved Posts
            </button>
          </div>
        </div>
      </header>

      <article className="route-card">
        <div className="route-header">
          <span className="route-path">{pathname}</span>
        </div>
        <div className="route-body">{page}</div>
      </article>
    </main>
  )
}

export default App
