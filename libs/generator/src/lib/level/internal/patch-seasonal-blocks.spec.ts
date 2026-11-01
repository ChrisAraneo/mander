import { createRandom } from '@mander/engine';
import {
  type Season,
  TILE_AIR,
  TILE_BRICK,
  TILE_DIRT,
  TILE_FIREBALL,
  TILE_ICE,
  TILE_ICEBALL,
  TILE_PINKBALL,
  type Tile,
  TILE_WOOD,
} from '@mander/model';
import type { Sector } from '@mander/structures';
import { describe, expect, it } from 'vitest';

import { patchSeasonalBlocks } from './patch-seasonal-blocks';

const STRUCTURES: Sector[] = [];

const createTiles = (): Tile[][] => [
  [TILE_AIR, TILE_BRICK],
  [TILE_DIRT, TILE_WOOD],
  [TILE_FIREBALL, TILE_DIRT],
];

const createBackTiles = (): Tile[][] => [[TILE_BRICK, TILE_FIREBALL]];

const patchIn = (season: Season) =>
  patchSeasonalBlocks({
    levelNumber: 1,
    levelVariant: 'NORMAL',
    season,
    structures: STRUCTURES,
    tiles: createTiles(),
    backTiles: createBackTiles(),
    random: createRandom('DAY-1'),
  });

describe('patchSeasonalBlocks', () => {
  it('should freeze every block but the dirt when the season is winter', () => {
    expect(patchIn('WINTER').tiles).toEqual([
      [TILE_AIR, TILE_ICE],
      [TILE_DIRT, TILE_ICE],
      [TILE_ICEBALL, TILE_DIRT],
    ]);
  });

  it('should swap the fireballs for ice balls when the season is winter', () => {
    expect(patchIn('WINTER').tiles[2]).toEqual([TILE_ICEBALL, TILE_DIRT]);
  });

  it('should freeze the blocks standing behind the level when the season is winter', () => {
    expect(patchIn('WINTER').backTiles).toEqual([[TILE_ICE, TILE_ICEBALL]]);
  });

  it('should swap the fireballs for pink balls when the season is spring', () => {
    expect(patchIn('SPRING').tiles[2]).toEqual([TILE_PINKBALL, TILE_DIRT]);
  });

  it('should leave the blocks the level is built of alone when the season is spring', () => {
    expect(patchIn('SPRING').tiles[0]).toEqual([TILE_AIR, TILE_BRICK]);
    expect(patchIn('SPRING').tiles[1]).toEqual([TILE_DIRT, TILE_WOOD]);
  });

  it('should swap the fireballs standing behind the level when the season is spring', () => {
    expect(patchIn('SPRING').backTiles).toEqual([[TILE_BRICK, TILE_PINKBALL]]);
  });

  it('should leave the blocks as they are when the season is neither winter nor spring', () => {
    expect(patchIn('SUMMER').tiles).toEqual(createTiles());
    expect(patchIn('AUTUMN').tiles).toEqual(createTiles());
  });

  it('should leave the blocks behind the level as they are when the season is neither winter nor spring', () => {
    expect(patchIn('AUTUMN').backTiles).toEqual(createBackTiles());
  });

  it('should pass the rest of the level on unchanged when it patches the blocks', () => {
    const level = patchIn('WINTER');

    expect(level.levelNumber).toBe(1);
    expect(level.levelVariant).toBe('NORMAL');
    expect(level.season).toBe('WINTER');
    expect(level.structures).toBe(STRUCTURES);
  });
});
