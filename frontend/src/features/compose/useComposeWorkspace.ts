import { useEffect } from 'react'
import { useBranchSelection } from './useBranchSelection'
import { useCommitFeed } from './useCommitFeed'
import { useCommitSelection } from './useCommitSelection'
import { useDraftGeneration } from './useDraftGeneration'
import { useDraftPreview } from './useDraftPreview'
import { useDraftSave } from './useDraftSave'
import { useRepositorySelection } from './useRepositorySelection'

export function useComposeWorkspace(onSaveSuccess?: () => void) {
  const {
    repositories,
    selectedRepositoryId,
    setSelectedRepositoryId,
    errorMessage: repositoriesErrorMessage,
  } = useRepositorySelection()
  const {
    branches,
    selectedBranch,
    setSelectedBranch,
    errorMessage: branchesErrorMessage,
  } = useBranchSelection(selectedRepositoryId)
  const { commits, errorMessage: commitsErrorMessage } = useCommitFeed(
    selectedRepositoryId,
    selectedBranch,
  )
  const {
    selectedCommitShas,
    maxSelectedCommits,
    toggleCommitSelection,
    clearCommitSelection,
  } = useCommitSelection()
  const { draft, setDraft, clearDraft } = useDraftPreview()
  const {
    isGenerating,
    errorMessage: draftGenerationErrorMessage,
    generateDraft,
    clearErrorMessage: clearDraftGenerationErrorMessage,
    emptySelectionCount,
  } = useDraftGeneration(setDraft)
  const {
    isSaving,
    errorMessage: draftSaveErrorMessage,
    saveDraft,
    clearErrorMessage: clearDraftSaveErrorMessage,
  } = useDraftSave(onSaveSuccess)

  useEffect(() => {
    clearCommitSelection()
    clearDraft()
    clearDraftGenerationErrorMessage()
    clearDraftSaveErrorMessage()
  }, [
    selectedRepositoryId,
    clearCommitSelection,
    clearDraft,
    clearDraftGenerationErrorMessage,
    clearDraftSaveErrorMessage,
  ])

  useEffect(() => {
    clearCommitSelection()
    clearDraft()
    clearDraftGenerationErrorMessage()
    clearDraftSaveErrorMessage()
  }, [
    selectedBranch,
    clearCommitSelection,
    clearDraft,
    clearDraftGenerationErrorMessage,
    clearDraftSaveErrorMessage,
  ])

  return {
    repositories,
    branches,
    commits,
    selectedRepositoryId,
    selectedBranch,
    selectedCommitShas,
    draft,
    errorMessage:
      draftSaveErrorMessage ||
      draftGenerationErrorMessage ||
      commitsErrorMessage ||
      branchesErrorMessage ||
      repositoriesErrorMessage,
    isGenerating,
    isSaving,
    maxSelectedCommits,
    emptySelectionCount,
    setSelectedRepositoryId,
    setSelectedBranch,
    toggleCommitSelection,
    generateDraft: () =>
      generateDraft({
        repositoryId: selectedRepositoryId,
        branchName: selectedBranch,
        commitShas: selectedCommitShas,
      }),
    saveDraft: () =>
      draft
        ? saveDraft({
            repositoryId: selectedRepositoryId,
            branchName: selectedBranch,
            commitShas: selectedCommitShas,
            title: draft.title,
            summary: draft.summary,
            body: draft.body,
            tags: draft.tags,
          })
        : Promise.resolve(),
  }
}
