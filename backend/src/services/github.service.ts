import { env } from '../config/env.js'
import { mapCommitDetailToDTO, mapCommitToListItemDTO } from '../mappers/commit.mapper.js'
import { mapGithubRepositoryToDTO } from '../mappers/repository.mapper.js'
import type {
  BranchDTO,
  CommitDetailDTO,
  CommitListItemDTO,
  RepositoryDTO,
} from '../types/dto.js'
import { HttpError } from '../utils/httpError.js'
import { githubDemo } from './github-demo.js'

type GithubRepositoryResponse = {
  id: number
  name: string
  owner: {
    login: string
  }
  default_branch: string
}

type GithubBranchResponse = {
  name: string
}

type GithubCommitListResponse = Array<{
  sha: string
  commit: {
    message: string
    author: {
      name: string
      date: string
    }
  }
}>

type GithubCommitDetailResponse = {
  sha: string
  commit: {
    message: string
    author: {
      name: string
      email?: string
      date: string
    }
  }
  files?: Array<{
    filename: string
    patch?: string
  }>
}

class GithubService {
  private get isDemoMode() {
    return !env.GITHUB_TOKEN
  }

  private async request<T>(path: string) {
    if (this.isDemoMode) {
      throw new HttpError(500, 'InternalServerError', 'GitHub live mode is disabled.')
    }

    const response = await fetch(`https://api.github.com${path}`, {
      headers: {
        Accept: 'application/vnd.github+json',
        Authorization: `Bearer ${env.GITHUB_TOKEN}`,
        'User-Agent': 'smart-blog-bff',
      },
    })

    if (response.status === 401) {
      throw new HttpError(401, 'Unauthorized', 'GitHub token is not authorized.')
    }

    if (response.status === 403) {
      throw new HttpError(403, 'Forbidden', 'GitHub access is forbidden.')
    }

    if (response.status === 404) {
      throw new HttpError(404, 'NotFound', 'GitHub resource not found.')
    }

    if (!response.ok) {
      throw new HttpError(500, 'InternalServerError', 'GitHub API request failed.')
    }

    return (await response.json()) as T
  }

  async listRepositories(): Promise<RepositoryDTO[]> {
    if (this.isDemoMode) {
      return githubDemo.listRepositories()
    }

    const repositories = await this.request<GithubRepositoryResponse[]>(
      '/user/repos?per_page=100&sort=updated',
    )

    return repositories.map((repository) =>
      mapGithubRepositoryToDTO({
        id: String(repository.id),
        owner: repository.owner.login,
        name: repository.name,
        defaultBranch: repository.default_branch,
      }),
    )
  }

  async getRepositoryOrThrow(repositoryId: string) {
    const repositories = await this.listRepositories()
    const repository = repositories.find((item) => item.id === repositoryId)

    if (!repository) {
      throw new HttpError(
        403,
        'Forbidden',
        'Repository is not available to the current user.',
      )
    }

    return repository
  }

  async listBranches(repositoryId: string): Promise<BranchDTO[]> {
    const repository = await this.getRepositoryOrThrow(repositoryId)

    if (this.isDemoMode) {
      return githubDemo.listBranches(repositoryId)
    }

    const branches = await this.request<GithubBranchResponse[]>(
      `/repos/${repository.owner}/${repository.name}/branches?per_page=100`,
    )

    return branches.map((branch) => ({
      name: branch.name,
      isDefault: branch.name === repository.defaultBranch,
    }))
  }

  async listCommits(
    repositoryId: string,
    branchName: string,
  ): Promise<CommitListItemDTO[]> {
    const repository = await this.getRepositoryOrThrow(repositoryId)

    if (this.isDemoMode) {
      return githubDemo.listCommits(repositoryId, branchName)
    }

    const commits = await this.request<GithubCommitListResponse>(
      `/repos/${repository.owner}/${repository.name}/commits?sha=${encodeURIComponent(branchName)}&per_page=30`,
    )

    return commits.map((commit) =>
      mapCommitToListItemDTO({
        sha: commit.sha,
        message: commit.commit.message,
        authorName: commit.commit.author.name,
        authoredAt: new Date(commit.commit.author.date),
      }),
    )
  }

  async getCommitDetail(
    repositoryId: string,
    sha: string,
  ): Promise<CommitDetailDTO & { authorEmail?: string | null }> {
    const repository = await this.getRepositoryOrThrow(repositoryId)

    if (this.isDemoMode) {
      const commit = githubDemo.getCommitDetail(repositoryId, sha)

      if (!commit) {
        throw new HttpError(404, 'NotFound', 'Demo commit not found.')
      }

      return commit
    }

    const commit = await this.request<GithubCommitDetailResponse>(
      `/repos/${repository.owner}/${repository.name}/commits/${sha}`,
    )

    const changedFiles = commit.files?.map((file) => file.filename) ?? []
    const diff =
      commit.files
        ?.map((file) => file.patch ?? '')
        .filter(Boolean)
        .join('\n\n') ?? ''

    return {
      ...mapCommitDetailToDTO({
        sha: commit.sha,
        message: commit.commit.message,
        authorName: commit.commit.author.name,
        authoredAt: new Date(commit.commit.author.date),
        changedFiles,
        diff,
      }),
      authorEmail: commit.commit.author.email ?? null,
    }
  }
}

export const githubService = new GithubService()
