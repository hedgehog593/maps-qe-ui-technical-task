import { calculatorOptions, calculatorQuestions } from '../pages/calculator.page';

export type ExpectedSummaryAnswer = {
    question: string;
    answer: string;
};

const regularHoursAnswer = { question: calculatorQuestions.irregularHours, answer: 'No' } as const;
const fullYearLeavePeriodAnswer = { question: calculatorQuestions.leavePeriod, answer: calculatorOptions.fullYear } as const;

const regularDaysPerWeekAnswers = [
    regularHoursAnswer,
    { question: calculatorQuestions.calculationBasis, answer: calculatorOptions.daysPerWeek }
] as const;

const fullYearAnswers = [
    ...regularDaysPerWeekAnswers,
    fullYearLeavePeriodAnswer
] as const;

export const fullYearFiveDayScenario = {
    basis: 'daysPerWeek',
    daysPerWeek: 5,
    expectedEntitlement: '28 days',
    expectedAnswers: [
        ...fullYearAnswers,
        { question: calculatorQuestions.daysPerWeek, answer: '5.0' }
    ]
} as const;

export const fullYearThreeDayScenario = {
    basis: 'daysPerWeek',
    daysPerWeek: 3,
    expectedEntitlement: '16.8 days',
    expectedAnswers: [
        ...fullYearAnswers,
        { question: calculatorQuestions.daysPerWeek, answer: '3.0' }
    ]
} as const;

export const fullYearHoursPerWeekScenario = {
    basis: 'hoursPerWeek',
    hoursPerWeek: 40,
    daysPerWeek: 5,
    expectedEntitlement: 'The statutory entitlement is 224 hours holiday.',
    expectedAnswers: [
        regularHoursAnswer,
        { question: calculatorQuestions.calculationBasis, answer: calculatorOptions.hoursPerWeek },
        fullYearLeavePeriodAnswer,
        { question: calculatorQuestions.hoursPerWeek, answer: '40.0' },
        { question: calculatorQuestions.daysPerWeek, answer: '5.0' }
    ]
} as const;

export const fullYearShiftsScenario = {
    basis: 'shifts',
    hoursPerShift: 12,
    shiftsPerPattern: 4,
    daysPerPattern: 8,
    expectedEntitlement: 'The statutory holiday entitlement is 19.6 shifts for the year. Each shift being 12.0 hours.',
    expectedAnswers: [
        regularHoursAnswer,
        { question: calculatorQuestions.calculationBasis, answer: calculatorOptions.shifts },
        { question: calculatorQuestions.shiftLeavePeriod, answer: calculatorOptions.fullYear },
        { question: calculatorQuestions.hoursPerShift, answer: '12.0' },
        { question: calculatorQuestions.shiftsPerPattern, answer: '4' },
        { question: calculatorQuestions.daysPerPattern, answer: '8.0' }
    ]
} as const;

export const partYearScenario = {
    employmentStartDate: { day: '01', month: '07', year: '2026' },
    leaveYearStartDate: { day: '01', month: '01', year: '2026' },
    daysPerWeek: 5,
    expectedEntitlement: '14 days',
    expectedAnswers: [
        ...regularDaysPerWeekAnswers,
        { question: calculatorQuestions.leavePeriod, answer: calculatorOptions.startsPartwayThroughYear },
        { question: calculatorQuestions.employmentStartDate, answer: '1 July 2026' },
        { question: calculatorQuestions.leaveYearStart, answer: '1 January 2026' },
        { question: calculatorQuestions.daysPerWeek, answer: '5.0' }
    ]
} as const;

const startAndLeaveDates = {
    employmentStartDate: { day: '1', month: '4', year: '2026' },
    employmentEndDate: { day: '30', month: '9', year: '2026' }
} as const;

const startAndLeaveAnswers = [
    { question: calculatorQuestions.leavePeriod, answer: calculatorOptions.startsAndLeavesPartwayThroughYear },
    { question: calculatorQuestions.employmentStartDate, answer: '1 April 2026' },
    { question: calculatorQuestions.employmentEndDate, answer: '30 September 2026' }
] as const;

export const annualisedHoursStartAndLeaveScenario = {
    basis: 'annualisedHours',
    ...startAndLeaveDates,
    expectedEntitlement: 'The statutory holiday entitlement is 2.81 weeks holiday.',
    expectedAnswers: [
        regularHoursAnswer,
        { question: calculatorQuestions.calculationBasis, answer: calculatorOptions.annualisedHours },
        ...startAndLeaveAnswers
    ]
} as const;

export const compressedHoursStartAndLeaveScenario = {
    basis: 'compressedHours',
    ...startAndLeaveDates,
    hoursPerWeek: 36,
    daysPerWeek: 4,
    expectedEntitlement: 'The statutory holiday entitlement is 101 hours and 6 minutes holiday for the year. '
        + 'Rather than taking a day’s holiday it’s 9 hours and 0 minutes holiday for each day otherwise worked.',
    expectedAnswers: [
        regularHoursAnswer,
        { question: calculatorQuestions.calculationBasis, answer: calculatorOptions.compressedHours },
        ...startAndLeaveAnswers,
        { question: calculatorQuestions.hoursPerWeek, answer: '36.0' },
        { question: calculatorQuestions.daysPerWeek, answer: '4.0' }
    ]
} as const;

export const irregularHoursScenario = {
    leaveYearStartDate: { day: '1', month: '4', year: '2026' },
    hoursWorked: 70,
    expectedEntitlementMessage: 'The statutory entitlement for this pay period is 8 hours.',
    expectedAnswers: [
        { question: calculatorQuestions.irregularHours, answer: 'Yes' },
        { question: calculatorQuestions.leaveYearStart, answer: '1 April 2026' },
        { question: calculatorQuestions.hoursWorked, answer: '70.0' }
    ]
} as const;
