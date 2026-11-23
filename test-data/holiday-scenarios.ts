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

export const partwayYearJuly: ExpectedAnswer[] = [
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
        answer: 'for someone starting part way through a leave year',
    },
    {
        question: 'What was the employment start date?',
        answer: '1 July 2026',
    },
    {
        question: 'When does the leave year start?',
        answer: '1 January 2026'
    },
    {
        question: 'Number of days worked per week?',
        answer: '5.0'
    }
];

export const irregularHours: ExpectedAnswer[] = [
    {
        question: 'Does the employee work irregular hours or for part of the year?',
        answer: 'Yes'
    },
    {
        question: 'When does the leave year start?',
        answer: '1 April 2026'
    },
    {
        question: 'How many hours has the employee worked in the pay period?',
        answer: '70.0'
    }
];


