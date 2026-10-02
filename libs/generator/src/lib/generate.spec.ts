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
  type Tile,
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
  startsWith,
  times,
  uniq,
} from 'lodash-es';
import { match, P } from 'ts-pattern';
import { describe, expect, it } from 'vitest';

import {
  FIRST_CANNON_LEVEL,
  FIRST_HARD_LEVEL,
  LEVELS_PER_DAY,
  MIRRORED_LEVELS,
  STRUCTURES_PER_LEVEL,
  VERTICAL_LEVELS,
} from './consts';
import { generate } from './generate';

const { number } = P;

interface Run {
  levelNumber: number;
  spawn: Point | null;
  portal: Point | null;
}

const GEMS_A_CLIMB = 10;

const createDate = (day: number): Date => new Date(Date.UTC(2026, 0, 1 + day));

const DAYS = times(10, createDate);

const WORLDS = map(DAYS, (date) => generate(date));

const getLevelCategoryPrefix = (levelNumber: number): string =>
  match(levelNumber)
    .when(
      () => includes(VERTICAL_LEVELS, levelNumber),
      () => 'VERTICAL',
    )
    .with(number.gte(FIRST_HARD_LEVEL), () => 'HARD')
    .otherwise(() => 'NORMAL');

const isCrosswise = (run: Run): boolean =>
  !includes(VERTICAL_LEVELS, run.levelNumber);

const getTilesAcross = (start: number, span: number): number[] =>
  range(floor(start / TILE_SIZE), floor((start + span - 1) / TILE_SIZE) + 1);

const isWalledIn = (level: Level): boolean =>
  some(getTilesAcross(getSpawnPosition(level).y, PLAYER_HEIGHT), (row) =>
    some(getTilesAcross(getSpawnPosition(level).x, PLAYER_WIDTH), (column) =>
      isSolid(level, column, row),
    ),
  );

const formatGrid = (tiles: Tile[][]): string =>
  join(
    map(tiles, (row) => join(row, ',')),
    '|',
  );

const findRuns = (): Run[] =>
  flatMap(WORLDS, (world) =>
    map(world.levels, (level, index): Run => ({
      levelNumber: index + 1,
      spawn: findTile(level, TILE_SPAWN),
      portal: findTile(level, TILE_PORTAL),
    })),
  );

const findCrosswiseRuns = (): Run[] => filter(findRuns(), isCrosswise);

const findVerticalRuns = (): Run[] =>
  filter(findRuns(), (run) => !isCrosswise(run));

const findVerticalLevels = (): Level[] =>
  flatMap(WORLDS, (world) =>
    filter(world.levels, (_, index) => includes(VERTICAL_LEVELS, index + 1)),
  );

const isTurned = (run: Run): boolean =>
  run.spawn !== null && run.portal !== null && run.spawn.x > run.portal.x;

const isClimbed = (run: Run): boolean =>
  run.spawn !== null && run.portal !== null && run.spawn.y > run.portal.y;

const hasFlyingEnemiesOn = (indexes: number[]): boolean =>
  some(WORLDS, (world) =>
    some(indexes, (index) =>
      some(
        createEnemies(world.levels[index]),
        (enemy) => enemy.kind === 'FLYING',
      ),
    ),
  );

