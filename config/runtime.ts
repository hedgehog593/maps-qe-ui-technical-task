import { resolve } from 'node:path';
import { env, loadEnvFile } from 'node:process';

try {
    loadEnvFile(resolve(__dirname, '../.env'));
} catch (error) {
    if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
        throw error;
    }
}

const isCI = env.CI === 'true' || env.CI === '1';

function readBaseURL(): string {
    const value = env.MAPS_BASE_URL ?? 'https://www.gov.uk';
    const url = URL.parse(value);

    if (!url || !['http:', 'https:'].includes(url.protocol) || url.username || url.password
        || url.pathname !== '/' || url.search || url.hash) {
        throw new Error('MAPS_BASE_URL must be an HTTP(S) origin without credentials, a path, query or fragment');
    }

    return url.origin;
}

function readInteger(name: 'MAPS_WORKERS' | 'MAPS_RETRIES', fallback: number, minimum: number): number {
    const value = env[name];
    if (value === undefined) {
        return fallback;
    }

    const parsed = Number(value);
    if (!/^\d+$/.test(value) || !Number.isSafeInteger(parsed) || parsed < minimum) {
        throw new Error(`${name} must be a whole number of at least ${minimum}`);
    }

    return parsed;
}

export const runtimeConfig = {
    baseURL: readBaseURL(),
    calculatorPath: '/calculate-your-holiday-entitlement',
    isCI,
    workers: readInteger('MAPS_WORKERS', 2, 1),
    retries: readInteger('MAPS_RETRIES', isCI ? 1 : 0, 0)
} as const;
