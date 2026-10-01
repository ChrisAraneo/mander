import {
  TILE_AIR,
  TILE_CHEST,
  TILE_DIRT,
  TILE_GEM,
  TILE_KEY,
  TILE_STONE,
  type Tile,
} from '@mander/model';
import { type Sector, STRUCTURE_WIDTH } from '@mander/structures';
import { filter, flatten, includes, size, take, times } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import type { LevelType } from '../../structures/types/level-type';
import { furnishLevel } from './furnish-level';

const STRUCTURES: Sector[] = [];

const BACK_LEVEL: Tile[][] = [[TILE_AIR]];

const createGround = (width: number, bedrock: Tile = TILE_DIRT): Tile[][] => [
  ...times(6, () => times(width, (): Tile => TILE_AIR)),
  ...times(11, () => times(width, (): Tile => TILE_DIRT)),
  times(width, (): Tile => bedrock),
];

const furnishIn = (tiles: Tile[][], levelType: LevelType) =>
  furnishLevel({
    seed: 'SEED',
    levelNumber: 1,
    levelType,
    structures: STRUCTURES,
    tiles,
    backTiles: BACK_LEVEL,
  });

const countTiles = (tiles: Tile[][], wanted: Tile): number =>
  size(filter(flatten(tiles), (tile) => tile === wanted));

describe('furnishLevel', () => {
  it('should hand a horizontal level its key, its chest and its gems when the ground is flat', () => {
    const { tiles } = furnishIn(
      createGround(STRUCTURE_WIDTH * 2),
      'HORIZONTAL',
    );

    expect(countTiles(tiles, TILE_KEY)).toBe(1);
    expect(countTiles(tiles, TILE_CHEST)).toBe(1);
    expect(countTiles(tiles, TILE_GEM)).toBeGreaterThan(0);
  });

  it('should hand a vertical level its key, its chest and its gems when the ground is flat', () => {
    const { tiles } = furnishIn(createGround(5), 'VERTICAL');

    expect(countTiles(tiles, TILE_KEY)).toBe(1);
    expect(countTiles(tiles, TILE_CHEST)).toBe(1);
    expect(countTiles(tiles, TILE_GEM)).toBeGreaterThan(0);
  });

  it('should settle stone under the ground when the ground is deep enough', () => {
    const { tiles } = furnishIn(
      createGround(STRUCTURE_WIDTH * 2),
      'HORIZONTAL',
    );

    expect(includes(flatten(tiles), TILE_STONE)).toBe(true);
  });

  it('should furnish the level the same way when it is given the same grid', () => {
    expect(furnishIn(createGround(5), 'VERTICAL').tiles).toEqual(
      furnishIn(createGround(5), 'VERTICAL').tiles,
    );
  });

  it('should furnish the level another way when the grid is different', () => {
    expect(
      take(furnishIn(createGround(STRUCTURE_WIDTH * 2), 'HORIZONTAL').tiles, 6),
    ).not.toEqual(
      take(
        furnishIn(createGround(STRUCTURE_WIDTH * 2, TILE_STONE), 'HORIZONTAL')
          .tiles,
        6,
      ),
    );
  });

  it('should give back an empty grid in a horizontal level when the grid is empty', () => {
    expect(furnishIn([], 'HORIZONTAL').tiles).toEqual([]);
  });

  it('should give back an empty grid in a vertical level when the grid is empty', () => {
    expect(furnishIn([], 'VERTICAL').tiles).toEqual([]);
  });

  it('should pass the seed on when it furnishes the level', () => {
    expect(furnishIn([], 'HORIZONTAL').seed).toBe('SEED');
  });

  it('should pass the level number on when it furnishes the level', () => {
    expect(furnishIn([], 'HORIZONTAL').levelNumber).toBe(1);
  });

  it('should pass the structures on when it furnishes the level', () => {
    expect(furnishIn([], 'HORIZONTAL').structures).toBe(STRUCTURES);
  });

  it('should keep the back layer the same when it furnishes the level', () => {
    expect(furnishIn([], 'HORIZONTAL').backTiles).toBe(BACK_LEVEL);
  });
});