describe('generate', () => {
  it('should build every level out of its own structures when it deals a day', () => {
    const sharing = filter(
      WORLDS,
      (world) =>
        size(uniq(map(world.levels, (level) => formatGrid(level.tiles)))) <
        LEVELS_PER_DAY,
    );

    expect(sharing).toEqual([]);
  });

  it('should leave no level without structures when it deals a day', () => {
    const world = WORLDS[0];

    expect(size(world.levels)).toBe(LEVELS_PER_DAY);
    expect(
      every(world.levels, (level) => level.width > 0 && level.height > 0),
    ).toBe(true);
  });

  it('should hold the horned enemies back when the level is before the third', () => {
    const chances = map(WORLDS, (world) =>
      map(world.levels, (level) => level.hornedEnemyChance),
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
    const early = flatMap(WORLDS, (world) =>
      flatMap(times(2), (index) => createEnemies(world.levels[index])),
    );

    expect(some(early, (enemy) => enemy.kind === 'HORNED')).toBe(false);
  });

  it('should send no hopping enemy out when the level is one of the last three of the day', () => {
    const late = flatMap(WORLDS, (world) =>
      flatMap(times(3), (index) =>
        createEnemies(world.levels[LEVELS_PER_DAY - 1 - index]),
      ),
    );

    expect(some(late, (enemy) => enemy.kind === 'HOPPING')).toBe(false);
  });

  it('should let flying enemies through when the level sits at any step of the ramp', () => {
    expect(hasFlyingEnemiesOn([0, 1]), 'on the hopping-only levels').toBe(true);
    expect(hasFlyingEnemiesOn([2, 3, 4]), 'on the mixed levels').toBe(true);
    expect(hasFlyingEnemiesOn([5, 6, 7]), 'on the horned-only levels').toBe(
      true,
    );
  });

  it('should hold the cannons back when the level is before the fifth', () => {
    const early = flatMap(WORLDS, (world) =>
      flatMap(times(FIRST_CANNON_LEVEL - 1), (index) =>
        findCannonTiles(world.levels[index]),
      ),
    );

    expect(early).toEqual([]);
  });

  it('should lay down a way in and a way out when it builds a level', () => {
    const lost = filter(
      findRuns(),
      (run) => run.spawn === null || run.portal === null,
    );

    expect(size(findRuns()), 'a full run of days').toBe(
      size(DAYS) * LEVELS_PER_DAY,
    );
    expect(lost).toEqual([]);
  });

  it('should send the player in from the right when the level is the third or the sixth', () => {
    const wrongWay = filter(
      findCrosswiseRuns(),
      (run) => includes(MIRRORED_LEVELS, run.levelNumber) && !isTurned(run),
    );

    expect(wrongWay).toEqual([]);
  });

  it('should send the player in from the left when the level is any other it lays out', () => {
    const wrongWay = filter(
      findCrosswiseRuns(),
      (run) => !includes(MIRRORED_LEVELS, run.levelNumber) && isTurned(run),
    );

    expect(wrongWay).toEqual([]);
  });

  it('should turn two levels around when it deals any day', () => {
    expect(size(filter(findCrosswiseRuns(), isTurned))).toBe(
      size(DAYS) * size(MIRRORED_LEVELS),
    );
  });

  it('should cut the back layer to the shape of the front when it builds a level', () => {
    const ragged = filter(
      flatMap(WORLDS, (world) => world.levels),
      (level) =>
        size(level.backTiles) !== level.height ||
        some(level.backTiles, (row) => size(row) !== level.width),
    );

    expect(ragged).toEqual([]);
  });

  it('should fill the back layer with blocks alone when it builds a level', () => {
    const stray = filter(
      flatMap(WORLDS, (world) =>
        flatMap(world.levels, (level) => flatten(level.backTiles ?? [])),
      ),
      (tile) => tile !== TILE_AIR && !isSolidTile(tile),
    );

    expect(uniq(stray)).toEqual([]);
  });

  it('should leave the level as wide and as tall as it was built when it is mirrored', () => {
    const ragged = filter(
      flatMap(WORLDS, (world) => world.levels),
      (level) =>
        size(level.tiles) !== level.height ||
        some(level.tiles, (row) => size(row) !== level.width),
    );

    expect(ragged).toEqual([]);
  });

  it('should stand the level up when it is the second or the fifth', () => {
    const standing = map(findVerticalLevels(), (level) => level.width);

    expect(size(standing)).toBe(size(DAYS) * size(VERTICAL_LEVELS));
    expect(uniq(standing)).toEqual([STRUCTURE_WIDTH]);
  });

  it('should build the level taller than it is wide when it stands one up', () => {
    const squat = filter(
      findVerticalLevels(),
      (level) => level.height <= level.width,
    );

    expect(squat).toEqual([]);
  });

  it('should send the player up when it stands a level up', () => {
    const wrongWay = filter(findVerticalRuns(), (run) => !isClimbed(run));

    expect(size(findVerticalRuns())).toBe(size(DAYS) * size(VERTICAL_LEVELS));
    expect(wrongWay).toEqual([]);
  });

  it('should leave something to be picked up on the way when it stands a level up', () => {
    const empty = filter(
      findVerticalLevels(),
      (level) =>
        findTile(level, TILE_KEY) === null ||
        findTile(level, TILE_CHEST) === null ||
        size(findGemTiles(level)) < GEMS_A_CLIMB,
    );

    expect(empty).toEqual([]);
  });

  it('should leave the player room to stand when it sends them into a level', () => {
    const buried = flatMap(WORLDS, (world, day) =>
      filter(
        map(world.levels, (level, index) => ({
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
    const openness = flatMap(WORLDS, (world) =>
      map(world.levels, (level, index) => ({
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
    const counts = flatMap(WORLDS, (world) =>
      map(world.levels, (level) => size(level.meta?.structures)),
    );

    expect(size(counts)).toBe(size(DAYS) * LEVELS_PER_DAY);
    expect(uniq(counts)).toEqual([STRUCTURES_PER_LEVEL]);
  });

  it('should record the structures of the category when the level was dealt from it', () => {
    const strays = flatMap(WORLDS, (world) =>
      flatMap(world.levels, (level, index) =>
        filter(
          level.meta?.structures ?? [],
          (name) => !startsWith(name, `${getLevelCategoryPrefix(index + 1)}_`),
        ),
      ),
    );

    expect(strays).toEqual([]);
  });

  it('should deal the day the same way twice when it is given the same day', () => {
    expect(
      map(generate(createDate(0)).levels, (level) => formatGrid(level.tiles)),
    ).toEqual(
      map(generate(createDate(0)).levels, (level) => formatGrid(level.tiles)),
    );
  });

  it('should deal another day when it is given another day', () => {
    expect(
      map(WORLDS[0].levels, (level) => formatGrid(level.tiles)),
    ).not.toEqual(map(WORLDS[1].levels, (level) => formatGrid(level.tiles)));
  });
});
