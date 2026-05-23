import type { GithubCommit } from '../types'

type CommitListProps = {
  commits: GithubCommit[]
  selectedCommitShas: string[]
  onToggleCommit: (sha: string) => void
}

export function CommitList({
  commits,
  selectedCommitShas,
  onToggleCommit,
}: CommitListProps) {
  return (
    <ul className="stack-list">
      {commits.map((commit) => (
        <li key={commit.sha} className="stack-card">
          <div className="stack-card__row">
            <label className="checkbox-row">
              <input
                type="checkbox"
                checked={selectedCommitShas.includes(commit.sha)}
                onChange={() => onToggleCommit(commit.sha)}
              />
              <strong>{commit.message}</strong>
            </label>
            <code>{commit.shortSha}</code>
          </div>
          <p>
            {commit.authorName} · {new Date(commit.authoredAt).toLocaleString()}
          </p>
        </li>
      ))}
    </ul>
  )
}
