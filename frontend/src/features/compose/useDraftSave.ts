import { useCallback, useState } from 'react'
import { createSavedPost } from '@/features/posts/api'
import { getErrorMessage } from '@/lib/get-error-message'

const SAVE_DRAFT_ERROR_MESSAGE = 'Failed to save draft.'

type SaveDraftInput = {
  repositoryId: string
  branchName: string
  commitShas: string[]
  title: string
  summary?: string | null
  body: string
  tags?: string[]
}

export function useDraftSave(onSaveSuccess?: () => void) {
  const [isSaving, setIsSaving] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const saveDraft = useCallback(async (input: SaveDraftInput) => {
    if (!input.repositoryId || !input.branchName || !input.body || !input.title) {
      return
    }

    setIsSaving(true)
    setErrorMessage('')

    try {
      await createSavedPost({
        repositoryId: input.repositoryId,
        branchName: input.branchName,
        commitShas: input.commitShas,
        title: input.title,
        summary: input.summary ?? undefined,
        body: input.body,
        tags: input.tags,
      })
      onSaveSuccess?.()
    } catch (error) {
      setErrorMessage(getErrorMessage(error, SAVE_DRAFT_ERROR_MESSAGE))
    } finally {
      setIsSaving(false)
    }
  }, [onSaveSuccess])

  const clearErrorMessage = useCallback(() => {
    setErrorMessage('')
  }, [])

  return {
    isSaving,
    errorMessage,
    saveDraft,
    clearErrorMessage,
  }
}
