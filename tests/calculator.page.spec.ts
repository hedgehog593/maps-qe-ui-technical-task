import { expectCalculatorLandingPage, expectRequiredAnswerError, expectSummaryAnswers } from '../helpers/assertions';
import { calculatorOptions, calculatorQuestions, type FullYearWorkPattern } from '../pages/calculator.page';
import {
    annualisedHoursStartAndLeaveScenario,
    compressedHoursStartAndLeaveScenario,
    fullYearFiveDayScenario,
    fullYearHoursPerWeekScenario,
    fullYearShiftsScenario,
    fullYearThreeDayScenario,
    irregularHoursScenario,
    partYearScenario,
    type ExpectedSummaryAnswer
} from '../test-data/holiday-scenarios';
import { expect, test } from './fixtures';

type FullYearCase = {
    description: string;
    scenario: FullYearWorkPattern & {
        expectedEntitlement: string;
        expectedAnswers: readonly ExpectedSummaryAnswer[];
    };
    tag?: string[];
    verifyDaysPerWeekChangeLink?: boolean;
};

const fullYearCases = {
    TC02: {
        description: 'a 5 day working week',
        scenario: fullYearFiveDayScenario,
        tag: ['@smoke', '@positive'],
        verifyDaysPerWeekChangeLink: true
    },
    TC03: {
        description: 'a 3 day working week',
        scenario: fullYearThreeDayScenario
    },
    TC08: {
        description: 'hours worked per week',
        scenario: fullYearHoursPerWeekScenario
    },
    TC09: {
        description: 'shift working pattern',
        scenario: fullYearShiftsScenario
    }
} satisfies Record<string, FullYearCase>;

function registerFullYearCase(testCaseId: keyof typeof fullYearCases): void {
    const { description, scenario, tag = ['@positive'], verifyDaysPerWeekChangeLink }: FullYearCase = fullYearCases[testCaseId];
    const title = `${testCaseId} - Calculates a full year entitlement for ${description}`;
    test(title, { tag }, async ({ calculatorPage }) => {
        await calculatorPage.calculateFullYearEntitlement(scenario);

        await expect(calculatorPage.holidayEntitlementResult).toContainText(scenario.expectedEntitlement);
        await expectSummaryAnswers(calculatorPage, scenario.expectedAnswers);

        if (verifyDaysPerWeekChangeLink) {
            await expect(calculatorPage.getChangeLink(calculatorQuestions.daysPerWeek)).toBeVisible();
        }
    });
}

test('TC01 - Opens the calculator and displays the first question', { tag: ['@smoke', '@positive'] }, async ({ calculatorPage }) => {
    await expectCalculatorLandingPage(calculatorPage);
    await calculatorPage.startNowButton.click();

    await expect(calculatorPage.irregularHoursHeading).toBeVisible();
    await expect(calculatorPage.yesRadio).toBeVisible();
    await expect(calculatorPage.noRadio).toBeVisible();
    await expect(calculatorPage.continueButton).toBeVisible();
});

registerFullYearCase('TC02');
registerFullYearCase('TC03');

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
        await calculatorPage.calculateFullYearEntitlement(fullYearFiveDayScenario);
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

registerFullYearCase('TC08');
registerFullYearCase('TC09');

const startAndLeaveCases = [
    { testCaseId: 'TC10', scenario: annualisedHoursStartAndLeaveScenario },
    { testCaseId: 'TC11', scenario: compressedHoursStartAndLeaveScenario }
];

for (const { testCaseId, scenario } of startAndLeaveCases) {
    const basis = calculatorOptions[scenario.basis];
    const title = `${testCaseId} - Calculates ${basis} entitlement for someone starting and leaving partway through a leave year`;
    test(title, { tag: '@positive' }, async ({ calculatorPage }) => {
        await calculatorPage.calculateStartAndLeaveEntitlement(scenario);

        await expect(calculatorPage.holidayEntitlementResult).toHaveText(scenario.expectedEntitlement);
        await expectSummaryAnswers(calculatorPage, scenario.expectedAnswers);
    });
}
