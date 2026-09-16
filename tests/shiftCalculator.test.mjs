import assert from "node:assert/strict";
import test from "node:test";
import {
    calculateWorkingHours,
    calculateMaxRollingSevenDayHours,
    calculateMaximumRollingSevenDayHours,
} from "../src/lib/shiftCalculator.ts";
import { getWeekdayName } from "../src/lib/date.ts";

test("working hours exclude breaks, including overnight shifts", () => {
    assert.equal(calculateWorkingHours("10:00", "18:00", 60), 7);
    assert.equal(calculateWorkingHours("22:00", "06:00", 45), 7.25);
    assert.equal(calculateWorkingHours("09:00", "09:00", 60), 23);
    assert.equal(calculateWorkingHours("10:00", "11:00", 60), 0);
    assert.ok(Number.isNaN(calculateWorkingHours("10:00", "11:00", -15)));
});

test("rolling windows include day seven and exclude day eight", () => {
    const shifts = [{ date: "2026-09-16", hours: 7 }];
    assert.equal(calculateMaxRollingSevenDayHours(shifts, "2026-09-22", 5), 12);
    assert.equal(calculateMaxRollingSevenDayHours(shifts, "2026-09-23", 5), 5);
});

test("checks future shifts and windows spanning a calendar week or month", () => {
    const shifts = [
        { date: "2026-09-28", hours: 7 },
        { date: "2026-09-30", hours: 7 },
        { date: "2026-10-03", hours: 7 },
    ];
    assert.equal(calculateMaxRollingSevenDayHours(shifts, "2026-10-01", 7), 28);
    assert.equal(calculateMaxRollingSevenDayHours(shifts, "2026-10-01", 7.25), 28.25);
    assert.equal(calculateMaxRollingSevenDayHours(shifts, "2026-09-27", 7), 28);
    assert.equal(calculateMaxRollingSevenDayHours(shifts, "2026-09-26", 7), 21);
});

test("editing excludes the old shift and counts other same-day shifts", () => {
    const shifts = [
        { id: 1, date: "2026-09-16", hours: 5 },
        { id: 2, date: "2026-09-16", hours: 3 },
        { id: 3, date: "2026-09-18", hours: 7 },
    ];
    const otherShifts = shifts.filter(shift => shift.id !== 1);
    assert.equal(calculateMaxRollingSevenDayHours(otherShifts, "2026-09-16", 6), 16);
});

test("monitoring finds the maximum window without mutating its input", () => {
    const shifts = Object.freeze([
        Object.freeze({ date: "2026-10-15", hours: 8 }),
        Object.freeze({ date: "2026-09-30", hours: 7 }),
        Object.freeze({ date: "2026-10-03", hours: 7 }),
        Object.freeze({ date: "2026-09-28", hours: 7 }),
        Object.freeze({ date: "2026-10-01", hours: 7 }),
    ]);
    assert.equal(calculateMaximumRollingSevenDayHours(shifts), 28);
    assert.equal(calculateMaximumRollingSevenDayHours([]), 0);
});

test("weekday labels use the calendar date", () => {
    assert.equal(getWeekdayName("2026-09-16"), "Wednesday");
});
