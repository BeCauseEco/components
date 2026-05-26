---
name: ci-pr-review
description: CI-only. Invoked explicitly as /ci-pr-review by the GitHub Actions PR-review workflow. Do NOT auto-select this for interactive, local, or ad-hoc code review — for those use your normal review flow (e.g. Superpowers). Produces findings ranked by criticality with a per-finding severity score (1-10) and an overall verdict; single pass, no subagents, no interactivity.
---

# CI PR review

You are reviewing a pull request in CI, invoked explicitly as `/ci-pr-review`.
There is no human to answer questions and no follow-up turn — produce the
complete review in one pass.

## Process

1. Determine the changed set: diff the PR branch against the merge-base with the
   base branch. Review **only the changed/added lines**, but read enough
   surrounding code to judge them accurately.
2. Apply the project's own rules: read `CLAUDE.md` and any `.claude/rules/*`
   files in the repo and treat violations of them as real findings.
3. Judge correctness, security, data-loss risk, error handling, architecture
   fit, and convention adherence. Prefer a few high-signal findings over an
   exhaustive list of nits.
4. Do **not** modify code, do **not** dispatch subagents, do **not** ask
   questions. If something is genuinely ambiguous, state the assumption in the
   finding.

## Severity tiers and scores

Every finding gets a tier and a 1–10 score:

- **CRITICAL · 9–10** — security hole, auth bypass, data loss, or broken core
  functionality. Shipping this causes incidents.
- **HIGH · 7–8** — likely bug, unhandled error on an important path, or a
  serious architecture/performance problem.
- **MEDIUM · 4–6** — correctness edge case, risky logic without tests, or a
  convention violation that will bite maintainers.
- **LOW · 1–3** — style, naming, minor polish, nits.

## Output format (exactly this)

```
## Claude review — overall: <APPROVE | NEEDS FIXES | BLOCKING>

### Findings (worst first)

1. [CRITICAL · 9/10] path/to/file.ts:42
   What's wrong and its impact. Concrete fix.

2. [HIGH · 7/10] path/to/other.tsx:88
   ...

(continue, sorted by score descending)

### Verdict

<one line: the verdict and why, with counts — e.g.
"NEEDS FIXES — 0 critical, 2 high, 3 medium">
```

Rules for the verdict:

- **BLOCKING** if any CRITICAL finding exists.
- **NEEDS FIXES** if any HIGH finding exists, or 3+ MEDIUM findings.
- **APPROVE** otherwise.

If you find no issues, output the header with verdict `APPROVE`, a single line
"No issues found in the changed code." under Findings, and the Verdict line.

Keep it tight. Do not paste the diff back. Every finding must cite `path:line`
and give a specific, actionable fix.
