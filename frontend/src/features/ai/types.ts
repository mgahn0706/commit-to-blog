export type GenerateDraftInput = {
  repositoryId: string
  branchName: string
  commitShas: string[]
}

export type GenerateDraftResult = {
  title: string
  summary: string
  body: string
  tags: string[]
  sourceCommits: Array<{
    sha: string
    shortSha: string
    message: string
    authorName: string
    authoredAt: string
  }>
  generationMode: 'openai' | 'fallback'
}
