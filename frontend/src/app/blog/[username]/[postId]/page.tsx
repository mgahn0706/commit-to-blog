import { parseBlogPostPath } from '@/app/routes'
import { usePublicBlogPost } from '@/features/posts/use-public-blog-post'

type BlogPostPageProps = {
  username?: string
  postId?: string
}

const MISSING_POST_MESSAGE = 'No published post found.'

export function BlogPostPage({ username, postId }: BlogPostPageProps) {
  const routeParams = parseBlogPostPath(window.location.pathname)
  const resolvedUsername = username ?? routeParams?.username ?? ''
  const resolvedPostId = postId ?? routeParams?.postId ?? ''
  const { post, errorMessage } = usePublicBlogPost(
    resolvedUsername,
    resolvedPostId,
  )

  if (!resolvedUsername || !resolvedPostId) {
    return <section className="feature-panel">{MISSING_POST_MESSAGE}</section>
  }

  if (!post) {
    return <section className="feature-panel">{errorMessage || MISSING_POST_MESSAGE}</section>
  }

  return (
    <section className="feature-layout">
      <div className="feature-panel">
        <h2>
          {post.username}/{post.id}
        </h2>
        <p className="text-measure-lg">Published posts are rendered from the public blog API.</p>
      </div>
      <article className="feature-panel">
        <h3>{post.title}</h3>
        <p className="text-measure-lg">{post.summary || 'No summary yet.'}</p>
        <div className="preview-body">
          <p>{post.body}</p>
        </div>
      </article>
    </section>
  )
}

export default BlogPostPage
