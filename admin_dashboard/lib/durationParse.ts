type DurationResponse = {
    years?: number;
    months?: number;
    days?: number;
    hours?: number;
    minutes?: number;
    seconds?: number;
    milliseconds?: number;
};

const tokens = new Map([
    ['nanosecond', 1 / 1e6],
    ['nanoseconds', 1 / 1e6],
    ['ns', 1 / 1e6],

    ['millisecond', 1],
    ['milliseconds', 1],
    ['ms', 1],

    ['second', 1000],
    ['seconds', 1000],
    ['sec', 1000],
    ['secs', 1000],
    ['s', 1000],

    ['minute', 1000 * 60],
    ['minutes', 1000 * 60],
    ['min', 1000 * 60],
    ['mins', 1000 * 60],
    ['m', 1000 * 60],

    ['hour', 1000 * 60 * 60],
    ['hours', 1000 * 60 * 60],
    ['hr', 1000 * 60 * 60],
    ['hrs', 1000 * 60 * 60],
    ['h', 1000 * 60 * 60],

    ['day', 1000 * 60 * 60 * 24],
    ['days', 1000 * 60 * 60 * 24],
    ['d', 1000 * 60 * 60 * 24],

    ['week', 1000 * 60 * 60 * 24 * 7],
    ['weeks', 1000 * 60 * 60 * 24 * 7],
    ['wk', 1000 * 60 * 60 * 24 * 7],
    ['wks', 1000 * 60 * 60 * 24 * 7],
    ['w', 1000 * 60 * 60 * 24 * 7],

    ['month', 1000 * 60 * 60 * 24 * (365.25 / 12)],
    ['months', 1000 * 60 * 60 * 24 * (365.25 / 12)],
    ['mm', 1000 * 60 * 60 * 24 * (365.25 / 12)],
    ['b', 1000 * 60 * 60 * 24 * (365.25 / 12)],

    ['year', 1000 * 60 * 60 * 24 * 365.25],
    ['years', 1000 * 60 * 60 * 24 * 365.25],
    ['yr', 1000 * 60 * 60 * 24 * 365.25],
    ['yrs', 1000 * 60 * 60 * 24 * 365.25],
    ['y', 1000 * 60 * 60 * 24 * 365.25]
]);

const LANGAUGE_CONSTANTS: Record<string, string> = {
    TIME_YEAR: 'year',
    TIME_MONTH: 'month',
    TIME_DAY: 'day',
    TIME_HOUR: 'hour',
    TIME_MINUTE: 'minute',
    TIME_SECOND: 'second',
    TIME_PERMANENT: 'permanent',
    TIME_NEVER: 'never',
    TIME_AND: 'and',

    TIME_YEARS: 'years',
    TIME_MONTHS: 'months',
    TIME_DAYS: 'days',
    TIME_HOURS: 'hours',
    TIME_MINUTES: 'minutes',
    TIME_SECONDS: 'seconds',

    TIME_SHORT_YEAR: 'y',
    TIME_SHORT_MONTH: 'mm',
    TIME_SHORT_DAY: 'd',
    TIME_SHORT_HOUR: 'h',
    TIME_SHORT_MINUTE: 'm',
    TIME_SHORT_SECOND: 's',
    TIME_SHORT_PERMANENT: '∞',
};

function getDuration(time: Date | number | string = new Date()): DurationResponse {
    if (!(time instanceof Date)) time = new Date(time);
    const duration = Math.abs(time.getTime());
    const durations: DurationResponse = {};
    let _duration = duration;

    const chainTokens = ['years', 'months', 'days', 'hours', 'minutes', 'seconds', 'milliseconds'];

    for (const token of chainTokens) {
        const tokenVal = Math.floor(_duration / tokens.get(token)!);

        if (tokenVal < 0) {
            durations[token as keyof DurationResponse] = 0;
            continue;
        }

        durations[token as keyof DurationResponse] = tokenVal;
        _duration -= durations[token as keyof DurationResponse]! * tokens.get(token)!;
    }

    return durations;
}

export function formatDurationAsString(duration: Date | number | string | undefined, short = false): string {
    if (duration instanceof Date) duration = duration.getTime();

    const response = [];
    const formatting = getDuration(duration);

    const keys = {
        year: formatting.years,
        month: formatting.months,
        day: formatting.days,
        hour: formatting.hours,
        minute: formatting.minutes,
        second: formatting.seconds
    };

    for (const key in keys) {
        const value = keys[key as keyof typeof keys];

        if (!value) continue;
        if (+value === 1) {
            response.push(`${value}${short ? '' : ' '}${LANGAUGE_CONSTANTS[`TIME_${short ? 'SHORT_' : ''}${key.toUpperCase()}`]}`);
        } else {
            response.push(`${value}${short ? '' : ' '}${LANGAUGE_CONSTANTS[`TIME_${short ? 'SHORT_' : ''}${key.toUpperCase()}${short ? '' : 'S'}`]}`);
        }
    }

    if (!short) {
        if (response.length > 1) response[response.length - 1] = `${LANGAUGE_CONSTANTS['TIME_AND']} ${response[response.length - 1]}`;
    }

    if (response.length === 0) {
        if (short) response.push(`0${LANGAUGE_CONSTANTS['TIME_SHORT_SECOND']}`);
        else response.push(`0 ${LANGAUGE_CONSTANTS['TIME_SECONDS']}`);
    }

    return response.join(' ');
}