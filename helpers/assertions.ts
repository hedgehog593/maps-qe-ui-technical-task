import { expect } from '@playwright/test';
import { CalculatorPage } from '../pages/calculator.page';
import type { ExpectedAnswer } from '../test-data/holiday-scenarios';

export async function expectSummaryAnswers(
    calculatorPage: CalculatorPage,
    expectedAnswers: ExpectedAnswer[]
): Promise<void> {
    for (const expected of expectedAnswers) {
        const row = calculatorPage.getAnswerRow(expected.question);

        await expect(row).toHaveCount(1);
        await expect(
            row.locator('.govuk-summary-list__value')
        ).toHaveText(expected.answer);
    }
}
