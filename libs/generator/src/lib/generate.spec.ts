import { every, filter, join, map, size, times, uniq } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { generate } from './generate';

const LEVELS_A_DAY = 8;

const dayOf = (day: number): Date => new Date(Date.UTC(2026, 0, 1 + day));

const days = times(10, dayOf);

/** A level read as one string, to tell two of them apart by their tiles. */
const fingerprint = (tiles: number[][]): string =>
  join(
    map(tiles, (row) => join(row, ',')),
    '|',
  );

describe('generate', () => {
  it('builds every level of a day out of its own structures', () => {
    const sharing = filter(days, (date) => {
      const world = generate(date);

      return (
        size(uniq(map(world.levels, (level) => fingerprint(level.tiles)))) <
        LEVELS_A_DAY
      );
    });

    expect(sharing).toEqual([]);
  });

  it('leaves no level without structures to be built from', () => {
    const world = generate(dayOf(0));

    expect(size(world.levels)).toBe(LEVELS_A_DAY);
    expect(
      every(world.levels, (level) => level.width > 0 && level.height > 0),
    ).toBe(true);
  });

  it('deals the same day the same way twice', () => {
    expect(
      map(generate(dayOf(0)).levels, (level) => fingerprint(level.tiles)),
    ).toEqual(
      map(generate(dayOf(0)).levels, (level) => fingerprint(level.tiles)),
    );
  });
});
