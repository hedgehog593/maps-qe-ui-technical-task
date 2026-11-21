export type ExpectedAnswer = {
    question: string;
    answer: string;
};

export const fullYearFiveDays: ExpectedAnswer[] = [
    {
        question: 'Does the employee work irregular hours or for part of the year?',
        answer: 'No'
    },
    {
        question: 'Is the holiday entitlement based on:',
        answer: 'days worked per week'
    },
    {
        question: 'Do you want to work out holiday:',
        answer: 'for a full leave year'
    },
    {
        question: 'Number of days worked per week?',
        answer: '5.0'
    }
];

export const fullYearThreeDays: ExpectedAnswer[] = [
    {
        question: 'Does the employee work irregular hours or for part of the year?',
        answer: 'No'
    },
    {
        question: 'Is the holiday entitlement based on:',
        answer: 'days worked per week'
    },
    {
        question: 'Do you want to work out holiday:',
        answer: 'for a full leave year'
    },
    {
        question: 'Number of days worked per week?',
        answer: '3.0'
    }
];
