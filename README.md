# MaPS holiday entitlement calculator tests

This Playwright suite exercises the GOV.UK holiday entitlement calculator in Chromium. Each test uses a fresh browser context.

## Setup and validation

Use Node.js 24, as specified in `.nvmrc`. Run these commands from the repository root.

```sh
npm ci
npx playwright install chromium
npm run validate
```

## Test plan

| Case | Verifies | Tags |
| --- | --- | --- |
| TC01 | Calculator landing page and first question | `@smoke`, `@positive` |
| TC02 | Five-day full-year entitlement of 28 days, answer summary and Change link | `@smoke`, `@positive` |
| TC03 | Three-day full-year entitlement of 16.8 days and answer summary | `@positive` |
| TC04 | July start in a January leave year gives 14 days, with the expected summary | `@positive` |
| TC05 | Missing answers show validation errors on both the first question and the leave-year date | `@negative` |
| TC06 | Start again returns to the landing page, and changing an earlier answer follows the updated route | `@positive` |
| TC07 | Seventy hours of irregular work gives 8 hours of entitlement, with the expected summary | `@positive` |
| TC08 | The hours-per-week option gives 224 hours of entitlement for 40 hours over five days, with the expected summary | `@positive` |
| TC09 | The shifts option gives 19.6 twelve-hour shifts of entitlement for four shifts in an eight-day pattern, with the expected summary | `@positive` |
| TC10 | Annualised hours from 1 April to 30 September 2026 give 2.81 weeks of entitlement, with the expected summary | `@positive` |
| TC11 | Compressed hours of 36 per week over four days for the same dates give 101 hours and 6 minutes of entitlement, with the expected summary | `@positive` |

Run a subset with `npm test -- --grep @smoke` or `npm test -- --grep @negative`. Run serially with `npm test -- --workers=1`.

## Configuration and reports

Configuration defaults live in `config/runtime.ts`, and inputs and expected answers live in `test-data/holiday-scenarios.ts`. For local overrides, copy `.env.example` to `.env` and uncomment the settings you need.

| Variable | Default | Purpose |
| --- | --- | --- |
| `MAPS_BASE_URL` | `https://www.gov.uk` | HTTP(S) origin serving the calculator |
| `MAPS_WORKERS` | `2` | Number of parallel workers |
| `MAPS_RETRIES` | `0` locally, `1` in CI | Number of retries per failing case |

Open the HTML report with `npx playwright show-report`. Failed cases retain screenshots and traces. GitHub Actions runs lint, type checking and Playwright on PRs into `main` and pushes to `main`. The workflow publishes the report and failure evidence as the `playwright-results` artifact. CI flags tests that pass only after a retry, so a flaky result fails the check.

## Latest validation

The latest GitHub Actions passed ESLint, TypeScript checking and all 11 Playwright tests using two workers. [TO view a successful run](https://github.com/hedgehog593/maps-qe-ui-technical-task/actions/runs/45389420661).

## Accessibility excercise

The accessibility findings, including individual bug reports for each issue, are documented in `accessibility-pages-bonus/accessibility-findings.md`.

## Test Plan

I've documented my testing approach, risk assessment and coverage decisions in the `docs/MaPS-Test-Plan.md`.
