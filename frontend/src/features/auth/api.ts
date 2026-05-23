import { apiRequest } from '@/lib/api'

export type CurrentUser = {
  id: string
  githubId: string
  username: string
  avatarUrl?: string | null
}

export function fetchCurrentUser() {
  return apiRequest<CurrentUser>('/auth/me')
}
