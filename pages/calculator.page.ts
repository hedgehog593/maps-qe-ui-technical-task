import type { Locator, Page } from '@playwright/test';
import { BasePage } from './base.page';

export const calculatorQuestions = {
    irregularHours: 'Does the employee work irregular hours or for part of the year?',
    calculationBasis: 'Is the holiday entitlement based on:',
    leavePeriod: 'Do you want to work out holiday:',
    shiftLeavePeriod: 'Do you want to calculate the holiday:',
    employmentStartDate: 'What was the employment start date?',
    employmentEndDate: 'What was the employment end date?',
    leaveYearStart: 'When does the leave year start?',
    daysPerWeek: 'Number of days worked per week?',
    hoursPerWeek: 'Number of hours worked per week?',
    hoursPerShift: 'How many hours in each shift?',
    shiftsPerPattern: 'How many shifts will be worked per shift pattern?',
    daysPerPattern: 'How many days in the shift pattern?',
    hoursWorked: 'How many hours has the employee worked in the pay period?'
} as const;

export const calculatorOptions = {
    daysPerWeek: 'days worked per week',
    hoursPerWeek: 'hours worked per week',
    annualisedHours: 'annualised hours',
    compressedHours: 'compressed hours',
    shifts: 'shifts',
    fullYear: 'for a full leave year',
    startsPartwayThroughYear: 'for someone starting part way through a leave year',
    startsAndLeavesPartwayThroughYear: 'for someone starting and leaving part way through a leave year'
} as const;

export type FullYearWorkPattern =
    | { basis: 'daysPerWeek'; daysPerWeek: number }
    | { basis: 'hoursPerWeek'; hoursPerWeek: number; daysPerWeek: number }
    | { basis: 'shifts'; hoursPerShift: number; shiftsPerPattern: number; daysPerPattern: number };

type CalculatorDate = {
    day: string;
    month: string;
    year: string;
};

type StartAndLeaveWorkPattern = {
    employmentStartDate: CalculatorDate;
    employmentEndDate: CalculatorDate;
} & (
    | { basis: 'annualisedHours' }
    | { basis: 'compressedHours'; hoursPerWeek: number; daysPerWeek: number }
);

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
    readonly holidayEntitlementResult = this.page.getByText(/^The statutory (?:holiday )?entitlement is/i);
    readonly payPeriodEntitlementResult = this.page.getByText(/The statutory entitlement for this pay period is/i);

    private readonly daysPerWeekInput = this.page.getByLabel(calculatorQuestions.daysPerWeek);
    private readonly hoursPerWeekInput = this.page.getByLabel(calculatorQuestions.hoursPerWeek);
    private readonly hoursPerShiftInput = this.page.getByLabel(calculatorQuestions.hoursPerShift);
    private readonly shiftsPerPatternInput = this.page.getByLabel(calculatorQuestions.shiftsPerPattern);
    private readonly daysPerPatternInput = this.page.getByLabel(calculatorQuestions.daysPerPattern);
    private readonly calculationBasisRadios = {
        daysPerWeek: this.radio(calculatorOptions.daysPerWeek),
        hoursPerWeek: this.radio(calculatorOptions.hoursPerWeek),
        annualisedHours: this.radio(calculatorOptions.annualisedHours),
        compressedHours: this.radio(calculatorOptions.compressedHours),
        shifts: this.radio(calculatorOptions.shifts)
    };
    private readonly fullYearRadio = this.radio(calculatorOptions.fullYear);
    private readonly startPartwayRadio = this.radio(calculatorOptions.startsPartwayThroughYear);
    private readonly startAndLeaveRadio = this.radio(calculatorOptions.startsAndLeavesPartwayThroughYear);
    private readonly employmentEndDateHeading = this.heading(calculatorQuestions.employmentEndDate);
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

    submitDaysPerWeek(daysPerWeek: number): Promise<void> {
        return this.submitNumber(this.daysPerWeekInput, daysPerWeek);
    }

    submitHoursWorked(hoursWorked: number): Promise<void> {
        return this.submitNumber(this.hoursWorkedInput, hoursWorked);
    }

    async calculateFullYearEntitlement(workPattern: FullYearWorkPattern): Promise<void> {
        await this.startRegularCalculation(workPattern.basis, this.fullYearRadio);

        if (workPattern.basis === 'shifts') {
            await this.submitNumber(this.hoursPerShiftInput, workPattern.hoursPerShift);
            await this.submitNumber(this.shiftsPerPatternInput, workPattern.shiftsPerPattern);
            await this.submitNumber(this.daysPerPatternInput, workPattern.daysPerPattern);
            return;
        }

        if (workPattern.basis === 'hoursPerWeek') {
            await this.submitHoursAndDaysPerWeek(workPattern.hoursPerWeek, workPattern.daysPerWeek);
            return;
        }
        await this.submitDaysPerWeek(workPattern.daysPerWeek);
    }

    startPartYearCalculation(): Promise<void> {
        return this.startRegularCalculation('daysPerWeek', this.startPartwayRadio);
    }

    async calculateStartAndLeaveEntitlement(workPattern: StartAndLeaveWorkPattern): Promise<void> {
        await this.startRegularCalculation(workPattern.basis, this.startAndLeaveRadio);

        await this.employmentStartDateHeading.waitFor({ state: 'visible' });
        await this.submitDate(workPattern.employmentStartDate);
        await this.employmentEndDateHeading.waitFor({ state: 'visible' });
        await this.submitDate(workPattern.employmentEndDate);

        if (workPattern.basis === 'compressedHours') {
            await this.submitHoursAndDaysPerWeek(workPattern.hoursPerWeek, workPattern.daysPerWeek);
        }
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

    private async startRegularCalculation(
        basis: FullYearWorkPattern['basis'] | StartAndLeaveWorkPattern['basis'],
        leavePeriodRadio: Locator
    ): Promise<void> {
        await this.startNowButton.click();
        await this.answerIrregularHoursQuestion(false);
        await this.selectAndContinue(this.calculationBasisRadios[basis]);
        await this.selectAndContinue(leavePeriodRadio);
    }

    private async submitHoursAndDaysPerWeek(hoursPerWeek: number, daysPerWeek: number): Promise<void> {
        await this.submitNumber(this.hoursPerWeekInput, hoursPerWeek);
        await this.submitDaysPerWeek(daysPerWeek);
    }

    private async submitNumber(input: Locator, value: number): Promise<void> {
        await input.fill(value.toString());
        await this.continueButton.click();
    }

    private async selectAndContinue(option: Locator): Promise<void> {
        await option.check();
        await this.continueButton.click();
    }
}
