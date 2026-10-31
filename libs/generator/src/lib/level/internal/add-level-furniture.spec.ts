import { createRandom } from '@mander/engine';
import {
  type Season,
  TILE_AIR,
  TILE_CHEST,
  TILE_DIRT,
  TILE_GEM,
  TILE_KEY,
  TILE_STONE,
  type Tile,
} from '@mander/model';
import { type Sector, STRUCTURE_WIDTH } from '@mander/structures';
import { filter, flatten, includes, size, times } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import type { LevelType } from '../../types/level-type';
import { addLevelFurniture } from './add-level-furniture';

const SPRING: Season = 'SPRING';

const STRUCTURES: Sector[] = [];

const BACK_LEVEL: Tile[][] = [[TILE_AIR]];

const createGround = (width: number): Tile[][] => [
  ...times(6, () => times(width, (): Tile => TILE_AIR)),
  ...times(12, () => times(width, (): Tile => TILE_DIRT)),
];

const addFurnitureIn = (
  tiles: Tile[][],
  levelType: LevelType,
  random = createRandom('DAY-1'),
) =>
  addLevelFurniture({
    levelNumber: 1,
    levelVariant: 'NORMAL',
    levelType,
    season: SPRING,
    structures: STRUCTURES,
    tiles,
    backTiles: BACK_LEVEL,
    random,
  });

const countTiles = (tiles: Tile[][], wanted: Tile): number =>
  size(filter(flatten(tiles), (tile) => tile === wanted));

describe('addLevelFurniture', () => {
  it('should hand a horizontal level its key, its chest and its gems when the ground is flat', () => {
    const { tiles } = addFurnitureIn(
      createGround(STRUCTURE_WIDTH * 2),
      'HORIZONTAL',
    );

    expect(countTiles(tiles, TILE_KEY)).toBe(1);
    expect(countTiles(tiles, TILE_CHEST)).toBe(1);
    expect(countTiles(tiles, TILE_GEM)).toBeGreaterThan(0);
  });

  it('should hand a vertical level its key, its chest and its gems when the ground is flat', () => {
    const { tiles } = addFurnitureIn(createGround(5), 'VERTICAL');

    expect(countTiles(tiles, TILE_KEY)).toBe(1);
    expect(countTiles(tiles, TILE_CHEST)).toBe(1);
    expect(countTiles(tiles, TILE_GEM)).toBeGreaterThan(0);
  });

  it('should settle stone under the ground when the ground is deep enough', () => {
    const { tiles } = addFurnitureIn(
      createGround(STRUCTURE_WIDTH * 2),
      'HORIZONTAL',
    );

    expect(includes(flatten(tiles), TILE_STONE)).toBe(true);
  });

  it('should furnish the level the same way when the generator starts from the same seed', () => {
    expect(addFurnitureIn(createGround(5), 'VERTICAL').tiles).toEqual(
      addFurnitureIn(createGround(5), 'VERTICAL').tiles,
    );
  });

  it('should furnish the level another way when the generator starts from another seed', () => {
    expect(
      addFurnitureIn(createGround(STRUCTURE_WIDTH * 2), 'HORIZONTAL').tiles,
    ).not.toEqual(
      addFurnitureIn(
        createGround(STRUCTURE_WIDTH * 2),
        'HORIZONTAL',
        createRandom('DAY-2'),
      ).tiles,
    );
  });

  it('should give back an empty grid in a horizontal level when the grid is empty', () => {
    expect(addFurnitureIn([], 'HORIZONTAL').tiles).toEqual([]);
  });

  it('should give back an empty grid in a vertical level when the grid is empty', () => {
    expect(addFurnitureIn([], 'VERTICAL').tiles).toEqual([]);
  });

  it('should pass the generator on when it furnishes the level', () => {
    const random = createRandom('DAY-1');

    expect(addFurnitureIn([], 'HORIZONTAL', random).random).toBe(random);
  });

  it('should pass the level number on when it furnishes the level', () => {
    expect(addFurnitureIn([], 'HORIZONTAL').levelNumber).toBe(1);
  });

  it('should pass the level variant on when it furnishes the level', () => {
    expect(addFurnitureIn([], 'HORIZONTAL').levelVariant).toBe('NORMAL');
  });

  it('should pass the season on when it furnishes the level', () => {
    expect(addFurnitureIn([], 'HORIZONTAL').season).toBe(SPRING);
  });

  it('should pass the structures on when it furnishes the level', () => {
    expect(addFurnitureIn([], 'HORIZONTAL').structures).toBe(STRUCTURES);
  });

  it('should keep the back layer the same when it furnishes the level', () => {
    expect(addFurnitureIn([], 'HORIZONTAL').backTiles).toBe(BACK_LEVEL);
  });
});
