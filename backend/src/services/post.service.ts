import { PostStatus } from '@prisma/client'
import { mapPostToDetailDTO, mapPostToSavedPostCardDTO } from '../mappers/post.mapper.js'
import { commitRepository } from '../repositories/commit.repository.js'
import { postRepository } from '../repositories/post.repository.js'
import { repositoryRepository } from '../repositories/repository.repository.js'
import { userRepository } from '../repositories/user.repository.js'
import type { AuthenticatedUser } from '../types/dto.js'
import { HttpError } from '../utils/httpError.js'
import { githubService } from './github.service.js'

class PostService {
  async listPosts(
    currentUser: AuthenticatedUser,
    status: 'all' | 'draft' | 'published',
  ) {
    const user = await userRepository.ensureUser(currentUser)
    const mappedStatus =
      status === 'all'
        ? undefined
        : status === 'draft'
          ? PostStatus.DRAFT
          : PostStatus.PUBLISHED
    const posts = await postRepository.findManyByUser(user.id, mappedStatus)
    return posts.map(mapPostToSavedPostCardDTO)
  }

  async createPost(
    currentUser: AuthenticatedUser,
    input: {
      repositoryId: string
      branchName: string
      commitShas: string[]
      title: string
      summary?: string
      body: string
      tags?: string[]
    },
  ) {
    const user = await userRepository.ensureUser(currentUser)
    const githubRepository = await githubService.getRepositoryOrThrow(
      input.repositoryId,
    )

    const repository = await repositoryRepository.upsertRepository({
      userId: user.id,
      githubRepoId: githubRepository.id,
      owner: githubRepository.owner,
      name: githubRepository.name,
      defaultBranch: githubRepository.defaultBranch,
    })

    const commits = await Promise.all(
      input.commitShas.map(async (commitSha) => {
        const existingCommit = await commitRepository.findByRepositoryAndSha(
          repository.id,
          commitSha,
        )

        if (existingCommit) {
          return existingCommit
        }

        const commitDetail = await githubService.getCommitDetail(
          input.repositoryId,
          commitSha,
        )

        return commitRepository.upsertCommit({
          repositoryId: repository.id,
          sha: commitDetail.sha,
          message: commitDetail.message,
          authorName: commitDetail.authorName,
          authorEmail: commitDetail.authorEmail,
          authoredAt: new Date(commitDetail.authoredAt),
        })
      }),
    )

    const post = await postRepository.createPost({
      userId: user.id,
      status: PostStatus.DRAFT,
      title: input.title,
      summary: input.summary,
      body: input.body,
      tags: input.tags,
      sourceCommits: commits.map((commit, index) => ({
        commitId: commit.id,
        sourceBranchName: input.branchName,
        order: index,
      })),
    })

    return mapPostToDetailDTO(post)
  }

  async getPost(currentUser: AuthenticatedUser, postId: string) {
    const user = await userRepository.ensureUser(currentUser)
    const post = await postRepository.findByIdAndUser(postId, user.id)

    if (!post) {
      throw new HttpError(404, 'NotFound', 'Post not found.')
    }

    return mapPostToDetailDTO(post)
  }

  async updatePost(
    currentUser: AuthenticatedUser,
    postId: string,
    input: {
      title?: string
      summary?: string
      body?: string
    },
  ) {
    const user = await userRepository.ensureUser(currentUser)
    const post = await postRepository.findByIdAndUser(postId, user.id)

    if (!post) {
      throw new HttpError(404, 'NotFound', 'Post not found.')
    }

    const updatedPost = await postRepository.updateContent(postId, input)
    return mapPostToDetailDTO(updatedPost)
  }

  async publishPost(currentUser: AuthenticatedUser, postId: string) {
    const user = await userRepository.ensureUser(currentUser)
    const post = await postRepository.findByIdAndUser(postId, user.id)

    if (!post) {
      throw new HttpError(404, 'NotFound', 'Post not found.')
    }

    if (!post.content?.title || !post.content.body) {
      throw new HttpError(
        400,
        'ValidationError',
        'Title and body are required for publishing.',
      )
    }

    const publishedPost = await postRepository.publish(postId)
    return mapPostToDetailDTO(publishedPost)
  }

  async deletePost(currentUser: AuthenticatedUser, postId: string) {
    const user = await userRepository.ensureUser(currentUser)
    const post = await postRepository.findByIdAndUser(postId, user.id)

    if (!post) {
      throw new HttpError(404, 'NotFound', 'Post not found.')
    }

    await postRepository.delete(postId)
    return { success: true }
  }
}

export const postService = new PostService()
