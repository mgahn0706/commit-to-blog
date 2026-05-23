import { useCallback, useState } from 'react'
import type { GenerateDraftResult } from '@/features/ai/types'

export function useDraftPreview() {
  const [draft, setDraft] = useState<GenerateDraftResult | null>(null)

  const clearDraft = useCallback(() => {
    setDraft(null)
  }, [])

  return {
    draft,
    setDraft,
    clearDraft,
  }
}
