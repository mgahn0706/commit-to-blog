import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { GeneratedPostPreview } from './GeneratedPostPreview'

const preview = {
  title: 'commit-to-blog: feat: add draft generation',
  summary: 'AI draft from selected commits.',
  body: 'This draft explains the selected implementation work.',
  sourceCommits: [
    {
      sha: 'abcdef123456',
      shortSha: 'abcdef1',
      message: 'feat: add draft generation',
    },
    {
      sha: 'fedcba654321',
      message: 'fix: save published posts',
    },
  ],
  generationMode: 'fallback' as const,
  fallbackReason: 'request_failed' as const,
}

describe('GeneratedPostPreview', () => {
  it('renders commit metadata and calls save/regenerate actions', () => {
    const handleSave = vi.fn()
    const handleRegenerate = vi.fn()

    render(
      <GeneratedPostPreview
        post={preview}
        onSave={handleSave}
        onRegenerate={handleRegenerate}
      />,
    )

    expect(screen.getByText('fallback')).toBeInTheDocument()
    expect(screen.getByText('OpenAI request failed.')).toBeInTheDocument()
    expect(screen.getByText('2 source commit(s)')).toBeInTheDocument()
    expect(screen.getByText('fix: save published posts')).toBeInTheDocument()
    expect(screen.getByText('fedcba6')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: /save to saved posts/i }))
    fireEvent.click(screen.getByRole('button', { name: /regenerate/i }))

    expect(handleSave).toHaveBeenCalledTimes(1)
    expect(handleRegenerate).toHaveBeenCalledTimes(1)
  })

  it('disables save when saving is in progress', () => {
    render(<GeneratedPostPreview post={preview} onSave={vi.fn()} isSaving />)

    expect(screen.getByRole('button', { name: /saving/i })).toBeDisabled()
  })
})
