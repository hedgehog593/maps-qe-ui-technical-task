
import type { Page } from '@playwright/test';

export const calculatorPageUrl = 'https://www.gov.uk/calculate-your-holiday-entitlement';

export class CalculatorPage {

    constructor(private readonly page: Page) { }

    get calculateHolidayEntitlementPage() {
        return this.page.getByRole('heading', {
            name: 'Calculate holiday entitlement',
            exact: true
        });
    }

    get startNowLink() {
        return this.page.getByRole('button', {
            name: 'Start now',
            exact: true
        });
    }

    get irregularHoursQuestion() {
        return this.page.getByRole('heading', {
            name: 'Does the employee work irregular hours or for part of the year?',
            exact: true
        });
    }

    get employmentStartDateQuestion() {
        return this.page.getByRole('heading', {
            name: 'What was the employment start date?',
            exact: true
        });
    }

    get workingPatternQuestion() {
        return this.page.getByRole('heading', {
            name: 'Is the holiday entitlement based on:',
            exact: true
        })
    }

    get includeHolidayQuestion() {
        return this.page.getByRole('heading', {
            name: 'Do you want to work out holiday:',
            exact: true
        })
    }

    get numberOfDaysPerWeekWorkedQuestion() {
        return this.page.getByRole('heading', {
            name: 'Number of days worked per week?',
            exact: true
        })
    }

    get whenDoesLeaveYearStartQuestion() {
        return this.page.getByRole('heading', {
            name: 'When does the leave year start?',
            exact: true
        })
    }

    get errorProblem() {
        return this.page.getByRole('heading', {
            name: 'There is a problem',
            exact: true
        })
    }

    get errorPleaseAnswerThisQuestionText() {
        return this.page.locator('.govuk-error-message')
            .filter({ hasText: 'Please answer this question' });
    }

    get errorPleaseAnswerThisQuestionLink() {
        return this.page.getByRole('link', {
            name: 'Please answer this question',
            exact: true
        })
    }


    get hoursWokedQuestion() {
        return this.page.getByLabel('How many hours has the employee worked in the pay period?');
    }

    get statutoryHolidayEntitlementAnswer() {
        return this.page.getByText(
            /The statutory holiday entitlement is/i
        );
    }

    get statutoryHolidayPayPeriodAnswer() {
        return this.page.getByText(
            /The statutory entitlement for this pay period is/i
        );
    }

    get continueButton() {
        return this.page.getByRole('button', {
            name: 'Continue',
            exact: true
        });
    }

    get yesButton() {
        return this.page.getByRole('radio', {
            name: 'Yes',
            exact: true
        });
    }

    get noButton() {
        return this.page.getByRole('radio', {
            name: 'No',
            exact: true
        });
    }

    get daysPerWeekButton() {
        return this.page.getByRole('radio', {
            name: 'days worked per week',
            exact: true
        })
    }

    get hoursPerWeekButton() {
        return this.page.getByRole('radio', {
            name: 'hours worked per week',
            exact: true
        })
    }

    get annualisedHoursButton() {
        return this.page.getByRole('radio', {
            name: 'annualised hours',
            exact: true
        })
    }

    get compressedHoursButton() {
        return this.page.getByRole('radio', {
            name: 'compressed hours',
            exact: true
        })
    }

    get shiftsButton() {
        return this.page.getByRole('radio', {
            name: 'shifts',
            exact: true
        })
    }

    get fullYearHolidayButton() {
        return this.page.getByRole('radio', {
            name: 'for a full leave year',
            exact: true
        })
    }

    get startPartWayYearHolidayButton() {
        return this.page.getByRole('radio', {
            name: 'for someone starting part way through a leave year',
            exact: true
        })
    }

    get endPartWayYearHolidayButton() {
        return this.page.getByRole('radio', {
            name: 'for someone leaving part way through a leave year',
            exact: true
        })
    }

    get bothPartWayYearButtonHolidayButton() {
        return this.page.getByRole('radio', {
            name: 'for someone starting and leaving part way through a leave year',
            exact: true
        })
    }

    get startAgainLink() {
        return this.page.getByRole('link', {
            name: 'Start again',
            exact: true
        })
    }

    get numberOfDaysWorkedInput() {
        return this.page.getByLabel('Number of days worked per week?');
    }

    get dayInput() {
        return this.page.getByLabel('Day');
    }

    get monthInput() {
        return this.page.getByLabel('Month');
    }

    get yearInput() {
        return this.page.getByLabel('Year');
    }

    async submitYes(): Promise<void> {
        await this.yesButton.check();
        await this.continueButton.click();
    }

    async submitNo(): Promise<void> {
        await this.noButton.check();
        await this.continueButton.click();
    }

    async submitDaysPerWeek(): Promise<void> {
        await this.daysPerWeekButton.click();
        await this.continueButton.click();
    }

    async submitFullYearHoliday(): Promise<void> {
        await this.fullYearHolidayButton.click();
        await this.continueButton.click();
    }

    async enterDaysWorked(days: number): Promise<void> {
        await this.numberOfDaysWorkedInput.fill(days.toString());
        await this.continueButton.click();
    }

    async enterHoursWorked(hours: number): Promise<void> {
        await this.hoursWokedQuestion.fill(hours.toString());
        await this.continueButton.click();
    }

    async calculateFullYearEntitlement(days: number): Promise<void> {
        await this.startNowLink.click();
        await this.submitNo();
        await this.submitDaysPerWeek();
        await this.submitFullYearHoliday();
        await this.enterDaysWorked(days);
    }

    async calculatePartYearEntitlement(): Promise<void> {
        await this.startNowLink.click();
        await this.submitNo();
        await this.submitDaysPerWeek();
        await this.startPartWayYearHolidayButton.check();
        await this.continueButton.click();
    }

    async enterDate(day: string, month: string, year: string): Promise<void> {
        await this.dayInput.fill(day);
        await this.monthInput.fill(month);
        await this.yearInput.fill(year);

    }

    getAnswerRow(question: string) {
        return this.page.locator('.govuk-summary-list__row').filter
            ({ has: this.page.getByRole('term').filter({ hasText: question }) });
    }

    getChangeLink(question: string) {
        return this.getAnswerRow(question).getByRole('link', { name: /^Change/ });
    }
}
