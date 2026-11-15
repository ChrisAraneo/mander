import { describe, expect, it } from 'vitest';

import { computeTotalTime } from './compute-total-time';

const FIRST_LEVEL_SECONDS = 12.5;

const SECOND_LEVEL_SECONDS = 30;

const THIRD_LEVEL_SECONDS = 7.25;

const THREE_LEVEL_SECONDS = 49.75;

const ONE_LEVEL_SECONDS = 42;

const NO_SECONDS = 0;

const createLevelTimes = (): number[] => [
  FIRST_LEVEL_SECONDS,
  SECOND_LEVEL_SECONDS,
  THIRD_LEVEL_SECONDS,
];

describe('computeTotalTime', () => {
  it('should add up the times of every level when several levels are done', () => {
    const total = computeTotalTime(createLevelTimes());

    expect(total).toBe(THREE_LEVEL_SECONDS);
  });

  it('should give the time of the level when only one level is done', () => {
    const total = computeTotalTime([ONE_LEVEL_SECONDS]);

    expect(total).toBe(ONE_LEVEL_SECONDS);
  });

  it('should give no time when no level is done yet', () => {
    const total = computeTotalTime([]);

    expect(total).toBe(NO_SECONDS);
  });

  it('should leave the level times it was handed untouched when it adds them up', () => {
    const levelTimes = createLevelTimes();

    computeTotalTime(levelTimes);

    expect(levelTimes).toEqual(createLevelTimes());
  });
});
