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

type RouteRendererMap = {
  compose: (navigate: (path: string) => void) => ReactNode
  'saved-posts': (navigate: (path: string) => void) => ReactNode
  'edit-post': (
    route: Extract<RouteMatch, { kind: 'edit-post' }>,
    navigate: (path: string) => void,
  ) => ReactNode
  'blog-list': (
    route: Extract<RouteMatch, { kind: 'blog-list' }>,
    navigate: (path: string) => void,
  ) => ReactNode
  'blog-detail': (
    route: Extract<RouteMatch, { kind: 'blog-detail' }>,
    navigate: (path: string) => void,
  ) => ReactNode
}

const routeRenderers: RouteRendererMap = {
  compose: (navigate) => <MyBlogPage navigate={navigate} />,
  'saved-posts': (navigate) => <SavedPostsPage navigate={navigate} />,
  'edit-post': (route, navigate) => (
    <EditPostPage postId={route.postId} navigate={navigate} />
  ),
  'blog-list': (route, navigate) => (
    <BlogIndexPage username={route.username} navigate={navigate} />
  ),
  'blog-detail': (route) => (
    <BlogPostPage username={route.username} postId={route.postId} />
  ),
}

export function renderRouteView({
  route,
  navigate,
}: RenderRouteViewInput): ReactNode {
  if (route.kind === 'not-found') {
    return <section className="feature-panel">Page not found.</section>
  }

  switch (route.kind) {
    case 'compose':
      return routeRenderers.compose(navigate)
    case 'saved-posts':
      return routeRenderers['saved-posts'](navigate)
    case 'edit-post':
      return routeRenderers['edit-post'](route, navigate)
    case 'blog-list':
      return routeRenderers['blog-list'](route, navigate)
    case 'blog-detail':
      return routeRenderers['blog-detail'](route, navigate)
  }
}
