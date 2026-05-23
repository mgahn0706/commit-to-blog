export type GithubRepository = {
  id: string
  name: string
  owner: string
  fullName: string
  defaultBranch: string
}

export type GithubBranch = {
  name: string
  isDefault: boolean
}

export type GithubCommit = {
  sha: string
  shortSha: string
  message: string
  authorName: string
  authoredAt: string
}
