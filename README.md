# MaPS holiday entitlement calculator tests

This Playwright suite exercises the GOV.UK holiday entitlement calculator in Chromium. Each test uses a fresh browser context. The suite requires internet access and runs without credentials.

## Setup and validation

Use Node.js 24, as specified in `.nvmrc`. Run these commands from the repository root.

```sh
npm ci
npx playwright install chromium
npm run validate
```

On Linux, use `npx playwright install --with-deps chromium` to install the browser and its system dependencies. `npm run validate` runs ESLint, TypeScript checks, and the full Playwright suite.

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

Run a subset with `npm test -- --grep @smoke` or `npm test -- --grep @negative`. Run serially with `npm test -- --workers=1`.

## Configuration and reports

Configuration defaults live in `config/runtime.ts`, and inputs and expected answers live in `test-data/holiday-scenarios.ts`. For local overrides, copy `.env.example` to `.env` and uncomment the settings you need. Shell and CI settings take precedence. Missing overrides use the defaults, and malformed values stop the run before a browser opens.

| Variable | Default | Purpose |
| --- | --- | --- |
| `MAPS_BASE_URL` | `https://www.gov.uk` | HTTP(S) origin serving the calculator |
| `MAPS_WORKERS` | `2` | Number of parallel workers |
| `MAPS_RETRIES` | `0` locally, `1` in CI | Number of retries per failing case |

Local environment files are ignored by Git. If an authenticated environment is added later, provide credentials through GitHub Actions secrets and keep them out of URLs and test data.

Open the HTML report with `npx playwright show-report`. Failed cases retain screenshots and traces. GitHub Actions runs lint, type checking and Playwright on PRs into `main` and pushes to `main`. The workflow publishes the report and failure evidence as the `playwright-results` artifact. CI flags tests that pass only after a retry, so a flaky result fails the check.

For changes, branch from the working branch `develop`, open a pull request into `main`, and merge after review and passing checks. Sync `develop` with `main` after merging.
