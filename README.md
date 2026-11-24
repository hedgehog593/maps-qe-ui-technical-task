# MaPS holiday entitlement calculator tests

The Playwright suite covers TC01–TC07 for the GOV.UK holiday entitlement calculator. Each case starts in a fresh browser context.

## Setup and validation

Use Node.js 24 or a newer supported release. From the repository root, run:

```sh
npm ci
npx playwright install chromium
npm run validate
```

`npm run validate` runs ESLint, TypeScript checks, and the Playwright suite. The tests use two workers by default against the live GOV.UK site and require internet access. For a serial run, use `npm test -- --workers=1`. To target another origin that serves the same calculator path, set the `MAPS_BASE_URL` environment variable.
