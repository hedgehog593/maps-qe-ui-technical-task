
import { test, expect } from '@playwright/test';
import { calculatorPageUrl, CalculatorPage } from '../pages/calculator.page';
import { fullYearFiveDays, fullYearThreeDays } from '../test-data/holiday-scenarios';

test.beforeEach(async ({ page }) => {
    const response = await page.goto(calculatorPageUrl);
    expect(response?.ok()).toBeTruthy();
});

test('01 - Positive Flow - Loads the Calculator Page and First Question', async ({ page }) => {
    const calculatorPage = new CalculatorPage(page);

    //Loads the "Calculate holiday entitlement" page
    await expect(calculatorPage.calculateHolidayEntitlementPage).toBeVisible();
    await expect(calculatorPage.startNowLink).toBeVisible();
    await calculatorPage.startNowLink.click();

    //Verify the correct question and available options
    await expect(calculatorPage.irregularHoursQuestion).toBeVisible();
    await expect(calculatorPage.yesButton).toBeVisible();
    await expect(calculatorPage.noButton).toBeVisible();
    await expect(calculatorPage.continueButton).toBeVisible();
});

test('02 - Positive Flow - Full year entitlement, 5 day working week', async ({ page }) => {
    const calculatorPage = new CalculatorPage(page);

    // Complete full-year calculation for 5 working days
    await calculatorPage.calculateFullYearEntitlement(5);

    // Verify calculated entitlement
    await expect(
        calculatorPage.statutoryHolidayEntitlementAnswer
    ).toContainText('28 days');

    // Verify each question and its corresponding answer
    for (const expected of fullYearFiveDays) {
        const row = calculatorPage.getAnswerRow(expected.question);

        await expect(row).toHaveCount(1);
        await expect(
            row.locator('.govuk-summary-list__value')
        ).toHaveText(expected.answer);
    }

    // Verify the answer can be edited
    await expect(
        calculatorPage.getChangeLink('Number of days worked per week?')
    ).toBeVisible();
});

test('03 - Positive Flow - Full year entitlement, 3 day working week', async ({ page }) => {
    const calculatorPage = new CalculatorPage(page);

    // Complete full-year calculation for 3 working days
    await calculatorPage.calculateFullYearEntitlement(3);

    // Verify calculated entitlement
    await expect(
        calculatorPage.statutoryHolidayEntitlementAnswer
    ).toContainText('16.8 days');

    // Verify each question and its corresponding answer
    for (const expected of fullYearThreeDays) {
        const row = calculatorPage.getAnswerRow(expected.question);

        await expect(row).toHaveCount(1);
        await expect(
            row.locator('.govuk-summary-list__value')
        ).toHaveText(expected.answer);
    }
});
