import { createEnemies, HORNED_ENEMY_CHANCE } from '@mander/engine';
import {
  findCannonTiles,
  findTile,
  TILE_PORTAL,
  TILE_SPAWN,
} from '@mander/model';
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
import { isMirrored } from './structures/is-mirrored';

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

  it('turns some levels around and leaves the rest alone', () => {
    const turned = filter(
      flatMap(days, (date) => generate(date).levels),
      (level) => isMirrored(level.seed),
    );
    const built = flatMap(days, (date) => generate(date).levels);

    expect(size(turned), 'some run right to left').toBeGreaterThan(0);
    expect(size(turned), 'but not all of them').toBeLessThan(size(built));
  });

  it('sends the player in from the right on a mirrored level', () => {
    const levels = flatMap(days, (date) => generate(date).levels);
    const wrongWay = filter(levels, (level) => {
      const spawn = findTile(level, TILE_SPAWN);
      const portal = findTile(level, TILE_PORTAL);

      if (spawn === null || portal === null) return false;

      return isMirrored(level.seed) ? spawn.x <= portal.x : spawn.x >= portal.x;
    });

    expect(wrongWay).toEqual([]);
  });

  it('leaves a mirrored level as wide and as tall as it was built', () => {
    const ragged = filter(
      flatMap(days, (date) => generate(date).levels),
      (level) =>
        size(level.tiles) !== level.height ||
        some(level.tiles, (row) => size(row) !== level.width),
    );

    expect(ragged).toEqual([]);
  });

  it('deals the same day the same way twice', () => {
    expect(
      map(generate(dayOf(0)).levels, (level) => fingerprint(level.tiles)),
    ).toEqual(
      map(generate(dayOf(0)).levels, (level) => fingerprint(level.tiles)),
    );
  });
});
