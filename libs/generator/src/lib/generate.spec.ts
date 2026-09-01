import { createEnemies, HORNED_ENEMY_CHANCE } from '@mander/engine';
import {
  findCannonTiles,
  findGemTiles,
  findTile,
  TILE_CHEST,
  TILE_KEY,
  TILE_PORTAL,
  TILE_SPAWN,
} from '@mander/model';
import { STRUCTURE_WIDTH } from '@mander/structures';
import type { Point } from '@mander/utils';
import {
  every,
  filter,
  flatMap,
  includes,
  join,
  map,
  size,
  some,
  times,
  uniq,
} from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { generate } from './generate';
import { MIRRORED_LEVELS, VERTICAL_LEVELS } from './consts';
import { FIRST_CANNON_LEVEL } from './structures/clear-cannons';

const LEVELS_A_DAY = 8;

const GEMS_A_CLIMB = 10;

const dayOf = (day: number): Date => new Date(Date.UTC(2026, 0, 1 + day));

const days = times(10, dayOf);

interface Run {
  levelNumber: number;
  spawn: Point | null;
  portal: Point | null;
}

const isCrosswise = (run: Run): boolean =>
  !includes(VERTICAL_LEVELS, run.levelNumber);

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

  const runs = (): Run[] =>
    flatMap(days, (date) =>
      map(generate(date).levels, (level, index): Run => ({
        levelNumber: index + 1,
        spawn: findTile(level, TILE_SPAWN),
        portal: findTile(level, TILE_PORTAL),
      })),
    );

  const crosswiseRuns = (): Run[] => filter(runs(), isCrosswise);

  const isTurned = (run: Run): boolean =>
    run.spawn !== null && run.portal !== null && run.spawn.x > run.portal.x;

  it('lays down a way in and a way out on every level it builds', () => {
    const lost = filter(
      runs(),
      (run) => run.spawn === null || run.portal === null,
    );

    expect(size(runs()), 'a full run of days').toBe(size(days) * LEVELS_A_DAY);
    expect(lost).toEqual([]);
  });

  it('sends the player in from the right on the third and the sixth level', () => {
    const wrongWay = filter(
      crosswiseRuns(),
      (run) => includes(MIRRORED_LEVELS, run.levelNumber) && !isTurned(run),
    );

    expect(wrongWay).toEqual([]);
  });

  it('sends the player in from the left on every other level it lays out', () => {
    const wrongWay = filter(
      crosswiseRuns(),
      (run) => !includes(MIRRORED_LEVELS, run.levelNumber) && isTurned(run),
    );

    expect(wrongWay).toEqual([]);
  });

  it('turns two levels of every day around, whatever the day', () => {
    expect(size(filter(crosswiseRuns(), isTurned))).toBe(
      size(days) * size(MIRRORED_LEVELS),
    );
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

  const verticalRuns = (): Run[] => filter(runs(), (run) => !isCrosswise(run));

  const isClimbed = (run: Run): boolean =>
    run.spawn !== null && run.portal !== null && run.spawn.y > run.portal.y;

  it('stands the second and the fifth level up', () => {
    const standing = flatMap(days, (date) =>
      map(
        filter(generate(date).levels, (_, index) =>
          includes(VERTICAL_LEVELS, index + 1),
        ),
        (level) => level.width,
      ),
    );

    expect(size(standing)).toBe(size(days) * size(VERTICAL_LEVELS));
    expect(uniq(standing)).toEqual([STRUCTURE_WIDTH]);
  });

  it('builds a level it stands up taller than it is wide', () => {
    const squat = filter(
      flatMap(days, (date) =>
        filter(generate(date).levels, (_, index) =>
          includes(VERTICAL_LEVELS, index + 1),
        ),
      ),
      (level) => level.height <= level.width,
    );

    expect(squat).toEqual([]);
  });

  it('sends the player up on every level it stands up', () => {
    const wrongWay = filter(verticalRuns(), (run) => !isClimbed(run));

    expect(size(verticalRuns())).toBe(size(days) * size(VERTICAL_LEVELS));
    expect(wrongWay).toEqual([]);
  });

  it('leaves a level it stands up something to be picked up on the way', () => {
    const empty = filter(
      flatMap(days, (date) =>
        filter(generate(date).levels, (_, index) =>
          includes(VERTICAL_LEVELS, index + 1),
        ),
      ),
      (level) =>
        findTile(level, TILE_KEY) === null ||
        findTile(level, TILE_CHEST) === null ||
        size(findGemTiles(level)) < GEMS_A_CLIMB,
    );

    expect(empty).toEqual([]);
  });

  it('deals the same day the same way twice', () => {
    expect(
      map(generate(dayOf(0)).levels, (level) => fingerprint(level.tiles)),
    ).toEqual(
      map(generate(dayOf(0)).levels, (level) => fingerprint(level.tiles)),
    );
  });
});
