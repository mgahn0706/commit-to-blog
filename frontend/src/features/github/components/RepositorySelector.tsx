import type { GithubRepository } from '../types'

type RepositorySelectorProps = {
  repositories: GithubRepository[]
  value: string
  onChange: (repositoryId: string) => void
}

export function RepositorySelector({
  repositories,
  value,
  onChange,
}: RepositorySelectorProps) {
  return (
    <label className="feature-field">
      <span>Repository</span>
      <select value={value} onChange={(event) => onChange(event.target.value)}>
        {repositories.map((repository) => (
          <option key={repository.id} value={repository.id}>
            {repository.fullName}
          </option>
        ))}
      </select>
    </label>
  )
}
