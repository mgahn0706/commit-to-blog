import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { PostEditor } from './PostEditor'
import type { SavedPost } from '../types'

const post: SavedPost = {
  id: 'post-1',
  username: 'demo-user',
  title: 'Draft title',
  summary: 'Draft summary',
  body: 'Draft body',
  status: 'DRAFT',
  tags: ['engineering'],
  createdAt: '2026-05-23T10:00:00.000Z',
  updatedAt: '2026-05-23T11:00:00.000Z',
  publishedAt: null,
  sourceCommits: [],
}

describe('PostEditor', () => {
  it('emits field changes and save action', () => {
    const handleChange = vi.fn()
    const handleSave = vi.fn()

    render(
      <PostEditor
        post={post}
        onChange={handleChange}
        onSave={handleSave}
        onPublish={vi.fn()}
      />,
    )

    fireEvent.change(screen.getByLabelText(/title/i), {
      target: { value: 'Updated title' },
    })
    fireEvent.click(screen.getByRole('button', { name: /save changes/i }))

    expect(handleChange).toHaveBeenCalledWith({ title: 'Updated title' })
    expect(handleSave).toHaveBeenCalledTimes(1)
  })

  it('disables publish when title or body is blank', () => {
    render(
      <PostEditor
        post={{
          ...post,
          title: '   ',
          body: '',
        }}
        onPublish={vi.fn()}
      />,
    )

    expect(screen.getByRole('button', { name: /publish/i })).toBeDisabled()
  })

  it('shows the publishing state label', () => {
    render(
      <PostEditor
        post={post}
        onPublish={vi.fn()}
        isPublishing
      />,
    )

    expect(screen.getByRole('button', { name: /publishing/i })).toBeDisabled()
  })
})
