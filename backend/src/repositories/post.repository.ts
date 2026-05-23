import { PostStatus } from '@prisma/client'
import { prisma } from '../db/prisma.js'

const postInclude = {
  content: true,
  sourceCommits: {
    include: {
      commit: {
        include: {
          repository: true,
        },
      },
    },
  },
  user: {
    select: {
      username: true,
    },
  },
} as const

export const postRepository = {
  async createPost(input: {
    userId: string
    status: PostStatus
    title: string
    summary?: string
    body: string
    tags?: string[]
    sourceCommits: Array<{
      commitId: string
      sourceBranchName: string
      order: number
    }>
  }) {
    return prisma.post.create({
      data: {
        userId: input.userId,
        status: input.status,
        content: {
          create: {
            title: input.title,
            summary: input.summary,
            body: input.body,
            tagsJson: input.tags ? JSON.stringify(input.tags) : null,
          },
        },
        sourceCommits: {
          create: input.sourceCommits,
        },
      },
      include: postInclude,
    })
  },

  async findManyByUser(userId: string, status?: PostStatus) {
    return prisma.post.findMany({
      where: {
        userId,
        ...(status ? { status } : {}),
      },
      include: postInclude,
      orderBy: {
        updatedAt: 'desc',
      },
    })
  },

  async findByIdAndUser(postId: string, userId: string) {
    return prisma.post.findFirst({
      where: {
        id: postId,
        userId,
      },
      include: postInclude,
    })
  },

  async updateContent(
    postId: string,
    data: {
      title?: string
      summary?: string
      body?: string
    },
  ) {
    return prisma.post.update({
      where: { id: postId },
      data: {
        content: {
          update: data,
        },
      },
      include: postInclude,
    })
  },

  async publish(postId: string) {
    return prisma.post.update({
      where: { id: postId },
      data: {
        status: PostStatus.PUBLISHED,
        publishedAt: new Date(),
      },
      include: postInclude,
    })
  },

  async delete(postId: string) {
    return prisma.post.delete({
      where: { id: postId },
    })
  },

  async findPublishedByUsername(username: string) {
    return prisma.post.findMany({
      where: {
        status: PostStatus.PUBLISHED,
        user: {
          username,
        },
      },
      include: postInclude,
      orderBy: {
        publishedAt: 'desc',
      },
    })
  },

  async findPublishedDetail(username: string, postId: string) {
    return prisma.post.findFirst({
      where: {
        id: postId,
        status: PostStatus.PUBLISHED,
        user: {
          username,
        },
      },
      include: postInclude,
    })
  },
}
