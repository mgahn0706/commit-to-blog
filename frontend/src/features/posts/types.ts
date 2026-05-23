export type PostStatus = 'DRAFT' | 'PUBLISHED'

export type PostSourceCommit = {
  sha: string
  shortSha: string
  message: string
  authorName: string
  authoredAt: string
  repository: {
    id: string
    owner: string
    name: string
    fullName: string
    defaultBranch: string
  }
  sourceBranchName: string
  order: number
}

export type SavedPostCard = {
  id: string
  username: string
  title: string
  summary?: string | null
  status: PostStatus
  updatedAt: string
  publishedAt?: string | null
  sourceCommit: PostSourceCommit | null
  sourceCommitCount: number
}

export type SavedPost = {
  id: string
  username: string
  title: string
  summary?: string | null
  body: string
  status: PostStatus
  tags: string[]
  createdAt: string
  updatedAt: string
  publishedAt?: string | null
  sourceCommits: PostSourceCommit[]
}

export type PublicBlogPostListItem = {
  id: string
  title: string
  summary?: string | null
  publishedAt: string
}

export type PublicBlogPostDetail = {
  id: string
  username: string
  title: string
  summary?: string | null
  body: string
  tags: string[]
  publishedAt: string
}
