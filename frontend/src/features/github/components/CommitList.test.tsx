import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { CommitList } from './CommitList'

const commits = [
  {
    sha: 'abcdef123456',
    shortSha: 'abcdef1',
    message: 'feat: add blog draft preview',
    authorName: 'teseuteu',
    authoredAt: '2026-05-23T10:00:00.000Z',
  },
  {
    sha: '123456abcdef',
    shortSha: '123456a',
    message: 'fix: tighten publish validation',
    authorName: 'teseuteu',
    authoredAt: '2026-05-23T11:00:00.000Z',
  },
]

describe('CommitList', () => {
  it('renders commits and toggles the selected commit sha', () => {
    const handleToggle = vi.fn()

    render(
      <CommitList
        commits={commits}
        selectedCommitShas={['abcdef123456']}
        onToggleCommit={handleToggle}
      />,
    )

    expect(screen.getByText('feat: add blog draft preview')).toBeInTheDocument()
    expect(screen.getByRole('checkbox', { name: /feat: add blog draft preview/i })).toBeChecked()

    fireEvent.click(
      screen.getByRole('checkbox', { name: /fix: tighten publish validation/i }),
    )

    expect(handleToggle).toHaveBeenCalledWith('123456abcdef')
  })
})
