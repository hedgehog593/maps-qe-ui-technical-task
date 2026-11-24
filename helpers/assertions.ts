import { expect } from '@playwright/test';
import type { CalculatorPage } from '../pages/calculator.page';
import type { ExpectedSummaryAnswer } from '../test-data/holiday-scenarios';

export async function expectCalculatorLandingPage(calculatorPage: CalculatorPage): Promise<void> {
    await expect(calculatorPage.calculatorHeading).toBeVisible();
    await expect(calculatorPage.startNowButton).toBeVisible();
}

export async function expectSummaryAnswers(
    calculatorPage: CalculatorPage,
    expectedAnswers: readonly ExpectedSummaryAnswer[]
): Promise<void> {
    for (const { question, answer } of expectedAnswers) {
        await expect(calculatorPage.getSummaryRow(question)).toHaveCount(1);
        await expect(calculatorPage.getSummaryAnswer(question)).toHaveText(answer);
    }
}

export async function expectRequiredAnswerError(calculatorPage: CalculatorPage): Promise<void> {
    await expect(calculatorPage.errorSummaryHeading).toBeVisible();
    await expect(calculatorPage.requiredAnswerMessage).toBeVisible();
    await expect(calculatorPage.requiredAnswerLink).toBeVisible();
}
