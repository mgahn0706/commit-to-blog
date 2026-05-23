export type AuthenticatedUser = {
  githubId: string
  username: string
  avatarUrl?: string | null
}

export type AuthUserDTO = {
  id: string
  githubId: string
  username: string
  avatarUrl?: string | null
}

export type RepositoryDTO = {
  id: string
  owner: string
  name: string
  fullName: string
  defaultBranch: string
}

export type BranchDTO = {
  name: string
  isDefault: boolean
}

export type CommitListItemDTO = {
  sha: string
  shortSha: string
  message: string
  authorName: string
  authoredAt: string
}

export type CommitDetailDTO = CommitListItemDTO & {
  changedFiles: string[]
  diff: string
}

export type GeneratedPostPreviewDTO = {
  title: string
  summary: string
  body: string
  tags: string[]
  sourceCommits: CommitListItemDTO[]
  generationMode: 'openai' | 'fallback'
}

export type PostSourceCommitDTO = {
  sha: string
  shortSha: string
  message: string
  authorName: string
  authoredAt: string
  repository: RepositoryDTO
  sourceBranchName: string
  order: number
}

export type SavedPostCardDTO = {
  id: string
  status: 'DRAFT' | 'PUBLISHED'
  username: string
  title: string
  summary?: string | null
  updatedAt: string
  publishedAt?: string | null
  sourceCommit: PostSourceCommitDTO | null
  sourceCommitCount: number
}

export type PostDetailDTO = {
  id: string
  status: 'DRAFT' | 'PUBLISHED'
  username: string
  title: string
  summary?: string | null
  body: string
  tags: string[]
  createdAt: string
  updatedAt: string
  publishedAt?: string | null
  sourceCommits: PostSourceCommitDTO[]
}

export type PublicBlogPostListItemDTO = {
  id: string
  title: string
  summary?: string | null
  publishedAt: string
}

export type PublicBlogPostDetailDTO = {
  id: string
  username: string
  title: string
  summary?: string | null
  body: string
  tags: string[]
  publishedAt: string
}
