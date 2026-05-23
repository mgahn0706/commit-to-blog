# Scoring Rubric

Score the change out of 10.

## Categories

- Commit scope: 0 to 2
- Convention fit: 0 to 2
- Readability and naming: 0 to 2
- Structure and separation: 0 to 2
- Duplication and constants: 0 to 2

When scoring, explicitly weigh these cross-cutting concerns as part of the categories above:

- Code style quality
- Scalability of the structure
- UI/UX clarity and honesty for frontend changes
- Readability and maintainability of the resulting code

## Guidance

### 9 to 10

- The change is focused and easy to review
- The code follows `CODE_CONVENTION.md` closely
- No meaningful cleanup is needed before commit

### 7 to 8.5

- The change is generally solid
- A few improvements are still worth making before commit
- The commit can usually proceed after small edits

### 5 to 6.5

- The code works, but the structure or clarity is weak
- Review should identify concrete improvements before commit

### Below 5

- The change is too broad, too unclear, or too inconsistent with the project rules
- Do not proceed to commit until the main issues are fixed
