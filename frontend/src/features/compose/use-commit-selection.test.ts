import { act, renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { useCommitSelection } from './use-commit-selection'

describe('useCommitSelection', () => {
  it('toggles commit selection and enforces the max size', () => {
    const { result } = renderHook(() => useCommitSelection())

    act(() => {
      result.current.toggleCommitSelection('a')
      result.current.toggleCommitSelection('b')
      result.current.toggleCommitSelection('c')
      result.current.toggleCommitSelection('d')
      result.current.toggleCommitSelection('e')
      result.current.toggleCommitSelection('f')
    })

    expect(result.current.selectedCommitShas).toEqual(['a', 'b', 'c', 'd', 'e'])
    expect(result.current.maxSelectedCommits).toBe(5)

    act(() => {
      result.current.toggleCommitSelection('c')
    })

    expect(result.current.selectedCommitShas).toEqual(['a', 'b', 'd', 'e'])
  })
})
