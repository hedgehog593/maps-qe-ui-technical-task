import { calculatorOptions, calculatorQuestions } from '../pages/calculator.page';

export type ExpectedSummaryAnswer = {
    question: string;
    answer: string;
};

const regularDaysPerWeekAnswers = [
    { question: calculatorQuestions.irregularHours, answer: 'No' },
    { question: calculatorQuestions.calculationBasis, answer: calculatorOptions.daysPerWeek }
] as const;

const fullYearAnswers = [
    ...regularDaysPerWeekAnswers,
    { question: calculatorQuestions.leavePeriod, answer: calculatorOptions.fullYear }
] as const;

export const fullYearFiveDayScenario = {
    daysPerWeek: 5,
    expectedEntitlement: '28 days',
    expectedAnswers: [
        ...fullYearAnswers,
        { question: calculatorQuestions.daysPerWeek, answer: '5.0' }
    ]
} as const;

export const fullYearThreeDayScenario = {
    daysPerWeek: 3,
    expectedEntitlement: '16.8 days',
    expectedAnswers: [
        ...fullYearAnswers,
        { question: calculatorQuestions.daysPerWeek, answer: '3.0' }
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
