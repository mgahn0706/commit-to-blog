import { describe, expect, it } from 'vitest'
import {
  buildBlogListPath,
  buildBlogPostPath,
  buildEditPostPath,
  buildSavedPostsPath,
  matchRoute,
} from '@/app/routes'

describe('matchRoute', () => {
  it('matches compose paths', () => {
    expect(matchRoute('/')).toEqual({ kind: 'compose' })
    expect(matchRoute('/my-blog')).toEqual({ kind: 'compose' })
  })

  it('matches saved posts and edit routes', () => {
    expect(matchRoute(buildSavedPostsPath())).toEqual({ kind: 'saved-posts' })
    expect(matchRoute(buildEditPostPath('post-1'))).toEqual({
      kind: 'edit-post',
      postId: 'post-1',
    })
  })

  it('matches blog list and detail routes', () => {
    expect(matchRoute(buildBlogListPath('demo-user'))).toEqual({
      kind: 'blog-list',
      username: 'demo-user',
    })
    expect(matchRoute(buildBlogPostPath('demo-user', 'post-1'))).toEqual({
      kind: 'blog-detail',
      username: 'demo-user',
      postId: 'post-1',
    })
  })

  it('returns not-found for unknown paths', () => {
    expect(matchRoute('/missing')).toEqual({ kind: 'not-found' })
  })
})
