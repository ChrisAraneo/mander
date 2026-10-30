import { createRandom } from '@mander/engine';
import {
  isGroundEnemyTile,
  TILE_AIR,
  TILE_DIRT,
  TILE_ENEMY,
  TILE_ENEMY_FLYING,
  TILE_ENEMY_HOPPING,
  TILE_ENEMY_SHOOTER,
  type Tile,
} from '@mander/model';
import type { Sector } from '@mander/structures';
import { every, filter, flatten, includes, size, times } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { addLevelEnemies } from './add-level-enemies';

const STRUCTURES: Sector[] = [];

const BACK_LEVEL: Tile[][] = [[TILE_AIR]];

const WIDTH = 60;

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
  random = createRandom('DAY-1'),
) =>
  addLevelEnemies({
    levelNumber,
    levelVariant: 'NORMAL',
    structures: STRUCTURES,
    tiles,
    backTiles: BACK_LEVEL,
    random,
  });

const countTiles = (tiles: Tile[][], wanted: Tile): number =>
  size(filter(flatten(tiles), (tile) => tile === wanted));

describe('addLevelEnemies', () => {
  it('should leave no spawn for the level to pick when it draws the enemies', () => {
    const { tiles } = addEnemiesIn(createPatrolGround());

    expect(countTiles(tiles, TILE_ENEMY)).toBe(0);
  });

  it('should keep every walking enemy on solid ground when it draws them', () => {
    const { tiles } = addEnemiesIn(createPatrolGround(), 8);

    expect(every(tiles[0], isGroundEnemyTile)).toBe(true);
  });

  it('should send every enemy over air up as a flier when it draws them', () => {
    const { tiles } = addEnemiesIn(createSky(), 8);

    expect(tiles[0]).toEqual(times(WIDTH, (): Tile => TILE_ENEMY_FLYING));
  });

  it('should hop its way through the first level when nothing harder is unlocked yet', () => {
    const { tiles } = addEnemiesIn(createPatrolGround(), 1);

    expect(tiles[0]).toEqual(times(WIDTH, (): Tile => TILE_ENEMY_HOPPING));
  });

  it('should hold the shooters back until the level they are unlocked on', () => {
    expect(
      includes(
        flatten(addEnemiesIn(createPatrolGround(), 5).tiles),
        TILE_ENEMY_SHOOTER,
      ),
    ).toBe(false);
    expect(
      includes(
        flatten(addEnemiesIn(createPatrolGround(), 6).tiles),
        TILE_ENEMY_SHOOTER,
      ),
    ).toBe(true);
  });

  it('should draw the same enemies when the generator starts from the same seed', () => {
    expect(addEnemiesIn(createPatrolGround(), 8).tiles).toEqual(
      addEnemiesIn(createPatrolGround(), 8).tiles,
    );
  });

  it('should draw other enemies when the generator starts from another seed', () => {
    expect(addEnemiesIn(createPatrolGround(), 8).tiles).not.toEqual(
      addEnemiesIn(createPatrolGround(), 8, createRandom('DAY-2')).tiles,
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

  it('should pass the structures on when it draws the enemies', () => {
    expect(addEnemiesIn([]).structures).toBe(STRUCTURES);
  });

  it('should pass the generator on when it draws the enemies', () => {
    const random = createRandom('DAY-1');

    expect(addEnemiesIn([], 1, random).random).toBe(random);
  });

  it('should keep the back layer the same when it draws the enemies', () => {
    expect(addEnemiesIn([]).backTiles).toBe(BACK_LEVEL);
  });
});
