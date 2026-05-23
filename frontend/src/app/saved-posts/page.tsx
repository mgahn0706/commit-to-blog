import { buildBlogPostPath, buildComposePath, buildEditPostPath } from '@/app/routes'
import { SavedPostCard } from '@/features/posts/components/SavedPostCard'
import { useSavedPosts } from '@/features/posts/use-saved-posts'

type SavedPostsPageProps = {
  navigate?: (path: string) => void
}

export function SavedPostsPage({ navigate }: SavedPostsPageProps) {
  const { posts, errorMessage } = useSavedPosts()

  return (
    <section className="page-layout">
      <div className="page-header">
        <div>
          <span className="section-kicker">Library</span>
          <h1>Saved posts</h1>
          <p>
            Review generated drafts, refine the writing, and keep published posts
            in the same working archive.
          </p>
        </div>
        <button
          type="button"
          className="primary-button"
          onClick={() => navigate?.(buildComposePath())}
        >
          + Create post
        </button>
      </div>

      {errorMessage ? <p className="error-text">{errorMessage}</p> : null}

      <div className="saved-posts-grid">
        {posts.map((post) => (
          <SavedPostCard
            key={post.id}
            post={post}
            onEdit={(postId) => navigate?.(buildEditPostPath(postId))}
            onOpenBlog={(username, postId) =>
              navigate?.(buildBlogPostPath(username, postId))
            }
          />
        ))}

        <button
          type="button"
          className="create-card"
          onClick={() => navigate?.(buildComposePath())}
        >
          <span className="create-card__icon">+</span>
          <strong>New draft</strong>
          <p>Load commit history and generate a new post summary.</p>
        </button>
      </div>
    </section>
  )
}

export default SavedPostsPage
