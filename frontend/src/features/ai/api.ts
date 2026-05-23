import { apiRequest } from '@/lib/api'
import type { GenerateDraftInput, GenerateDraftResult } from './types'

export function generateDraftFromCommits(
  input: GenerateDraftInput,
): Promise<GenerateDraftResult> {
  return apiRequest('/ai/generate-post', {
    method: 'POST',
    body: input,
  })
}
