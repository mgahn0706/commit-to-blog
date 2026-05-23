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
    page = (
      <BlogPostPage username={route.username} postId={route.postId} />
    )
  } else {
    page = <section className="feature-panel">Page not found.</section>
  }

  return (
    <main className="shell">
      <header className="hero-panel">
        <div>
          <p className="eyebrow">Commit to Blog</p>
          <h1>Turn selected commits into an internal blog post</h1>
          <p className="hero-copy">
            The MVP now covers compose, save, edit, publish, and public internal
            blog viewing with a single frontend flow.
          </p>
        </div>
        <div className="hero-card">
          <p>Navigation</p>
          <div className="action-row">
            <button
              type="button"
              className="secondary-button"
              onClick={() => navigate(buildComposePath())}
            >
              Compose
            </button>
            <button
              type="button"
              className="secondary-button"
              onClick={() => navigate(buildSavedPostsPath())}
            >
              Saved Posts
            </button>
            {currentUsername ? (
              <button
                type="button"
                className="secondary-button"
                onClick={() => navigate(buildBlogListPath(currentUsername))}
              >
                Internal Blog
              </button>
            ) : null}
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
