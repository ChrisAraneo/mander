import { createEnemies, HORNED_ENEMY_CHANCE } from '@mander/engine';
import { findCannonTiles } from '@mander/model';
import {
  every,
  filter,
  flatMap,
  join,
  map,
  size,
  some,
  times,
  uniq,
} from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { generate } from './generate';
import { FIRST_CANNON_LEVEL } from './structures/clear-cannons';

const LEVELS_A_DAY = 8;

const dayOf = (day: number): Date => new Date(Date.UTC(2026, 0, 1 + day));

const days = times(10, dayOf);

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

  it('holds the horned enemies back until the third level', () => {
    const chances = map(days, (date) =>
      map(generate(date).levels, (level) => level.hornedEnemyChance),
    );

    expect(uniq(map(chances, (chance) => join(chance, ',')))).toEqual([
      join(
        [
          0,
          0,
          HORNED_ENEMY_CHANCE,
          HORNED_ENEMY_CHANCE,
          HORNED_ENEMY_CHANCE,
          1,
          1,
          1,
        ],
        ',',
      ),
    ]);
  });

  it('sends no horned enemy out on the first two levels of any day', () => {
    const early = flatMap(days, (date) => {
      const world = generate(date);

      return flatMap(times(2), (index) => createEnemies(world.levels[index]));
    });

    expect(some(early, (enemy) => enemy.kind === 'HORNED')).toBe(false);
  });

  it('sends no hopping enemy out on the last three levels of any day', () => {
    const late = flatMap(days, (date) => {
      const world = generate(date);

      return flatMap(times(3), (index) =>
        createEnemies(world.levels[LEVELS_A_DAY - 1 - index]),
      );
    });

    expect(some(late, (enemy) => enemy.kind === 'HOPPING')).toBe(false);
  });

  it('lets flying enemies through at every step of the ramp', () => {
    const flyingOn = (indexes: number[]): boolean =>
      some(days, (date) =>
        some(indexes, (index) =>
          some(
            createEnemies(generate(date).levels[index]),
            (enemy) => enemy.kind === 'FLYING',
          ),
        ),
      );

    expect(flyingOn([0, 1]), 'on the hopping-only levels').toBe(true);
    expect(flyingOn([2, 3, 4]), 'on the mixed levels').toBe(true);
    expect(flyingOn([5, 6, 7]), 'on the horned-only levels').toBe(true);
  });

  it('holds the cannons back until the fifth level', () => {
    const early = flatMap(days, (date) => {
      const world = generate(date);

      return flatMap(times(FIRST_CANNON_LEVEL - 1), (index) =>
        findCannonTiles(world.levels[index]),
      );
    });

    expect(early).toEqual([]);
  });

  it('deals the same day the same way twice', () => {
    expect(
      map(generate(dayOf(0)).levels, (level) => fingerprint(level.tiles)),
    ).toEqual(
      map(generate(dayOf(0)).levels, (level) => fingerprint(level.tiles)),
    );
  });
});
