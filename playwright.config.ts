import { defineConfig } from '@playwright/test';

export default defineConfig({
    testDir: './tests',
    fullyParallel: true,
    workers: 2,
    use: {
        baseURL: process.env.MAPS_BASE_URL || 'https://www.gov.uk'
    }
});
