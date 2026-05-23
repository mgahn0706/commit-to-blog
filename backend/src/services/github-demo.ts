import type { CommitDetailDTO, CommitListItemDTO, RepositoryDTO } from '../types/dto.js'

type DemoCommitDetail = CommitDetailDTO & {
  authorEmail?: string | null
}

const demoRepositories: RepositoryDTO[] = [
  {
    id: 'repo-1',
    owner: 'teseuteu',
    name: 'commit-to-blog',
    fullName: 'teseuteu/commit-to-blog',
    defaultBranch: 'main',
  },
  {
    id: 'repo-2',
    owner: 'teseuteu',
    name: 'frontend-lab',
    fullName: 'teseuteu/frontend-lab',
    defaultBranch: 'develop',
  },
]

const demoBranchesByRepository: Record<string, Array<{ name: string }>> = {
  'repo-1': [{ name: 'main' }, { name: 'feature/news-card' }],
  'repo-2': [{ name: 'develop' }, { name: 'experiment/hero-layout' }],
}

const demoCommitsByBranch: Record<string, CommitListItemDTO[]> = {
  'repo-1:main': [
    {
      sha: '61287b7',
      shortSha: '61287b7',
      message: 'feat: #11 scaffold smart blog backend api',
      authorName: 'teseuteu',
      authoredAt: '2026-05-17T04:06:00.000Z',
    },
    {
      sha: 'fcc0c83',
      shortSha: 'fcc0c83',
      message: 'docs: #10 standardize git add -A before commit',
      authorName: 'teseuteu',
      authoredAt: '2026-05-17T03:50:00.000Z',
    },
    {
      sha: '088ddfe',
      shortSha: '088ddfe',
      message: 'feat: #9 add basic express backend',
      authorName: 'teseuteu',
      authoredAt: '2026-05-17T03:41:00.000Z',
    },
  ],
  'repo-1:feature/news-card': [
    {
      sha: '9ad2ef1',
      shortSha: '9ad2ef1',
      message: 'feat: #3 뉴스 카드 컴포넌트',
      authorName: 'teseuteu',
      authoredAt: '2026-05-16T12:08:00.000Z',
    },
  ],
  'repo-2:develop': [
    {
      sha: '1e44ad8',
      shortSha: '1e44ad8',
      message: 'fix: tighten card spacing tokens',
      authorName: 'teseuteu',
      authoredAt: '2026-05-15T09:04:00.000Z',
    },
  ],
  'repo-2:experiment/hero-layout': [
    {
      sha: '3ce8b0d',
      shortSha: '3ce8b0d',
      message: 'feat: build alternate landing hero',
      authorName: 'teseuteu',
      authoredAt: '2026-05-13T00:44:00.000Z',
    },
  ],
}

const demoCommitDetails: Record<string, DemoCommitDetail> = {
  'repo-1:61287b7': {
    sha: '61287b7',
    shortSha: '61287b7',
    message: 'feat: #11 scaffold smart blog backend api',
    authorName: 'teseuteu',
    authoredAt: '2026-05-17T04:06:00.000Z',
    changedFiles: [
      'backend/src/app.ts',
      'backend/src/routes/github.routes.ts',
      'backend/src/services/github.service.ts',
    ],
    diff: [
      'Added Express app composition with route mounting for auth, GitHub, AI, posts, and public blog.',
      'Introduced GitHub service wiring for repositories, branches, commits, and commit detail.',
      'Created the base backend shape for smart blog generation workflows.',
    ].join('\n'),
    authorEmail: 'demo@example.com',
  },
  'repo-1:fcc0c83': {
    sha: 'fcc0c83',
    shortSha: 'fcc0c83',
    message: 'docs: #10 standardize git add -A before commit',
    authorName: 'teseuteu',
    authoredAt: '2026-05-17T03:50:00.000Z',
    changedFiles: ['AGENTS.md', '.codex/skills/pre-commit-review/SKILL.md'],
    diff: [
      'Documented that Codex should stage the full tracked and untracked change set with git add -A.',
      'Aligned commit workflow instructions with the repo-local pre-commit review process.',
    ].join('\n'),
    authorEmail: 'demo@example.com',
  },
  'repo-1:088ddfe': {
    sha: '088ddfe',
    shortSha: '088ddfe',
    message: 'feat: #9 add basic express backend',
    authorName: 'teseuteu',
    authoredAt: '2026-05-17T03:41:00.000Z',
    changedFiles: ['backend/package.json', 'backend/src/server.ts'],
    diff: [
      'Initialized backend package dependencies and development scripts.',
      'Added server bootstrap to start the Express API service.',
    ].join('\n'),
    authorEmail: 'demo@example.com',
  },
  'repo-1:9ad2ef1': {
    sha: '9ad2ef1',
    shortSha: '9ad2ef1',
    message: 'feat: #3 뉴스 카드 컴포넌트',
    authorName: 'teseuteu',
    authoredAt: '2026-05-16T12:08:00.000Z',
    changedFiles: ['frontend/src/features/news/NewsCard.tsx'],
    diff: [
      'Built a news card component with a sharper visual hierarchy.',
      'Introduced reusable spacing tokens for the card layout.',
    ].join('\n'),
    authorEmail: 'demo@example.com',
  },
  'repo-2:1e44ad8': {
    sha: '1e44ad8',
    shortSha: '1e44ad8',
    message: 'fix: tighten card spacing tokens',
    authorName: 'teseuteu',
    authoredAt: '2026-05-15T09:04:00.000Z',
    changedFiles: ['frontend/src/index.css'],
    diff: 'Adjusted spacing tokens to reduce excess white space in stacked cards.',
    authorEmail: 'demo@example.com',
  },
  'repo-2:3ce8b0d': {
    sha: '3ce8b0d',
    shortSha: '3ce8b0d',
    message: 'feat: build alternate landing hero',
    authorName: 'teseuteu',
    authoredAt: '2026-05-13T00:44:00.000Z',
    changedFiles: ['frontend/src/App.tsx', 'frontend/src/App.css'],
    diff: [
      'Introduced an alternate landing hero with stronger visual framing.',
      'Rebalanced layout proportions and hero copy treatment.',
    ].join('\n'),
    authorEmail: 'demo@example.com',
  },
}

export const githubDemo = {
  listRepositories() {
    return demoRepositories
  },

  listBranches(repositoryId: string) {
    const repository = demoRepositories.find((item) => item.id === repositoryId)

    if (!repository) {
      return []
    }

    return (demoBranchesByRepository[repositoryId] ?? []).map((branch) => ({
      name: branch.name,
      isDefault: branch.name === repository.defaultBranch,
    }))
  },

  listCommits(repositoryId: string, branchName: string) {
    return demoCommitsByBranch[`${repositoryId}:${branchName}`] ?? []
  },

  getCommitDetail(repositoryId: string, sha: string) {
    return demoCommitDetails[`${repositoryId}:${sha}`] ?? null
  },
}
