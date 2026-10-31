import { createRandom } from '@mander/engine';
import {
  isGroundEnemyTile,
  type Season,
  TILE_AIR,
  TILE_DIRT,
  TILE_ENEMY,
  TILE_ENEMY_FAST,
  TILE_ENEMY_FLYING,
  TILE_ENEMY_FREEZING,
  TILE_ENEMY_HOPPING,
  TILE_ENEMY_HORNED,
  TILE_ENEMY_SHOOTER,
  type Tile,
} from '@mander/model';
import type { Sector } from '@mander/structures';
import { every, filter, flatten, size, times, uniq } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { addLevelEnemies } from './add-level-enemies';

const SPRING: Season = 'SPRING';

const STRUCTURES: Sector[] = [];

const BACK_LEVEL: Tile[][] = [[TILE_AIR]];

const WIDTH = 60;

const FIRST_HARD_LEVEL = 3;

const LAST_LEVEL = 8;

const createPatrolGround = (): Tile[][] => [
  times(WIDTH, (): Tile => TILE_ENEMY),
  times(WIDTH, (): Tile => TILE_DIRT),
];

const createSky = (): Tile[][] => [
  times(WIDTH, (): Tile => TILE_ENEMY),
  times(WIDTH, (): Tile => TILE_AIR),
  times(WIDTH, (): Tile => TILE_DIRT),
];

const addEnemiesIn = (
  tiles: Tile[][],
  levelNumber = 1,
  season: Season = SPRING,
  random = createRandom('DAY-1'),
) =>
  addLevelEnemies({
    levelNumber,
    levelVariant: 'NORMAL',
    season,
    structures: STRUCTURES,
    tiles,
    backTiles: BACK_LEVEL,
    random,
  });

const countTiles = (tiles: Tile[][], wanted: Tile): number =>
  size(filter(flatten(tiles), (tile) => tile === wanted));

const takeEnemyKindsOn = (levelNumber: number, season: Season): Tile[] =>
  uniq(addEnemiesIn(createPatrolGround(), levelNumber, season).tiles[0]);

