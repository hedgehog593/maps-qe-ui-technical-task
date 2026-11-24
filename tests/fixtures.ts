import { expect, test as base } from '@playwright/test';
import { runtimeConfig } from '../config/runtime';
import { CalculatorPage } from '../pages/calculator.page';

export const test = base.extend<{ calculatorPage: CalculatorPage }>({
    calculatorPage: async ({ page }, use) => {
        const calculatorPage = new CalculatorPage(page, runtimeConfig.calculatorPath);
        await calculatorPage.open();
        await use(calculatorPage);
    }
});

export { expect };
