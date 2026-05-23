import './App.css'
import { buildComposePath } from '@/app/routes'
import { buildPrimaryNavItems } from '@/app/navigation'
import { renderRouteView } from '@/app/render-route'
import { useAppRouter } from '@/app/use-app-router'
import { useCurrentUsername } from '@/features/auth/use-current-username'

const APP_NAME = 'Smart Blog'
const FOOTER_TITLE = 'SMART_BLOG_SYSTEM'
const FOOTER_COPY = 'Smart Blog Automation. Optimized for developers.'
const FOOTER_LINK_LABELS = ['Documentation', 'GitHub Support', 'Privacy Policy']

function App() {
  const { route, navigate } = useAppRouter()
  const currentUsername = useCurrentUsername()
  const navItems = buildPrimaryNavItems({ route, currentUsername, navigate })
  const page = renderRouteView({ route, navigate })

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
