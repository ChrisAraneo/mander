import {
  createEnemies,
  getSpawnPosition,
  HORNED_ENEMY_CHANCE,
  PLAYER_HEIGHT,
  PLAYER_WIDTH,
} from '@mander/engine';
import {
  findCannonTiles,
  findGemTiles,
  findTile,
  isSolid,
  isSolidTile,
  type Level,
  TILE_AIR,
  TILE_CHEST,
  TILE_KEY,
  TILE_PORTAL,
  TILE_SIZE,
  TILE_SPAWN,
} from '@mander/model';
import { STRUCTURE_WIDTH } from '@mander/structures';
import type { Point } from '@mander/utils';
import {
  every,
  filter,
  flatMap,
  flatten,
  floor,
  includes,
  join,
  map,
  range,
  size,
  some,
  times,
  uniq,
} from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { generate } from './generate';
import {
  FIRST_HARD_LEVEL,
  MIRRORED_LEVELS,
  STRUCTURES_PER_LEVEL,
  VERTICAL_LEVELS,
} from './consts';
import { FIRST_CANNON_LEVEL } from './consts';

const LEVELS_A_DAY = 8;

const GEMS_A_CLIMB = 10;

const dayOf = (day: number): Date => new Date(Date.UTC(2026, 0, 1 + day));

const poolPrefixOf = (levelNumber: number): string =>
  includes(VERTICAL_LEVELS, levelNumber)
    ? 'VERTICAL'
    : levelNumber >= FIRST_HARD_LEVEL
      ? 'HARD'
      : 'NORMAL';

const days = times(10, dayOf);

interface Run {
  levelNumber: number;
  spawn: Point | null;
  portal: Point | null;
}

const isCrosswise = (run: Run): boolean =>
  !includes(VERTICAL_LEVELS, run.levelNumber);

const tilesAcross = (start: number, span: number): number[] =>
  range(floor(start / TILE_SIZE), floor((start + span - 1) / TILE_SIZE) + 1);

const isWalledIn = (level: Level): boolean =>
  some(tilesAcross(getSpawnPosition(level).y, PLAYER_HEIGHT), (row) =>
    some(tilesAcross(getSpawnPosition(level).x, PLAYER_WIDTH), (column) =>
      isSolid(level, column, row),
    ),
  );

const fingerprint = (tiles: number[][]): string =>
  join(
    map(tiles, (row) => join(row, ',')),
    '|',
  );

