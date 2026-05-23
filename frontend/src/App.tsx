import './App.css'
import {
  buildBlogListPath,
  buildComposePath,
  buildSavedPostsPath,
} from '@/app/routes'
import { useAppRouter } from '@/app/use-app-router'
import { BlogPostPage } from '@/app/blog/[username]/[postId]/page'
import { BlogIndexPage } from '@/app/blog/[username]/page'
import { MyBlogPage } from '@/app/my-blog/page'
import { EditPostPage } from '@/app/posts/[postId]/edit/page'
import { SavedPostsPage } from '@/app/saved-posts/page'
import { useCurrentUsername } from '@/features/auth/use-current-username'

type NavItem = {
  label: string
  isActive: boolean
  onClick?: () => void
  isDisabled?: boolean
}

const APP_NAME = 'Smart Blog'
const FOOTER_TITLE = 'SMART_BLOG_SYSTEM'
const FOOTER_COPY = 'Smart Blog Automation. Optimized for developers.'
const FOOTER_LINK_LABELS = ['Documentation', 'GitHub Support', 'Privacy Policy']

function App() {
  const { route, navigate } = useAppRouter()
  const currentUsername = useCurrentUsername()

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
