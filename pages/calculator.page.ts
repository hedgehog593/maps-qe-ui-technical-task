import type { Locator, Page } from '@playwright/test';
import { BasePage } from './base.page';

export const calculatorQuestions = {
    irregularHours: 'Does the employee work irregular hours or for part of the year?',
    calculationBasis: 'Is the holiday entitlement based on:',
    leavePeriod: 'Do you want to work out holiday:',
    employmentStartDate: 'What was the employment start date?',
    leaveYearStart: 'When does the leave year start?',
    daysPerWeek: 'Number of days worked per week?',
    hoursWorked: 'How many hours has the employee worked in the pay period?'
} as const;

export const calculatorOptions = {
    daysPerWeek: 'days worked per week',
    fullYear: 'for a full leave year',
    startsPartwayThroughYear: 'for someone starting part way through a leave year'
} as const;

type CalculatorDate = {
    day: string;
    month: string;
    year: string;
};

const requiredAnswerText = 'Please answer this question';

export class CalculatorPage extends BasePage {
    readonly calculatorHeading = this.heading('Calculate holiday entitlement');
    readonly irregularHoursHeading = this.heading(calculatorQuestions.irregularHours);
    readonly employmentStartDateHeading = this.heading(calculatorQuestions.employmentStartDate);
    readonly calculationBasisHeading = this.heading(calculatorQuestions.calculationBasis);
    readonly daysPerWeekHeading = this.heading(calculatorQuestions.daysPerWeek);
    readonly leaveYearStartHeading = this.heading(calculatorQuestions.leaveYearStart);
    readonly errorSummaryHeading = this.heading('There is a problem');
    readonly startNowButton = this.button('Start now');
    readonly continueButton = this.button('Continue');
    readonly yesRadio = this.radio('Yes');
    readonly noRadio = this.radio('No');
    readonly startAgainLink = this.page.getByRole('link', { name: 'Start again', exact: true });
    readonly requiredAnswerLink = this.page.getByRole('link', { name: requiredAnswerText, exact: true });
    readonly requiredAnswerMessage = this.page.locator('.govuk-error-message').filter({ hasText: requiredAnswerText });
    readonly hoursWorkedInput = this.page.getByLabel(calculatorQuestions.hoursWorked);
    readonly holidayEntitlementResult = this.page.getByText(/The statutory holiday entitlement is/i);
    readonly payPeriodEntitlementResult = this.page.getByText(/The statutory entitlement for this pay period is/i);

    private readonly daysPerWeekInput = this.page.getByLabel(calculatorQuestions.daysPerWeek);
    private readonly daysPerWeekRadio = this.radio(calculatorOptions.daysPerWeek);
    private readonly fullYearRadio = this.radio(calculatorOptions.fullYear);
    private readonly partYearRadio = this.radio(calculatorOptions.startsPartwayThroughYear);
    private readonly dayInput = this.page.getByLabel('Day');
    private readonly monthInput = this.page.getByLabel('Month');
    private readonly yearInput = this.page.getByLabel('Year');
    private readonly summaryRows = this.page.locator('.govuk-summary-list__row');

    constructor(page: Page, private readonly calculatorPath: string) {
        super(page);
    }

    open(): Promise<void> {
        return this.navigate(this.calculatorPath);
    }

    async answerIrregularHoursQuestion(worksIrregularHoursOrPartYear: boolean): Promise<void> {
        await this.selectAndContinue(worksIrregularHoursOrPartYear ? this.yesRadio : this.noRadio);
    }

    async submitDaysPerWeek(daysPerWeek: number): Promise<void> {
        await this.daysPerWeekInput.fill(daysPerWeek.toString());
        await this.continueButton.click();
    }

    async submitHoursWorked(hoursWorked: number): Promise<void> {
        await this.hoursWorkedInput.fill(hoursWorked.toString());
        await this.continueButton.click();
    }

    async calculateFullYearEntitlement(daysPerWeek: number): Promise<void> {
        await this.startDaysPerWeekCalculation();
        await this.selectAndContinue(this.fullYearRadio);
        await this.submitDaysPerWeek(daysPerWeek);
    }

    async startPartYearCalculation(): Promise<void> {
        await this.startDaysPerWeekCalculation();
        await this.selectAndContinue(this.partYearRadio);
    }

    async submitDate({ day, month, year }: CalculatorDate): Promise<void> {
        await this.dayInput.fill(day);
        await this.monthInput.fill(month);
        await this.yearInput.fill(year);
        await this.continueButton.click();
    }

    getSummaryRow(question: string) {
        return this.summaryRows.filter({
            has: this.page.getByRole('term').filter({ hasText: question })
        });
    }

    getSummaryAnswer(question: string) {
        return this.getSummaryRow(question).locator('.govuk-summary-list__value');
    }

    getChangeLink(question: string) {
        return this.getSummaryRow(question).getByRole('link', { name: /^Change/ });
    }

    private async startDaysPerWeekCalculation(): Promise<void> {
        await this.startNowButton.click();
        await this.answerIrregularHoursQuestion(false);
        await this.selectAndContinue(this.daysPerWeekRadio);
    }

    private async selectAndContinue(option: Locator): Promise<void> {
        await option.check();
        await this.continueButton.click();
    }
}
