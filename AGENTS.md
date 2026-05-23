# Commit Message Rule

Allowed commit types:

- `feat`
- `fix`
- `chore`
- `docs`

Every commit message must include:

- The feature list number in the title
- A `Confirmed:` line in the body
- An `Unclear at first:` line in the body

Use the following commit title format:

```text
feat: #3 뉴스 카드 컴포넌트
```

Write the commit body in English using this format:

```text
Confirmed: Checked the component layout and decided to further split components because the structure was complex.
Unclear at first: Confirmed why `useCallback` was used.
```

Guidelines:

- Include the feature list number as `#<number>` in every commit title.
- Start confirmed items with `Confirmed:`.
- Start things that were unclear at first but later understood with `Unclear at first:`.
- Keep each line short, direct, and written in natural English.

Workflow rule for Codex:

- For every Codex task, summarize the changes before any commit.
- If the user asks to commit, run the repo-local `pre-commit-review` skill before committing.
- Share the pre-commit review report before committing.
- If the review passes and the user already asked to commit, commit automatically without asking again.
- If the review does not pass, report the issues and do not commit until they are resolved.
- If the user has not asked to commit yet, only summarize the changes and wait.
- If the current change is cohesive and clearly commit-ready, Codex may commit it without waiting for a separate commit request.
- In frontend UI components and route pages, move `useEffect`-driven loading or sync logic into custom hooks in separate files whenever possible.
- For any commit that directly changes frontend features or components, run the React Testing Library suite with `npm test` in `frontend` before commit. If the tests fail, refactor or fix the code before committing.
- Use `git add -A` before commit so the full tracked and untracked change set is staged in one step.
- Determine the next feature list number incrementally from previous commit logs when possible, instead of asking the user each time.
