import type { ReactNode } from 'react'
import type { RouteMatch } from '@/app/routes'
import { BlogPostPage } from '@/app/blog/[username]/[postId]/page'
import { BlogIndexPage } from '@/app/blog/[username]/page'
import { MyBlogPage } from '@/app/my-blog/page'
import { EditPostPage } from '@/app/posts/[postId]/edit/page'
import { SavedPostsPage } from '@/app/saved-posts/page'

type RenderRouteViewInput = {
  route: RouteMatch
  navigate: (path: string) => void
}

export function renderRouteView({
  route,
  navigate,
}: RenderRouteViewInput): ReactNode {
  switch (route.kind) {
    case 'compose':
      return <MyBlogPage navigate={navigate} />
    case 'saved-posts':
      return <SavedPostsPage navigate={navigate} />
    case 'edit-post':
      return <EditPostPage postId={route.postId} navigate={navigate} />
    case 'blog-list':
      return <BlogIndexPage username={route.username} navigate={navigate} />
    case 'blog-detail':
      return <BlogPostPage username={route.username} postId={route.postId} />
    case 'not-found':
      return <section className="feature-panel">Page not found.</section>
  }
}
