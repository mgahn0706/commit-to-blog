const apiBaseUrl =
  import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '') ?? 'http://localhost:3001/api'

type RequestOptions = Omit<RequestInit, 'body'> & {
  body?: unknown
}

export async function apiRequest<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const response = await fetch(`${apiBaseUrl}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers ?? {}),
    },
    body: options.body === undefined ? undefined : JSON.stringify(options.body),
  })

  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as
      | { message?: string }
      | null

    throw new Error(payload?.message ?? `Request failed with ${response.status}.`)
  }

  if (response.status === 204) {
    return undefined as T
  }

  return (await response.json()) as T
}
