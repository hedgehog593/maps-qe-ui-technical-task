import { expectCalculatorLandingPage, expectRequiredAnswerError, expectSummaryAnswers } from '../helpers/assertions';
import { calculatorQuestions } from '../pages/calculator.page';
import {
    fullYearFiveDayScenario,
    fullYearThreeDayScenario,
    irregularHoursScenario,
    partYearScenario
} from '../test-data/holiday-scenarios';
import { expect, test } from './fixtures';

test('TC01 - Opens the calculator and displays the first question', { tag: ['@smoke', '@positive'] }, async ({ calculatorPage }) => {
    await expectCalculatorLandingPage(calculatorPage);
    await calculatorPage.startNowButton.click();

    await expect(calculatorPage.irregularHoursHeading).toBeVisible();
    await expect(calculatorPage.yesRadio).toBeVisible();
    await expect(calculatorPage.noRadio).toBeVisible();
    await expect(calculatorPage.continueButton).toBeVisible();
});

const fullYearCases = [
    { testCaseId: 'TC02', scenario: fullYearFiveDayScenario, tag: ['@smoke', '@positive'], verifyDaysPerWeekChangeLink: true },
    { testCaseId: 'TC03', scenario: fullYearThreeDayScenario, tag: '@positive', verifyDaysPerWeekChangeLink: false }
];

for (const { testCaseId, scenario, tag, verifyDaysPerWeekChangeLink } of fullYearCases) {
    const title = `${testCaseId} - Calculates full-year entitlement for a ${scenario.daysPerWeek}-day working week`;
    test(title, { tag }, async ({ calculatorPage }) => {
        await calculatorPage.calculateFullYearEntitlement(scenario.daysPerWeek);

        await expect(calculatorPage.holidayEntitlementResult).toContainText(scenario.expectedEntitlement);
        await expectSummaryAnswers(calculatorPage, scenario.expectedAnswers);

        if (verifyDaysPerWeekChangeLink) {
            await expect(calculatorPage.getChangeLink(calculatorQuestions.daysPerWeek)).toBeVisible();
        }
    });
}

test('TC04 - Calculates entitlement for someone starting partway through a leave year', { tag: '@positive' }, async ({ calculatorPage }) => {
    await calculatorPage.startPartYearCalculation();

    await expect(calculatorPage.employmentStartDateHeading).toBeVisible();
    await calculatorPage.submitDate(partYearScenario.employmentStartDate);

    await expect(calculatorPage.leaveYearStartHeading).toBeVisible();
    await calculatorPage.submitDate(partYearScenario.leaveYearStartDate);

    await expect(calculatorPage.daysPerWeekHeading).toBeVisible();
    await calculatorPage.submitDaysPerWeek(partYearScenario.daysPerWeek);

    await expect(calculatorPage.holidayEntitlementResult).toContainText(partYearScenario.expectedEntitlement);
    await expectSummaryAnswers(calculatorPage, partYearScenario.expectedAnswers);
});

test('TC05 - Displays validation errors for missing required answers', { tag: '@negative' }, async ({ calculatorPage }) => {
    await expectCalculatorLandingPage(calculatorPage);
    await calculatorPage.startNowButton.click();

    await calculatorPage.continueButton.click();
    await expectRequiredAnswerError(calculatorPage);

    await calculatorPage.answerIrregularHoursQuestion(true);
    await expect(calculatorPage.leaveYearStartHeading).toBeVisible();

    await calculatorPage.continueButton.click();
    await expectRequiredAnswerError(calculatorPage);
    await expect(calculatorPage.leaveYearStartHeading).toBeVisible();
});

test('TC06 - Restarts the calculator and changes an earlier answer', { tag: '@positive' }, async ({ calculatorPage }) => {
    await test.step('Restart after completing a calculation', async () => {
        await calculatorPage.calculateFullYearEntitlement(fullYearFiveDayScenario.daysPerWeek);
        await expect(calculatorPage.holidayEntitlementResult).toContainText(fullYearFiveDayScenario.expectedEntitlement);

        await calculatorPage.startAgainLink.click();
        await expectCalculatorLandingPage(calculatorPage);
    });

    await test.step('Change the irregular-hours answer from Yes to No', async () => {
        await calculatorPage.startNowButton.click();
        await expect(calculatorPage.irregularHoursHeading).toBeVisible();
        await calculatorPage.answerIrregularHoursQuestion(true);

        await expect(calculatorPage.leaveYearStartHeading).toBeVisible();
        const changeIrregularHoursLink = calculatorPage.getChangeLink(calculatorQuestions.irregularHours);
        await expect(changeIrregularHoursLink).toBeVisible();
        await changeIrregularHoursLink.click();

        await expect(calculatorPage.irregularHoursHeading).toBeVisible();
        await expect(calculatorPage.yesRadio).toBeChecked();
        await calculatorPage.answerIrregularHoursQuestion(false);

        await expect(calculatorPage.calculationBasisHeading).toBeVisible();
    });
});

test('TC07 - Calculates pay-period entitlement for an irregular-hours worker', { tag: '@positive' }, async ({ calculatorPage }) => {
    await expectCalculatorLandingPage(calculatorPage);
    await calculatorPage.startNowButton.click();

    await expect(calculatorPage.irregularHoursHeading).toBeVisible();
    await calculatorPage.answerIrregularHoursQuestion(true);

    await expect(calculatorPage.leaveYearStartHeading).toBeVisible();
    await calculatorPage.submitDate(irregularHoursScenario.leaveYearStartDate);

    await expect(calculatorPage.hoursWorkedInput).toBeVisible();
    await calculatorPage.submitHoursWorked(irregularHoursScenario.hoursWorked);

    await expect(calculatorPage.payPeriodEntitlementResult).toHaveText(irregularHoursScenario.expectedEntitlementMessage);
    await expectSummaryAnswers(calculatorPage, irregularHoursScenario.expectedAnswers);
});
