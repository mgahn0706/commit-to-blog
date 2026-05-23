---
name: pre-commit-review
description: Review working or staged code changes before commit in this repository. Use when Codex should check changes against CODE_CONVENTION.md, score the commit quality, report concrete issues, improve the code if needed, and only then continue to the normal commit approval flow. Always use this skill when the user asks to commit.
---

# Pre Commit Review

Review code changes before any commit in this repository.

Always run this skill automatically when the user asks to commit.

## Workflow

1. Read `CODE_CONVENTION.md` before evaluating the change.
2. Inspect the current change set with `git status --short` and a focused `git diff`.
3. Judge the change against the project conventions, not generic preferences.
4. Score the change using the rubric in [references/scoring.md](references/scoring.md).
5. Report the result before commit.
6. If the code can be improved immediately, improve it first.
7. Re-check the updated diff and adjust the score.
8. If the user already asked to commit and the review passes, continue directly to commit after sharing the report.
9. If the review does not pass, stop and report the blocking issues instead of committing.

## Review Focus

Check these points every time:

- Is the commit minimal and focused?
- Does the code avoid unnecessary `useEffect`, `useMemo`, and `useCallback`?
- Are names clear and intention-revealing?
- Are magic numbers extracted when they should be?
- Is repeated logic reduced or extracted?
- Does the file or component need to be split because it became too long?
- Does the code still match the intended `src/app` and `src/features` structure?
- Is the code style coherent, or is complexity merely being moved into large hooks, helpers, or global stylesheets?
- Does the change improve scalability, or does it introduce MVP-only structure that will break under more routes, features, or state?
- For frontend changes, does the UI avoid fake or misleading elements such as disabled placeholder navigation, non-functional controls, or decorative structure without product meaning?
- Does the typography, spacing, and layout create a clear hierarchy, or do sections still compete at similar visual weight?
- Does the code improve readability, or does it hide complexity in god-hooks, large CSS files, or global rules with broad side effects?
- For backend integration code, are operational failures surfaced clearly enough, or are important failures being swallowed too quietly?

## Output Format

Always report the review in this format before committing:

```text
Pre-commit review
Score: 8.5/10
Result: Pass with improvements
Confirmed:
- ...
- ...
Issues:
- ...
Improvements made:
- ...
```

If there are no issues, say `Issues: none`.

If no code improvement was needed, say `Improvements made: none`.

## Improvement Rule

- Do not stop at criticism if the problem can be fixed safely.
- Improve the code directly when the change is local and low risk.
- Re-score the change after edits.
- If a larger redesign would be required, report that clearly instead of making risky edits.

## Commit Rule

- Do not commit before sharing the review report.
- If the user already asked to commit and the review passes, commit automatically after reporting the result.
- If the review does not pass, do not commit.
- Stage changes with `git add -A` before the final commit command.
- Keep using the required commit title and body format from `AGENTS.md`.

## Notes

- Prefer repository-local rules over generic style opinions.
- Keep the review concise and concrete.
- Do not invent problems only to lower the score.
- Be willing to review harshly when architecture, UI clarity, or maintainability are weak.
- Findings should prioritize real risks in code style, scalability, UI/UX, and readability over polite but low-signal commentary.
