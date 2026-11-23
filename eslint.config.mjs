import js from '@eslint/js';
import { defineConfig } from 'eslint/config';
import tseslint from 'typescript-eslint';

export default defineConfig(
    {
        ignores: [
            'node_modules/**',
            'test-results/**',
            'playwright-report/**'
        ]
    },
    {
        files: ['**/*.{js,ts}'],
        extends: [
            js.configs.recommended,
            tseslint.configs.recommended
        ]
    }
);
