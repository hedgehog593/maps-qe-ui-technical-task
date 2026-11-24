import { expect, test as base } from '@playwright/test';
import { CalculatorPage } from '../pages/calculator.page';

export const test = base.extend<{ calculatorPage: CalculatorPage }>({
    calculatorPage: async ({ page }, use) => {
        const calculatorPage = new CalculatorPage(page);
        const response = await calculatorPage.open();
        expect(response?.ok(), 'Holiday calculator landing page returns a successful response').toBe(true);
        await use(calculatorPage);
    }
});

export { expect };