describe('generate', () => {
  it('should build every level out of its own structures when it deals a day', () => {
    const sharing = filter(days, (date) => {
      const world = generate(date);

      return (
        size(uniq(map(world.levels, (level) => fingerprint(level.tiles)))) <
        LEVELS_A_DAY
      );
    });

    expect(sharing).toEqual([]);
  });

  it('should leave no level without structures when it deals a day', () => {
    const world = generate(dayOf(0));

    expect(size(world.levels)).toBe(LEVELS_A_DAY);
    expect(
      every(world.levels, (level) => level.width > 0 && level.height > 0),
    ).toBe(true);
  });

  it('should hold the horned enemies back when the level is before the third', () => {
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

  it('should send no horned enemy out when the level is one of the first two of the day', () => {
    const early = flatMap(days, (date) => {
      const world = generate(date);

      return flatMap(times(2), (index) => createEnemies(world.levels[index]));
    });

    expect(some(early, (enemy) => enemy.kind === 'HORNED')).toBe(false);
  });

  it('should send no hopping enemy out when the level is one of the last three of the day', () => {
    const late = flatMap(days, (date) => {
      const world = generate(date);

      return flatMap(times(3), (index) =>
        createEnemies(world.levels[LEVELS_A_DAY - 1 - index]),
      );
    });

    expect(some(late, (enemy) => enemy.kind === 'HOPPING')).toBe(false);
  });

  it('should let flying enemies through when the level sits at any step of the ramp', () => {
    const hasFlyingEnemiesOn = (indexes: number[]): boolean =>
      some(days, (date) =>
        some(indexes, (index) =>
          some(
            createEnemies(generate(date).levels[index]),
            (enemy) => enemy.kind === 'FLYING',
          ),
        ),
      );

    expect(hasFlyingEnemiesOn([0, 1]), 'on the hopping-only levels').toBe(true);
    expect(hasFlyingEnemiesOn([2, 3, 4]), 'on the mixed levels').toBe(true);
    expect(hasFlyingEnemiesOn([5, 6, 7]), 'on the horned-only levels').toBe(
      true,
    );
  });

  it('should hold the cannons back when the level is before the fifth', () => {
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

  it('should lay down a way in and a way out when it builds a level', () => {
    const lost = filter(
      runs(),
      (run) => run.spawn === null || run.portal === null,
    );

    expect(size(runs()), 'a full run of days').toBe(size(days) * LEVELS_A_DAY);
    expect(lost).toEqual([]);
  });

  it('should send the player in from the right when the level is the third or the sixth', () => {
    const wrongWay = filter(
      crosswiseRuns(),
      (run) => includes(MIRRORED_LEVELS, run.levelNumber) && !isTurned(run),
    );

    expect(wrongWay).toEqual([]);
  });

  it('should send the player in from the left when the level is any other it lays out', () => {
    const wrongWay = filter(
      crosswiseRuns(),
      (run) => !includes(MIRRORED_LEVELS, run.levelNumber) && isTurned(run),
    );

    expect(wrongWay).toEqual([]);
  });

  it('should turn two levels around when it deals any day', () => {
    expect(size(filter(crosswiseRuns(), isTurned))).toBe(
      size(days) * size(MIRRORED_LEVELS),
    );
  });

  it('should cut the back layer to the shape of the front when it builds a level', () => {
    const ragged = filter(
      flatMap(days, (date) => generate(date).levels),
      (level) =>
        size(level.backTiles) !== level.height ||
        some(level.backTiles, (row) => size(row) !== level.width),
    );

    expect(ragged).toEqual([]);
  });

  it('should fill the back layer with blocks alone when it builds a level', () => {
    const stray = filter(
      flatMap(days, (date) =>
        flatMap(generate(date).levels, (level) =>
          flatten(level.backTiles ?? []),
        ),
      ),
      (tile) => tile !== TILE_AIR && !isSolidTile(tile),
    );

    expect(uniq(stray)).toEqual([]);
  });

  it('should leave the level as wide and as tall as it was built when it is mirrored', () => {
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

  it('should stand the level up when it is the second or the fifth', () => {
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

  it('should build the level taller than it is wide when it stands one up', () => {
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

  it('should send the player up when it stands a level up', () => {
    const wrongWay = filter(verticalRuns(), (run) => !isClimbed(run));

    expect(size(verticalRuns())).toBe(size(days) * size(VERTICAL_LEVELS));
    expect(wrongWay).toEqual([]);
  });

  it('should leave something to be picked up on the way when it stands a level up', () => {
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

  it('should leave the player room to stand when it sends them into a level', () => {
    const buried = flatMap(days, (date, day) =>
      filter(
        map(generate(date).levels, (level, index) => ({
          day,
          levelNumber: index + 1,
          isWalledIn: isWalledIn(level),
        })),
        (entry) => entry.isWalledIn,
      ),
    );

    expect(buried).toEqual([]);
  });

  it('should leave the sides open when it stands a level up, and wall every other level in', () => {
    const openness = flatMap(days, (date) =>
      map(generate(date).levels, (level, index) => ({
        levelNumber: index + 1,
        isOpenSided: level.isOpenSided === true,
      })),
    );

    expect(
      filter(
        openness,
        (level) =>
          level.isOpenSided !== includes(VERTICAL_LEVELS, level.levelNumber),
      ),
    ).toEqual([]);
  });

  it('should record every structure when it builds a level from them', () => {
    const counts = flatMap(days, (date) =>
      map(generate(date).levels, (level) => size(level.meta?.structures)),
    );

    expect(size(counts)).toBe(size(days) * LEVELS_A_DAY);
    expect(uniq(counts)).toEqual([STRUCTURES_PER_LEVEL]);
  });

  it('should record the structures of the pool when the level was dealt from it', () => {
    const strays = flatMap(days, (date) =>
      flatMap(generate(date).levels, (level, index) =>
        filter(
          level.meta?.structures ?? [],
          (name) => !name.startsWith(`${poolPrefixOf(index + 1)}_`),
        ),
      ),
    );

    expect(strays).toEqual([]);
  });

  it('should deal the day the same way twice when it is given the same day', () => {
    expect(
      map(generate(dayOf(0)).levels, (level) => fingerprint(level.tiles)),
    ).toEqual(
      map(generate(dayOf(0)).levels, (level) => fingerprint(level.tiles)),
    );
  });
});
