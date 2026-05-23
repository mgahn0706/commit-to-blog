import type {
  Commit,
  Post,
  PostContent,
  PostSourceCommit,
  Repository,
} from '@prisma/client'
import type {
  PostDetailDTO,
  PostSourceCommitDTO,
  PublicBlogPostDetailDTO,
  PublicBlogPostListItemDTO,
  SavedPostCardDTO,
} from '../types/dto.js'

type PostSourceCommitWithCommit = PostSourceCommit & {
  commit: Commit & {
    repository: Repository
  }
}

type PostWithRelations = Post & {
  content: PostContent | null
  sourceCommits: PostSourceCommitWithCommit[]
  user?: {
    username: string
  }
}

function parseTags(tagsJson?: string | null) {
  if (!tagsJson) {
    return []
  }

  try {
    const parsed = JSON.parse(tagsJson) as unknown
    return Array.isArray(parsed)
      ? parsed.filter((tag): tag is string => typeof tag === 'string')
      : []
  } catch {
    return []
  }
}

export function mapPostSourceCommitToDTO(
  sourceCommit: PostSourceCommitWithCommit,
): PostSourceCommitDTO {
  return {
    sha: sourceCommit.commit.sha,
    shortSha: sourceCommit.commit.sha.slice(0, 7),
    message: sourceCommit.commit.message,
    authorName: sourceCommit.commit.authorName,
    authoredAt: sourceCommit.commit.authoredAt.toISOString(),
    repository: {
      id: sourceCommit.commit.repository.githubRepoId,
      owner: sourceCommit.commit.repository.owner,
      name: sourceCommit.commit.repository.name,
      fullName: `${sourceCommit.commit.repository.owner}/${sourceCommit.commit.repository.name}`,
      defaultBranch: sourceCommit.commit.repository.defaultBranch,
    },
    sourceBranchName: sourceCommit.sourceBranchName,
    order: sourceCommit.order,
  }
}

export function mapPostToSavedPostCardDTO(post: PostWithRelations): SavedPostCardDTO {
  const sortedSourceCommits = [...post.sourceCommits].sort(
    (left, right) => left.order - right.order,
  )

  return {
    id: post.id,
    status: post.status,
    username: post.user?.username ?? '',
    title: post.content?.title ?? '',
    summary: post.content?.summary ?? null,
    updatedAt: post.updatedAt.toISOString(),
    publishedAt: post.publishedAt?.toISOString() ?? null,
    sourceCommit: sortedSourceCommits[0]
      ? mapPostSourceCommitToDTO(sortedSourceCommits[0])
      : null,
    sourceCommitCount: sortedSourceCommits.length,
  }
}

export function mapPostToDetailDTO(post: PostWithRelations): PostDetailDTO {
  return {
    id: post.id,
    status: post.status,
    username: post.user?.username ?? '',
    title: post.content?.title ?? '',
    summary: post.content?.summary ?? null,
    body: post.content?.body ?? '',
    tags: parseTags(post.content?.tagsJson),
    createdAt: post.createdAt.toISOString(),
    updatedAt: post.updatedAt.toISOString(),
    publishedAt: post.publishedAt?.toISOString() ?? null,
    sourceCommits: post.sourceCommits
      .sort((left, right) => left.order - right.order)
      .map(mapPostSourceCommitToDTO),
  }
}

export function mapPostToPublicListItemDTO(
  post: PostWithRelations,
): PublicBlogPostListItemDTO {
  return {
    id: post.id,
    title: post.content?.title ?? '',
    summary: post.content?.summary ?? null,
    publishedAt: post.publishedAt?.toISOString() ?? '',
  }
}

export function mapPostToPublicDetailDTO(
  post: PostWithRelations,
): PublicBlogPostDetailDTO {
  return {
    id: post.id,
    username: post.user?.username ?? '',
    title: post.content?.title ?? '',
    summary: post.content?.summary ?? null,
    body: post.content?.body ?? '',
    tags: parseTags(post.content?.tagsJson),
    publishedAt: post.publishedAt?.toISOString() ?? '',
  }
}
