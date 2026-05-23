import { buildBlogPostPath } from '@/app/routes'
import { usePublicBlogPosts } from '@/features/posts/use-public-blog-posts'

type BlogIndexPageProps = {
  username: string
  navigate: (path: string) => void
}

export function BlogIndexPage({ username, navigate }: BlogIndexPageProps) {
  const { posts, errorMessage } = usePublicBlogPosts(username)

  return (
    <section className="feature-layout">
      <div className="feature-panel">
        <h2>{username}&rsquo;s internal blog</h2>
        <p>Published posts are visible here after a draft is promoted.</p>
      </div>

      {errorMessage ? <p className="error-text">{errorMessage}</p> : null}

      <div className="feature-stack">
        {posts.map((post) => (
          <article key={post.id} className="stack-card">
            <div className="stack-card__row">
              <strong>{post.title}</strong>
              <span>{new Date(post.publishedAt).toLocaleString()}</span>
            </div>
            <p>{post.summary || 'No summary yet.'}</p>
            <button
              type="button"
              className="secondary-button"
              onClick={() => navigate(buildBlogPostPath(username, post.id))}
            >
              Open post
            </button>
          </article>
        ))}
      </div>
    </section>
  )
}

export default BlogIndexPage
