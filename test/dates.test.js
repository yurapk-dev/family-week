import assert from 'node:assert/strict';
import test from 'node:test';
import {getIsraelDate, getWeekRange, isCalendarDate, isValidDateRange} from '../src/utils/dates.js';

test('calendar dates require a real date and an exact string format', () => {
    for (const value of ['2024-02-29', '2000-02-29', '2026-12-31']) {
        assert.equal(isCalendarDate(value), true);
    }
    for (const value of ['2026-02-29', '1900-02-29', '2026-04-31', '2026-13-01', '2026-1-01', '', null, undefined, {}, ['2026-01-01']]) {
        assert.equal(isCalendarDate(value), false);
    }
});

test('today in Israel can differ from UTC in winter and summer', (context) => {
    context.mock.timers.enable({apis: ['Date'], now: new Date('2026-12-31T21:59:59Z')});
    assert.equal(getIsraelDate(), '2026-12-31');
    context.mock.timers.setTime(Date.parse('2026-12-31T22:00:00Z'));
    assert.equal(getIsraelDate(), '2027-01-01');
    context.mock.timers.setTime(Date.parse('2026-06-30T20:59:59Z'));
    assert.equal(getIsraelDate(), '2026-06-30');
    context.mock.timers.setTime(Date.parse('2026-06-30T21:00:00Z'));
    assert.equal(getIsraelDate(), '2026-07-01');
});

test('weeks run from Sunday through Saturday across month and year boundaries', () => {
    assert.deepEqual(getWeekRange('2026-11-08'), {from: '2026-11-08', to: '2026-11-14'});
    assert.deepEqual(getWeekRange('2026-11-14'), {from: '2026-11-08', to: '2026-11-14'});
    assert.deepEqual(getWeekRange('2026-04-01'), {from: '2026-03-29', to: '2026-04-04'});
    assert.deepEqual(getWeekRange('2027-01-01'), {from: '2026-12-27', to: '2027-01-02'});
});

test('API ranges include both ends and allow at most 31 days', () => {
    assert.equal(isValidDateRange('2026-11-08', '2026-11-08'), true);
    assert.equal(isValidDateRange('2026-12-15', '2027-01-14'), true);
    assert.equal(isValidDateRange('2026-12-15', '2027-01-15'), false);
    assert.equal(isValidDateRange('2026-11-09', '2026-11-08'), false);
    assert.equal(isValidDateRange('2026-02-30', '2026-03-01'), false);
    assert.equal(isValidDateRange(undefined, '2026-03-01'), false);
});
