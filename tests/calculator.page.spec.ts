
import { test, expect } from '@playwright/test';
import { calculatorPageUrl, CalculatorPage } from '../pages/calculator.page';
import { fullYearFiveDays, fullYearThreeDays, partwayYearJuly, irregularHours } from '../test-data/holiday-scenarios';

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
    await expect(calculatorPage.statutoryHolidayEntitlementAnswer).toContainText('28 days');

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
    await expect(calculatorPage.statutoryHolidayEntitlementAnswer).toContainText('16.8 days');

    // Verify each question and its corresponding answer
    for (const expected of fullYearThreeDays) {
        const row = calculatorPage.getAnswerRow(expected.question);

        await expect(row).toHaveCount(1);
        await expect(
            row.locator('.govuk-summary-list__value')
        ).toHaveText(expected.answer);
    }
});


test('04 - Positive Flow - Starting partway through a leave year', async ({ page }) => {
    const calculatorPage = new CalculatorPage(page);

    // Start the regular-hours, part-year calculation
    await calculatorPage.calculatePartYearEntitlement();

    // Verify the employment start date question
    await expect(calculatorPage.employmentStartDateQuestion).toBeVisible();

    // Enter the employee's start date
    await calculatorPage.enterDate('01', '07', '2026');
    await calculatorPage.continueButton.click();

    // Verify the leave-year start date question
    await expect(calculatorPage.whenDoesLeaveYearStartQuestion).toBeVisible();
    await calculatorPage.enterDate('01', '01', '2026');
    await calculatorPage.continueButton.click();

    //Verify the number of days you worked per week
    await expect(calculatorPage.numberOfDaysPerWeekWorkedQuestion).toBeVisible();
    await calculatorPage.enterDaysWorked(5);

    //validation
    await expect(calculatorPage.statutoryHolidayEntitlementAnswer).toContainText('14 days');
    for (const expected of partwayYearJuly) {
        const row = calculatorPage.getAnswerRow(expected.question);

        await expect(row).toHaveCount(1);
        await expect(
            row.locator('.govuk-summary-list__value')
        ).toHaveText(expected.answer);
    }

});


test('05 - Negative Flow - Required answer validation', async ({ page }) => {
    const calculatorPage = new CalculatorPage(page);

    await expect(calculatorPage.calculateHolidayEntitlementPage).toBeVisible();
    await expect(calculatorPage.startNowLink).toBeVisible();
    await calculatorPage.startNowLink.click();

    // First question - submit without selecting an answer
    await calculatorPage.continueButton.click();

    // Verify validation errors
    await expect(calculatorPage.errorProblem).toBeVisible();
    await expect(calculatorPage.errorPleaseAnswerThisQuestionText).toBeVisible();
    await expect(calculatorPage.errorPleaseAnswerThisQuestionLink).toBeVisible();

    // Correctly answer the question and continue
    await calculatorPage.submitYes();

    // Verify the next question
    await expect(calculatorPage.whenDoesLeaveYearStartQuestion).toBeVisible();

    // Submit without entering a date
    await calculatorPage.continueButton.click();

    // Verify validation errors on the second question
    await expect(calculatorPage.errorProblem).toBeVisible();
    await expect(calculatorPage.errorPleaseAnswerThisQuestionText).toBeVisible();
    await expect(calculatorPage.errorPleaseAnswerThisQuestionLink).toBeVisible();
    await expect(calculatorPage.whenDoesLeaveYearStartQuestion).toBeVisible();
});

test('06 - Positive Flow - Start again link & user changes an answer', async ({ page }) => {
    const calculatorPage = new CalculatorPage(page);

    const changeIrregularHours = calculatorPage.getChangeLink(
        'Does the employee work irregular hours or for part of the year?'
    );

    //Start again user flow
    await calculatorPage.calculateFullYearEntitlement(5);

    //validate the page
    await expect(calculatorPage.statutoryHolidayEntitlementAnswer).toContainText('28 days');

    //Click start again, and validate home page
    await (calculatorPage.startAgainLink).click();

    //Change answer user flow
    await expect(calculatorPage.calculateHolidayEntitlementPage).toBeVisible();
    await expect(calculatorPage.startNowLink).toBeVisible();

    await calculatorPage.startNowLink.click();

    await expect(calculatorPage.irregularHoursQuestion).toBeVisible();

    await calculatorPage.submitYes();

    await expect(calculatorPage.whenDoesLeaveYearStartQuestion).toBeVisible();
    await expect(changeIrregularHours).toBeVisible();

    await changeIrregularHours.click();

    await expect(calculatorPage.irregularHoursQuestion).toBeVisible();
    await expect(calculatorPage.yesButton).toBeChecked();

    await calculatorPage.submitNo();

    await expect(calculatorPage.workingPatternQuestion).toBeVisible();
});


test('07 - Positive Flow - Irregular hours holiday entitlement', async ({ page }) => {
    const calculatorPage = new CalculatorPage(page);

    await expect(calculatorPage.calculateHolidayEntitlementPage).toBeVisible();
    await calculatorPage.startNowLink.click();

    // Select irregular hours worker
    await expect(calculatorPage.irregularHoursQuestion).toBeVisible();
    await calculatorPage.submitYes();

    // Enter the leave year start date
    await expect(calculatorPage.whenDoesLeaveYearStartQuestion).toBeVisible();

    await calculatorPage.enterDate('1', '4', '2026');
    await calculatorPage.continueButton.click();

    await expect(calculatorPage.hoursWokedQuestion).toBeVisible();

    await calculatorPage.enterHoursWorked(70);

    await expect(calculatorPage.statutoryHolidayPayPeriodAnswer)
        .toHaveText('The statutory entitlement for this pay period is 8 hours.');

    for (const expected of irregularHours) {
        const row = calculatorPage.getAnswerRow(expected.question);

        await expect(row).toHaveCount(1);
        await expect(
            row.locator('.govuk-summary-list__value')
        ).toHaveText(expected.answer);
    }

});
