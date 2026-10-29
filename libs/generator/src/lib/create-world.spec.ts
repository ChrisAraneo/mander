import {
  createEnemies,
  getSpawnPosition,
  HORNED_ENEMY_CHANCE,
  PLAYER_HEIGHT,
  PLAYER_WIDTH,
  hashString,
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
  type Point,
} from '@mander/model';
import type { RenderedWorld } from '@mander/render';
import { STRUCTURE_WIDTH } from '@mander/structures';
import {
  countBy,
  every,
  filter,
  flatMap,
  flatten,
  floor,
  isNull,
  join,
  map,
  range,
  size,
  some,
  startsWith,
  take,
  takeRight,
  times,
  uniq,
} from 'lodash-es';
import { match, P } from 'ts-pattern';
import { describe, expect, it } from 'vitest';

import {
  FIRST_HARD_LEVEL,
  LEVELS_PER_DAY,
  STRUCTURES_PER_LEVEL,
} from './consts';
import { createWorld } from './create-world';

const { number } = P;

interface Run {
  levelNumber: number;
  isOpenSided: boolean;
  spawn: Point | null;
  portal: Point | null;
}

const FIRST_ARMED_LEVEL = 5;

const EARLY_LEVELS = FIRST_HARD_LEVEL - 1;

const LEVELS_OF_A_VARIANT = 2;

const GEMS_A_CLIMB = 10;

const createDate = (day: number): Date => new Date(Date.UTC(2026, 0, 1 + day));

const DAYS = times(10, createDate);

const WORLDS = map(DAYS, (date) => createWorld(date));

const toLevelCategoryPrefix = (level: Level, levelNumber: number): string =>
  match(levelNumber)
    .when(
      () => level.isOpenSided === true,
      () => 'VERTICAL',
    )
    .with(number.gte(FIRST_HARD_LEVEL), () => 'HARD')
    .otherwise(() => 'NORMAL');

const isCrosswise = (run: Run): boolean => !run.isOpenSided;

const computeTilesAcross = (start: number, span: number): number[] =>
  range(floor(start / TILE_SIZE), floor((start + span - 1) / TILE_SIZE) + 1);

const isWalledIn = (level: Level): boolean =>
  some(computeTilesAcross(getSpawnPosition(level).y, PLAYER_HEIGHT), (row) =>
    some(
      computeTilesAcross(getSpawnPosition(level).x, PLAYER_WIDTH),
      (column) => isSolid(level, column, row),
    ),
  );

const formatGrid = (tiles: Tile[][]): string =>
  join(
    map(tiles, (row) => join(row, ',')),
    '|',
  );

const createWorldRuns = (world: RenderedWorld): Run[] =>
  map(world.levels, (level, index): Run => ({
    levelNumber: index + 1,
    isOpenSided: level.isOpenSided === true,
    spawn: findTile(level, TILE_SPAWN),
    portal: findTile(level, TILE_PORTAL),
  }));

const createRuns = (): Run[] => flatMap(WORLDS, createWorldRuns);

const filterCrosswiseRuns = (): Run[] => filter(createRuns(), isCrosswise);

const filterVerticalRuns = (): Run[] =>
  filter(createRuns(), (run) => !isCrosswise(run));

const filterVerticalLevels = (): Level[] =>
  flatMap(WORLDS, (world) =>
    filter(world.levels, (level) => level.isOpenSided === true),
  );

const isTurned = (run: Run): boolean =>
  !isNull(run.spawn) && !isNull(run.portal) && run.spawn.x > run.portal.x;

const toLevelVariant = (run: Run): string =>
  match(run)
    .when(
      () => run.isOpenSided,
      () => 'VERTICAL',
    )
    .when(isTurned, () => 'MIRRORED')
    .otherwise(() => 'NORMAL');

const createEarlyVariants = (): string[][] =>
  map(WORLDS, (world) =>
    map(take(createWorldRuns(world), EARLY_LEVELS), toLevelVariant),
  );

const isClimbed = (run: Run): boolean =>
  !isNull(run.spawn) && !isNull(run.portal) && run.spawn.y > run.portal.y;

const hasFlyingEnemiesOn = (indexes: number[]): boolean =>
  some(WORLDS, (world) =>
    some(indexes, (index) =>
      some(
        createEnemies(world.levels[index]),
        (enemy) => enemy.kind === 'FLYING',
      ),
    ),
  );