describe('addLevelEnemies', () => {
  it('should leave no spawn for the level to pick when it draws the enemies', () => {
    const { tiles } = addEnemiesIn(createPatrolGround());

    expect(countTiles(tiles, TILE_ENEMY)).toBe(0);
  });

  it('should keep every walking enemy on solid ground when it draws them', () => {
    const { tiles } = addEnemiesIn(createPatrolGround(), LAST_LEVEL);

    expect(every(tiles[0], isGroundEnemyTile)).toBe(true);
  });

  it('should send every enemy over air up as a flier when it draws them', () => {
    const { tiles } = addEnemiesIn(createSky(), LAST_LEVEL);

    expect(tiles[0]).toEqual(times(WIDTH, (): Tile => TILE_ENEMY_FLYING));
  });

  it('should send every enemy over air up as a flier when the season is any of them', () => {
    expect(
      uniq(
        flatten([
          addEnemiesIn(createSky(), LAST_LEVEL, 'SPRING').tiles[0],
          addEnemiesIn(createSky(), LAST_LEVEL, 'SUMMER').tiles[0],
          addEnemiesIn(createSky(), LAST_LEVEL, 'AUTUMN').tiles[0],
          addEnemiesIn(createSky(), LAST_LEVEL, 'WINTER').tiles[0],
        ]),
      ),
    ).toEqual([TILE_ENEMY_FLYING]);
  });

  it('should hop its way through the first level when nothing harder is unlocked yet', () => {
    const { tiles } = addEnemiesIn(createPatrolGround(), 1);

    expect(tiles[0]).toEqual(times(WIDTH, (): Tile => TILE_ENEMY_HOPPING));
  });

  it('should hop its way through the first two levels of every season when nothing harder is unlocked yet', () => {
    expect(
      uniq(
        flatten([
          takeEnemyKindsOn(1, 'SPRING'),
          takeEnemyKindsOn(2, 'SPRING'),
          takeEnemyKindsOn(1, 'SUMMER'),
          takeEnemyKindsOn(2, 'SUMMER'),
          takeEnemyKindsOn(1, 'AUTUMN'),
          takeEnemyKindsOn(2, 'AUTUMN'),
          takeEnemyKindsOn(1, 'WINTER'),
          takeEnemyKindsOn(2, 'WINTER'),
        ]),
      ),
    ).toEqual([TILE_ENEMY_HOPPING]);
  });

  it('should send out hopping and fast enemies only when the world is a spring one', () => {
    const kinds = takeEnemyKindsOn(LAST_LEVEL, 'SPRING');

    expect(kinds).toContain(TILE_ENEMY_HOPPING);
    expect(kinds).toContain(TILE_ENEMY_FAST);
    expect(kinds).not.toContain(TILE_ENEMY_HORNED);
    expect(kinds).not.toContain(TILE_ENEMY_SHOOTER);
    expect(kinds).not.toContain(TILE_ENEMY_FREEZING);
  });

  it('should send out hopping and horned enemies only when the world is a summer one', () => {
    const kinds = takeEnemyKindsOn(FIRST_HARD_LEVEL, 'SUMMER');

    expect(kinds).toContain(TILE_ENEMY_HOPPING);
    expect(kinds).toContain(TILE_ENEMY_HORNED);
    expect(kinds).not.toContain(TILE_ENEMY_FAST);
    expect(kinds).not.toContain(TILE_ENEMY_SHOOTER);
    expect(kinds).not.toContain(TILE_ENEMY_FREEZING);
  });

  it('should send out hopping and freezing enemies only when the world is a winter one', () => {
    const kinds = takeEnemyKindsOn(FIRST_HARD_LEVEL, 'WINTER');

    expect(kinds).toContain(TILE_ENEMY_HOPPING);
    expect(kinds).toContain(TILE_ENEMY_FREEZING);
    expect(kinds).not.toContain(TILE_ENEMY_FAST);
    expect(kinds).not.toContain(TILE_ENEMY_HORNED);
    expect(kinds).not.toContain(TILE_ENEMY_SHOOTER);
  });

  it('should send out hopping and shooting enemies only when the world is an autumn one', () => {
    const kinds = takeEnemyKindsOn(LAST_LEVEL, 'AUTUMN');

    expect(kinds).toContain(TILE_ENEMY_HOPPING);
    expect(kinds).toContain(TILE_ENEMY_SHOOTER);
    expect(kinds).not.toContain(TILE_ENEMY_FAST);
    expect(kinds).not.toContain(TILE_ENEMY_HORNED);
    expect(kinds).not.toContain(TILE_ENEMY_FREEZING);
  });

  it('should hold the fast enemies back until the level they are unlocked on', () => {
    expect(takeEnemyKindsOn(2, 'SPRING')).not.toContain(TILE_ENEMY_FAST);
    expect(takeEnemyKindsOn(FIRST_HARD_LEVEL, 'SPRING')).toContain(
      TILE_ENEMY_FAST,
    );
  });

  it('should hold the horned enemies back until the level they are unlocked on', () => {
    expect(takeEnemyKindsOn(2, 'SUMMER')).not.toContain(TILE_ENEMY_HORNED);
    expect(takeEnemyKindsOn(FIRST_HARD_LEVEL, 'SUMMER')).toContain(
      TILE_ENEMY_HORNED,
    );
  });

  it('should hold the freezing enemies back until the level they are unlocked on', () => {
    expect(takeEnemyKindsOn(2, 'WINTER')).not.toContain(TILE_ENEMY_FREEZING);
    expect(takeEnemyKindsOn(FIRST_HARD_LEVEL, 'WINTER')).toContain(
      TILE_ENEMY_FREEZING,
    );
  });

  it('should hold the shooters back until the level they are unlocked on', () => {
    expect(takeEnemyKindsOn(5, 'AUTUMN')).not.toContain(TILE_ENEMY_SHOOTER);
    expect(takeEnemyKindsOn(6, 'AUTUMN')).toContain(TILE_ENEMY_SHOOTER);
  });

  it('should draw the same enemies when the generator starts from the same seed', () => {
    expect(addEnemiesIn(createPatrolGround(), LAST_LEVEL).tiles).toEqual(
      addEnemiesIn(createPatrolGround(), LAST_LEVEL).tiles,
    );
  });

  it('should draw other enemies when the generator starts from another seed', () => {
    expect(addEnemiesIn(createPatrolGround(), LAST_LEVEL).tiles).not.toEqual(
      addEnemiesIn(
        createPatrolGround(),
        LAST_LEVEL,
        SPRING,
        createRandom('DAY-2'),
      ).tiles,
    );
  });

  it('should give back an empty grid when the grid is empty', () => {
    expect(addEnemiesIn([]).tiles).toEqual([]);
  });

  it('should pass the level number on when it draws the enemies', () => {
    expect(addEnemiesIn([], 4).levelNumber).toBe(4);
  });

  it('should pass the level variant on when it draws the enemies', () => {
    expect(addEnemiesIn([]).levelVariant).toBe('NORMAL');
  });

  it('should pass the season on when it draws the enemies', () => {
    expect(addEnemiesIn([], 1, 'WINTER').season).toBe('WINTER');
  });

  it('should pass the structures on when it draws the enemies', () => {
    expect(addEnemiesIn([]).structures).toBe(STRUCTURES);
  });

  it('should pass the generator on when it draws the enemies', () => {
    const random = createRandom('DAY-1');

    expect(addEnemiesIn([], 1, SPRING, random).random).toBe(random);
  });

  it('should keep the back layer the same when it draws the enemies', () => {
    expect(addEnemiesIn([]).backTiles).toBe(BACK_LEVEL);
  });
});
