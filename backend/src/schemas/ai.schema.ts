import { z } from 'zod'

export const generatePostSchema = z.object({
  repositoryId: z.string().min(1),
  branchName: z.string().min(1),
  commitShas: z.array(z.string().min(1)).min(1).max(5),
})
