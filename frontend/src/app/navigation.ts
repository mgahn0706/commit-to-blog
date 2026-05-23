import {
  buildBlogListPath,
  buildComposePath,
  buildSavedPostsPath,
  type RouteMatch,
} from '@/app/routes'

type BuildPrimaryNavItemsInput = {
  route: RouteMatch
  currentUsername: string
  navigate: (path: string) => void
}

export type NavItem = {
  label: string
  isActive: boolean
  onClick?: () => void
  isDisabled?: boolean
}

export function buildPrimaryNavItems({
  route,
  currentUsername,
  navigate,
}: BuildPrimaryNavItemsInput): NavItem[] {
  return [
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
  ]
}
