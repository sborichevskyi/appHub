name: Bug-fix
description: Fix a bug in the codebase.

# Bug-fix

## Review
When fixing a bug in AppHub, follow this workflow.

## 1. Identify the bug

If the user provides a BUG-XXX identifier:

- Read `docs/bugs.md`.
- Find the corresponding bug.
- Use its description, expected behavior, and priority as the initial context.

If the user describes a bug directly, use the provided description instead.

Do not start changing code before understanding the problem.

## 2. Investigate

Before making changes:

- Inspect the relevant client and server code.
- Trace the complete flow related to the bug.
- Identify the actual root cause.
- Check related code that could be affected by the fix.
- Do not assume that the description of the bug is necessarily the complete root cause.

Prefer understanding existing code over introducing new abstractions.

## 3. Define the fix

Choose the smallest reasonable fix that solves the root cause.

Rules:

- Do not change the overall AppHub concept or architecture.
- Do not refactor unrelated code.
- Do not change existing behavior unless it is required for the fix.
- Do not introduce new dependencies unless necessary.
- Preserve existing coding patterns where reasonable.
- If a larger architectural problem is discovered, report it separately instead of implementing it unless the user explicitly asks for it.

## 4. Implement

Make the required code changes.

Keep the changes focused on the current bug.

Before modifying code, consider:

- authentication and authorization
- user isolation
- client/server contract consistency
- error handling
- database constraints
- TypeScript types
- development and production differences

## 5. Verify

After implementing the fix:

- Run the relevant tests if they exist.
- Run TypeScript checks, linting, or build when relevant.
- Check related code paths for obvious regressions.
- If the bug affects UI behavior, verify it in the browser when possible.
- If the bug can behave differently in development and production, check both environments when possible.

Do not claim that something was verified if it was not actually tested.

## 6. Update the bug list

After the fix has been successfully verified:

- Update the corresponding bug in `docs/bugs.md`.
- Change `Status: open` to `Status: done`.
- Do not mark the bug as done if the fix has not been verified.

Do not rewrite unrelated bugs.

## 7. Final response

When finished, provide a concise summary:

### Root cause
What actually caused the bug.

### Fix
What was changed.

### Verification
What was tested and whether it passed.

### Files changed
List the relevant files.

### Remaining concerns
Mention any related issues discovered but intentionally not changed.

Do not include unrelated improvements.