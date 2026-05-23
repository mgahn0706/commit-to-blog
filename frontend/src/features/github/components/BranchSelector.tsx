import type { GithubBranch } from '../types'

type BranchSelectorProps = {
  branches: GithubBranch[]
  value: string
  onChange: (branchName: string) => void
}

export function BranchSelector({
  branches,
  value,
  onChange,
}: BranchSelectorProps) {
  return (
    <label className="feature-field">
      <span>Branch</span>
      <select value={value} onChange={(event) => onChange(event.target.value)}>
        {branches.map((branch) => (
          <option key={branch.name} value={branch.name}>
            {branch.name}
            {branch.isDefault ? ' (default)' : ''}
          </option>
        ))}
      </select>
    </label>
  )
}
