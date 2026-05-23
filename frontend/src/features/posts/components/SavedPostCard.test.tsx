import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { SavedPostCard } from './SavedPostCard'

describe('SavedPostCard', () => {
  it('shows the aggregated source commit label for multi-commit drafts', () => {
    render(
      <SavedPostCard
        post={{
          id: 'post-1',
          username: 'demo-user',
          title: 'Multi-commit draft',
          summary: 'Saved summary',
          status: 'DRAFT',
          updatedAt: '2026-05-23T12:00:00.000Z',
          publishedAt: null,
          sourceCommit: {
            sha: 'abcdef123456',
            shortSha: 'abcdef1',
            message: 'feat: add compose page',
            authorName: 'teseuteu',
            authoredAt: '2026-05-23T12:00:00.000Z',
            repository: {
              id: 'repo-1',
              owner: 'teseuteu',
              name: 'commit-to-blog',
              fullName: 'teseuteu/commit-to-blog',
              defaultBranch: 'main',
            },
            sourceBranchName: 'main',
            order: 0,
          },
          sourceCommitCount: 3,
        }}
        onEdit={vi.fn()}
        onOpenBlog={vi.fn()}
      />,
    )

    expect(screen.getByText('feat: add compose page +2 more')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /view blog/i })).not.toBeInTheDocument()
  })

  it('opens edit and blog actions for published posts', () => {
    const handleEdit = vi.fn()
    const handleOpenBlog = vi.fn()

    render(
      <SavedPostCard
        post={{
          id: 'post-2',
          username: 'demo-user',
          title: 'Published draft',
          summary: null,
          status: 'PUBLISHED',
          updatedAt: '2026-05-23T12:00:00.000Z',
          publishedAt: '2026-05-23T13:00:00.000Z',
          sourceCommit: null,
          sourceCommitCount: 0,
        }}
        onEdit={handleEdit}
        onOpenBlog={handleOpenBlog}
      />,
    )

    fireEvent.click(screen.getByRole('button', { name: /edit/i }))
    fireEvent.click(screen.getByRole('button', { name: /view blog/i }))

    expect(handleEdit).toHaveBeenCalledWith('post-2')
    expect(handleOpenBlog).toHaveBeenCalledWith('demo-user', 'post-2')
  })
})