describe('createWorld', () => {
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

  it('should send no shooter out when the level is one of the first five of the day', () => {
    const early = flatMap(WORLDS, (world) =>
      flatMap(times(LEVELS_PER_DAY - 3), (index) =>
        createEnemies(world.levels[index]),
      ),
    );

    expect(some(early, (enemy) => enemy.kind === 'SHOOTER')).toBe(false);
  });

  it('should send shooters out when the level is one of the last three of the day', () => {
    const late = flatMap(WORLDS, (world) =>
      flatMap(times(3), (index) =>
        createEnemies(world.levels[LEVELS_PER_DAY - 1 - index]),
      ),
    );

    expect(some(late, (enemy) => enemy.kind === 'SHOOTER')).toBe(true);
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
      flatMap(times(FIRST_ARMED_LEVEL - 1), (index) =>
        findCannonTiles(world.levels[index]),
      ),
    );

    expect(early).toEqual([]);
  });

  it('should lay down a way in and a way out when it builds a level', () => {
    const lost = filter(
      createRuns(),
      (run) => isNull(run.spawn) || isNull(run.portal),
    );

    expect(size(createRuns()), 'a full run of days').toBe(
      size(DAYS) * LEVELS_PER_DAY,
    );
    expect(lost).toEqual([]);
  });

  it('should deal two levels of every variant over the early levels when it deals a day', () => {
    expect(map(createEarlyVariants(), (variants) => countBy(variants))).toEqual(
      map(DAYS, () => ({
        VERTICAL: LEVELS_OF_A_VARIANT,
        MIRRORED: LEVELS_OF_A_VARIANT,
        NORMAL: LEVELS_OF_A_VARIANT,
      })),
    );
  });

  it('should deal the early levels in another order when it deals another day', () => {
    const orders = uniq(
      map(createEarlyVariants(), (variants) => join(variants, ',')),
    );

    expect(size(orders)).toBeGreaterThan(1);
  });

  it('should leave the last levels of the day plain when it deals a day', () => {
    const late = flatMap(WORLDS, (world) =>
      takeRight(createWorldRuns(world), LEVELS_PER_DAY - EARLY_LEVELS),
    );

    expect(filter(late, (run) => toLevelVariant(run) !== 'NORMAL')).toEqual([]);
  });

  it('should turn two levels around when it deals any day', () => {
    expect(size(filter(filterCrosswiseRuns(), isTurned))).toBe(
      size(DAYS) * LEVELS_OF_A_VARIANT,
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

  it('should stand two levels up when it deals any day', () => {
    const standing = map(filterVerticalLevels(), (level) => level.width);

    expect(size(standing)).toBe(size(DAYS) * LEVELS_OF_A_VARIANT);
    expect(uniq(standing)).toEqual([STRUCTURE_WIDTH]);
  });

  it('should build the level taller than it is wide when it stands one up', () => {
    const squat = filter(
      filterVerticalLevels(),
      (level) => level.height <= level.width,
    );

    expect(squat).toEqual([]);
  });

  it('should send the player up when it stands a level up', () => {
    const wrongWay = filter(filterVerticalRuns(), (run) => !isClimbed(run));

    expect(size(filterVerticalRuns())).toBe(size(DAYS) * LEVELS_OF_A_VARIANT);
    expect(wrongWay).toEqual([]);
  });

  it('should leave something to be picked up on the way when it stands a level up', () => {
    const empty = filter(
      filterVerticalLevels(),
      (level) =>
        isNull(findTile(level, TILE_KEY)) ||
        isNull(findTile(level, TILE_CHEST)) ||
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

  it('should stand no level up past the early ones when it deals a day', () => {
    const late = flatMap(WORLDS, (world) =>
      takeRight(world.levels, LEVELS_PER_DAY - EARLY_LEVELS),
    );

    expect(filter(late, (level) => level.isOpenSided === true)).toEqual([]);
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
          (name) =>
            !startsWith(name, `${toLevelCategoryPrefix(level, index + 1)}_`),
        ),
      ),
    );

    expect(strays).toEqual([]);
  });

  it('should deal the day the same way twice when it is given the same day', () => {
    expect(
      map(createWorld(createDate(0)).levels, (level) =>
        formatGrid(level.tiles),
      ),
    ).toEqual(
      map(createWorld(createDate(0)).levels, (level) =>
        formatGrid(level.tiles),
      ),
    );
  }, 120000);

  it('should deal another day when it is given another day', () => {
    expect(
      map(WORLDS[0].levels, (level) => formatGrid(level.tiles)),
    ).not.toEqual(map(WORLDS[1].levels, (level) => formatGrid(level.tiles)));
  });

  it('should deal the recorded world when it is given the first day of 2026', () => {
    const world = WORLDS[0];

    expect(world.name).toBe('0WK92JI16OFD5K');
    expect(world.palette).toEqual({
      sky: ['HSL(150, 35%, 30%)', 'HSL(33, 28%, 46%)', 'HSL(33, 57%, 60%)'],
      hills: ['HSL(150, 29%, 40%)', 'HSL(150, 29%, 34%)'],
      block: 'HSL(38, 30%, 28%)',
      blockCap: 'HSL(128, 42%, 51%)',
      blockCapHighlight: 'HSL(128, 46%, 57%)',
    });
    expect(map(world.levels, (level) => level.seed)).toEqual([
      '187L7V10VY2475',
      '0HHADBW0JT04IF',
      '13FNYM31EAYYRB',
      '0UYVJKN144W8DT',
      '1GTVPPF059RRB0',
      '1PBW4PK1DIWG12',
      '1DQUR5V1JFL5S3',
      '151LOOM04SP0W7',
    ]);
    expect(map(world.levels, (level) => level.meta?.structures)).toEqual([
      [
        'NORMAL_065',
        'NORMAL_104',
        'NORMAL_052',
        'NORMAL_092',
        'NORMAL_073',
        'NORMAL_087',
        'NORMAL_151',
      ],
      [
        'NORMAL_085',
        'NORMAL_122',
        'NORMAL_101',
        'NORMAL_044',
        'NORMAL_166',
        'NORMAL_154',
        'NORMAL_010',
      ],
      [
        'NORMAL_007',
        'NORMAL_083',
        'NORMAL_160',
        'NORMAL_019',
        'NORMAL_032',
        'NORMAL_119',
        'NORMAL_011',
      ],
      [
        'VERTICAL_002',
        'VERTICAL_013',
        'VERTICAL_008',
        'VERTICAL_005',
        'VERTICAL_020',
        'VERTICAL_003',
        'VERTICAL_014',
      ],
      [
        'NORMAL_002',
        'NORMAL_146',
        'NORMAL_098',
        'NORMAL_084',
        'NORMAL_013',
        'NORMAL_135',
        'NORMAL_123',
      ],
      [
        'VERTICAL_023',
        'VERTICAL_029',
        'VERTICAL_012',
        'VERTICAL_027',
        'VERTICAL_010',
        'VERTICAL_004',
        'VERTICAL_030',
      ],
      [
        'HARD_029',
        'HARD_027',
        'HARD_004',
        'HARD_032',
        'HARD_026',
        'HARD_010',
        'HARD_034',
      ],
      [
        'HARD_012',
        'HARD_025',
        'HARD_015',
        'HARD_013',
        'HARD_039',
        'HARD_003',
        'HARD_005',
      ],
    ]);
    expect(
      map(world.levels, (level) => hashString(formatGrid(level.tiles))),
    ).toEqual([
      '0YDZ8MQ16YS6YW',
      '0UIQ7HG09NP3NC',
      '07HZ8991R6R4AS',
      '1WGQ5750VYTXKN',
      '0XWHXWK14268O4',
      '157GHQ112LSWVS',
      '1W89FK71W4JLOE',
      '1QWIZ8I1FOUOVV',
    ]);
    expect(
      map(world.levels, (level) =>
        hashString(formatGrid(level.backTiles ?? [])),
      ),
    ).toEqual([
      '0C9F4S70LKYAH9',
      '19GDEKG0YGSLLG',
      '1518N861LFXCRW',
      '0CETX360K67KDE',
      '0TEPNPE0OE26OQ',
      '1H5KUYQ09EJEG3',
      '1HQ50990F4V62H',
      '0MHJDP60WZ2VJ6',
    ]);
  });

  it('should not change the old date when it deals a day', () => {
    const date = createDate(0);

    createWorld(date);

    expect(date.getTime()).toBe(createDate(0).getTime());
  });
});
