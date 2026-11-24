import { defineConfig } from '@playwright/test';
import { runtimeConfig } from './config/runtime';

export default defineConfig({
    testDir: './tests',
    fullyParallel: true,
    forbidOnly: runtimeConfig.isCI,
    failOnFlakyTests: runtimeConfig.isCI,
    workers: runtimeConfig.workers,
    retries: runtimeConfig.retries,
    reporter: [
        [runtimeConfig.isCI ? 'github' : 'list'],
        ['html', { open: 'never' }]
    ],
    use: {
        baseURL: runtimeConfig.baseURL,
        screenshot: 'only-on-failure',
        trace: 'retain-on-failure'
    }
});
