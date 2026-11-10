// Checks that the value is a real calendar date in YYYY-MM-DD format.
export function isCalendarDate(value) {
    if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
        return false;
    }
    const date = new Date(`${value}T00:00:00.000Z`);
    return !isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

// Checks that both dates are valid and span 1 to 31 days, including both ends.
export function isValidDateRange(from, to) {
    if (!isCalendarDate(from) || !isCalendarDate(to)) {
        return false;
    }
    const days = (Date.parse(to) - Date.parse(from)) / 86400000 + 1;
    return days >= 1 && days <= 31;
}

// Returns today's date in Israel using the YYYY-MM-DD format.
export function getIsraelDate() {
    return new Date().toLocaleDateString('en-CA', {
        timeZone: 'Asia/Jerusalem',
    });
}

// Returns Sunday and Saturday for an already validated YYYY-MM-DD date.
// Uses UTC calendar arithmetic to avoid local daylight saving time changes.
export function getWeekRange(value) {
    const date = new Date(`${value}T00:00:00Z`);

    date.setUTCDate(date.getUTCDate() - date.getUTCDay());
    const from = date.toISOString().slice(0, 10);

    date.setUTCDate(date.getUTCDate() + 6);
    const to = date.toISOString().slice(0, 10);

    return {from, to};
}
