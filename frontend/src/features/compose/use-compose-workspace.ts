import { useEffect } from 'react'
import { useBranchSelection } from './use-branch-selection'
import { useCommitFeed } from './use-commit-feed'
import { useCommitSelection } from './use-commit-selection'
import { useDraftGeneration } from './use-draft-generation'
import { useDraftPreview } from './use-draft-preview'
import { useDraftSave } from './use-draft-save'
import { useRepositorySelection } from './use-repository-selection'

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
