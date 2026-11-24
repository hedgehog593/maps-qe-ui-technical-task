import type { Locator, Page } from '@playwright/test';

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

export class CalculatorPage {
    constructor(private readonly page: Page) {}

    open() {
        return this.page.goto('/calculate-your-holiday-entitlement');
    }

    get calculatorHeading() {
        return this.page.getByRole('heading', { name: 'Calculate holiday entitlement', exact: true });
    }

    get startNowButton() {
        return this.page.getByRole('button', { name: 'Start now', exact: true });
    }

    get irregularHoursHeading() {
        return this.page.getByRole('heading', { name: calculatorQuestions.irregularHours, exact: true });
    }

    get employmentStartDateHeading() {
        return this.page.getByRole('heading', { name: calculatorQuestions.employmentStartDate, exact: true });
    }

    get calculationBasisHeading() {
        return this.page.getByRole('heading', { name: calculatorQuestions.calculationBasis, exact: true });
    }

    get daysPerWeekHeading() {
        return this.page.getByRole('heading', { name: calculatorQuestions.daysPerWeek, exact: true });
    }

    get leaveYearStartHeading() {
        return this.page.getByRole('heading', { name: calculatorQuestions.leaveYearStart, exact: true });
    }

    get errorSummaryHeading() {
        return this.page.getByRole('heading', { name: 'There is a problem', exact: true });
    }

    get requiredAnswerMessage() {
        return this.page.locator('.govuk-error-message').filter({ hasText: requiredAnswerText });
    }

    get requiredAnswerLink() {
        return this.page.getByRole('link', { name: requiredAnswerText, exact: true });
    }

    get hoursWorkedInput() {
        return this.page.getByLabel(calculatorQuestions.hoursWorked);
    }

    get holidayEntitlementResult() {
        return this.page.getByText(/The statutory holiday entitlement is/i);
    }

    get payPeriodEntitlementResult() {
        return this.page.getByText(/The statutory entitlement for this pay period is/i);
    }

    get continueButton() {
        return this.page.getByRole('button', { name: 'Continue', exact: true });
    }

    get yesRadio() {
        return this.page.getByRole('radio', { name: 'Yes', exact: true });
    }

    get noRadio() {
        return this.page.getByRole('radio', { name: 'No', exact: true });
    }

    get startAgainLink() {
        return this.page.getByRole('link', { name: 'Start again', exact: true });
    }

    async answerIrregularHoursQuestion(worksIrregularHoursOrPartYear: boolean): Promise<void> {
        await this.selectAndContinue(worksIrregularHoursOrPartYear ? this.yesRadio : this.noRadio);
    }

    async submitDaysPerWeek(daysPerWeek: number): Promise<void> {
        await this.page.getByLabel(calculatorQuestions.daysPerWeek).fill(daysPerWeek.toString());
        await this.continueButton.click();
    }

    async submitHoursWorked(hoursWorked: number): Promise<void> {
        await this.hoursWorkedInput.fill(hoursWorked.toString());
        await this.continueButton.click();
    }

    async calculateFullYearEntitlement(daysPerWeek: number): Promise<void> {
        await this.startDaysPerWeekCalculation();
        const fullYearRadio = this.page.getByRole('radio', { name: calculatorOptions.fullYear, exact: true });
        await this.selectAndContinue(fullYearRadio);
        await this.submitDaysPerWeek(daysPerWeek);
    }

    async startPartYearCalculation(): Promise<void> {
        await this.startDaysPerWeekCalculation();
        const partYearRadio = this.page.getByRole('radio', {
            name: calculatorOptions.startsPartwayThroughYear,
            exact: true
        });
        await this.selectAndContinue(partYearRadio);
    }

    async submitDate({ day, month, year }: CalculatorDate): Promise<void> {
        await this.page.getByLabel('Day').fill(day);
        await this.page.getByLabel('Month').fill(month);
        await this.page.getByLabel('Year').fill(year);
        await this.continueButton.click();
    }

    getSummaryRow(question: string) {
        return this.page.locator('.govuk-summary-list__row').filter({
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
        const daysPerWeekRadio = this.page.getByRole('radio', { name: calculatorOptions.daysPerWeek, exact: true });
        await this.selectAndContinue(daysPerWeekRadio);
    }

    private async selectAndContinue(option: Locator): Promise<void> {
        await option.check();
        await this.continueButton.click();
    }
}
