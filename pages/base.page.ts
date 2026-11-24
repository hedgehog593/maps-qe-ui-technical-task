import type { Page } from '@playwright/test';

export abstract class BasePage {
    constructor(protected readonly page: Page) { }

    protected async navigate(path: string): Promise<void> {
        const response = await this.page.goto(path);
        if (!response?.ok()) {
            const status = response ? `HTTP ${response.status()}` : 'no HTTP response';
            throw new Error(`Could not open ${path} (${status})`);
        }
    }

    protected heading(name: string) {
        return this.page.getByRole('heading', { name, exact: true });
    }

    protected button(name: string) {
        return this.page.getByRole('button', { name, exact: true });
    }

    protected radio(name: string) {
        return this.page.getByRole('radio', { name, exact: true });
    }
}
