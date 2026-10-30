import { createRandom } from '@mander/engine';
import {
  isGroundEnemyTile,
  TILE_AIR,
  TILE_BEARTRAP,
  TILE_DIRT,
  TILE_ENEMY,
  TILE_ENEMY_FLYING,
  TILE_ENEMY_HOPPING,
  type Tile,
} from '@mander/model';
import { every, filter, flatten, includes, map, size, times } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import type { EnemyChances } from '../types/enemy-chances';
import { randomizeEnemies } from './randomize-enemies';

const NOTHING: EnemyChances = { horned: 0, fast: 0, shooter: 0 };

const EVERYTHING: EnemyChances = { horned: 0.5, fast: 0.25, shooter: 0.15 };

const WIDTH = 40;

const createPatrolGround = (): Tile[][] => [
  times(WIDTH, (): Tile => TILE_ENEMY),
  times(WIDTH, (): Tile => TILE_DIRT),
];

const createSky = (): Tile[][] => [
  times(WIDTH, (): Tile => TILE_ENEMY),
  times(WIDTH, (): Tile => TILE_AIR),
  times(WIDTH, (): Tile => TILE_DIRT),
];

const createDen = (): Tile[][] => [
  [TILE_ENEMY, TILE_AIR, TILE_ENEMY],
  [TILE_DIRT, TILE_AIR, TILE_AIR],
  [TILE_BEARTRAP, TILE_ENEMY, TILE_AIR],
  [TILE_DIRT, TILE_DIRT, TILE_DIRT],
];

const randomizeIn = (
  tiles: Tile[][],
  chances: EnemyChances = EVERYTHING,
  seed = 'DAY-1',
): Tile[][] => randomizeEnemies(tiles, chances, createRandom(seed));

const countTiles = (tiles: Tile[][], wanted: Tile): number =>
  size(filter(flatten(tiles), (tile) => tile === wanted));

describe('randomizeEnemies', () => {
  it('should leave no spawn for the level to pick when it draws the enemies', () => {
    expect(countTiles(randomizeIn(createDen()), TILE_ENEMY)).toBe(0);
  });

  it('should draw one enemy for every spawn the grid held when it draws them', () => {
    const drawn = randomizeIn(createDen());

    expect(
      size(
        filter(
          flatten(drawn),
          (tile) => isGroundEnemyTile(tile) || tile === TILE_ENEMY_FLYING,
        ),
      ),
    ).toBe(countTiles(createDen(), TILE_ENEMY));
  });

  it('should keep every walking enemy on solid ground when it draws them', () => {
    const drawn = randomizeIn(createPatrolGround());

    expect(every(drawn[0], isGroundEnemyTile)).toBe(true);
    expect(includes(flatten(drawn), TILE_ENEMY_FLYING)).toBe(false);
  });

  it('should send every enemy over air up as a flier when it draws them', () => {
    const drawn = randomizeIn(createSky());

    expect(drawn[0]).toEqual(times(WIDTH, (): Tile => TILE_ENEMY_FLYING));
  });

  it('should put a flier over the air and walkers on the ground when the grid mixes them', () => {
    const drawn = randomizeIn(createDen(), NOTHING);

    expect(drawn).toEqual([
      [TILE_ENEMY_HOPPING, TILE_AIR, TILE_ENEMY_FLYING],
      [TILE_DIRT, TILE_AIR, TILE_AIR],
      [TILE_BEARTRAP, TILE_ENEMY_HOPPING, TILE_AIR],
      [TILE_DIRT, TILE_DIRT, TILE_DIRT],
    ]);
  });

  it('should mix the walking kinds the level rolls for when the ground is crowded', () => {
    expect(size(new Set(randomizeIn(createPatrolGround())[0]))).toBeGreaterThan(
      1,
    );
  });

  it('should leave the beartraps where they lie when it draws the enemies', () => {
    expect(countTiles(randomizeIn(createDen()), TILE_BEARTRAP)).toBe(1);
  });

  it('should draw the same enemies when the generator starts from the same seed', () => {
    expect(randomizeIn(createPatrolGround())).toEqual(
      randomizeIn(createPatrolGround()),
    );
  });

  it('should draw other enemies when the generator starts from another seed', () => {
    expect(randomizeIn(createPatrolGround())).not.toEqual(
      randomizeIn(createPatrolGround(), EVERYTHING, 'DAY-2'),
    );
  });

  it('should give back an empty grid when the grid is empty', () => {
    expect(randomizeIn([])).toEqual([]);
  });

  it('should give the grid back untouched when it holds no enemy', () => {
    expect(randomizeIn([[TILE_DIRT, TILE_AIR]])).toEqual([
      [TILE_DIRT, TILE_AIR],
    ]);
  });

  it('should not change the old grid when it draws the enemies', () => {
    const tiles = createDen();

    randomizeIn(tiles);

    expect(tiles).toEqual(createDen());
  });

  it('should leave the rest of the grid alone when it draws the enemies', () => {
    expect(map(randomizeIn(createDen()), (row) => row[0])).toEqual([
      expect.any(Number),
      TILE_DIRT,
      TILE_BEARTRAP,
      TILE_DIRT,
    ]);
  });
});
