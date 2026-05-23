const ROOT_PATH = '/'
const MY_BLOG_PATH = '/my-blog'
const SAVED_POSTS_PATH = '/saved-posts'
const BLOG_PATH_PREFIX = '/blog'
const POSTS_PATH_PREFIX = '/posts'

export type RouteMatch =
  | { kind: 'compose' }
  | { kind: 'saved-posts' }
  | { kind: 'edit-post'; postId: string }
  | { kind: 'blog-list'; username: string }
  | { kind: 'blog-detail'; username: string; postId: string }
  | { kind: 'not-found' }

type MatchedRoute = Exclude<RouteMatch, { kind: 'not-found' }>
type RouteMatcher = {
  match: (pathname: string) => MatchedRoute | null
}

type BlogListRoute = {
  username: string
}

type BlogDetailRoute = BlogListRoute & {
  postId: string
}

type EditPostRoute = {
  postId: string
}

export function isComposePath(pathname: string) {
  return pathname === ROOT_PATH || pathname === MY_BLOG_PATH
}

export function isSavedPostsPath(pathname: string) {
  return pathname === SAVED_POSTS_PATH
}

export function buildComposePath() {
  return MY_BLOG_PATH
}

export function buildSavedPostsPath() {
  return SAVED_POSTS_PATH
}

export function buildEditPostPath(postId: string) {
  return `${POSTS_PATH_PREFIX}/${postId}/edit`
}

export function buildBlogListPath(username: string) {
  return `${BLOG_PATH_PREFIX}/${username}`
}

export function buildBlogPostPath(username: string, postId: string) {
  return `${buildBlogListPath(username)}/${postId}`
}

export function parseEditPostPath(pathname: string): EditPostRoute | null {
  const match = pathname.match(/^\/posts\/([^/]+)\/edit$/)

  return match ? { postId: match[1] } : null
}

export function parseBlogListPath(pathname: string): BlogListRoute | null {
  const match = pathname.match(/^\/blog\/([^/]+)$/)

  return match ? { username: match[1] } : null
}

export function parseBlogPostPath(pathname: string): BlogDetailRoute | null {
  const match = pathname.match(/^\/blog\/([^/]+)\/([^/]+)$/)

  if (!match) {
    return null
  }

  return {
    username: match[1],
    postId: match[2],
  }
}

const routeMatchers: RouteMatcher[] = [
  {
    match: (pathname) => (isComposePath(pathname) ? { kind: 'compose' } : null),
  },
  {
    match: (pathname) =>
      isSavedPostsPath(pathname) ? { kind: 'saved-posts' } : null,
  },
  {
    match: (pathname) => {
      const editRoute = parseEditPostPath(pathname)

      return editRoute
        ? { kind: 'edit-post', postId: editRoute.postId }
        : null
    },
  },
  {
    match: (pathname) => {
      const blogDetailRoute = parseBlogPostPath(pathname)

      return blogDetailRoute
        ? {
            kind: 'blog-detail',
            username: blogDetailRoute.username,
            postId: blogDetailRoute.postId,
          }
        : null
    },
  },
  {
    match: (pathname) => {
      const blogListRoute = parseBlogListPath(pathname)

      return blogListRoute
        ? { kind: 'blog-list', username: blogListRoute.username }
        : null
    },
  },
]

export function matchRoute(pathname: string): RouteMatch {
  for (const routeMatcher of routeMatchers) {
    const matchedRoute = routeMatcher.match(pathname)

    if (matchedRoute) {
      return matchedRoute
    }
  }

  return { kind: 'not-found' }
}
