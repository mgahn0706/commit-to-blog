import { apiRequest } from '@/lib/api'
import type { GithubBranch, GithubCommit, GithubRepository } from './types'

export function fetchRepositories(): Promise<GithubRepository[]> {
  return apiRequest('/github/repositories')
}

export function fetchBranches(repositoryId: string): Promise<GithubBranch[]> {
  return apiRequest(`/github/repositories/${repositoryId}/branches`)
}

export function fetchCommits(
  repositoryId: string,
  branchName: string,
): Promise<GithubCommit[]> {
  return apiRequest(
    `/github/repositories/${repositoryId}/commits?branch=${encodeURIComponent(branchName)}`,
  )
}
