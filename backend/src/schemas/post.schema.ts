import { z } from 'zod'

export const postsQuerySchema = z.object({
  status: z.enum(['all', 'draft', 'published']).default('all'),
})

export const postIdParamsSchema = z.object({
  postId: z.string().min(1),
})

export const createPostSchema = z.object({
  repositoryId: z.string().min(1),
  branchName: z.string().min(1),
  commitShas: z.array(z.string().min(1)).min(1).max(5),
  title: z.string().min(1),
  summary: z.string().optional(),
  body: z.string().min(1),
  tags: z.array(z.string().min(1)).optional(),
})

export const updatePostSchema = z
  .object({
    title: z.string().min(1).optional(),
    summary: z.string().optional(),
    body: z.string().min(1).optional(),
  })
  .refine((value) => Object.values(value).some((item) => item !== undefined), {
    message: 'At least one field is required.',
  })

export const blogParamsSchema = z.object({
  username: z.string().min(1),
})

export const blogPostParamsSchema = blogParamsSchema.extend({
  postId: z.string().min(1),
})
