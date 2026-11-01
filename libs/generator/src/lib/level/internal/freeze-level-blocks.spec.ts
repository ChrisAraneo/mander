import { createRandom } from '@mander/engine';
import {
  type Season,
  TILE_AIR,
  TILE_BRICK,
  TILE_DIRT,
  TILE_ICE,
  type Tile,
  TILE_WOOD,
} from '@mander/model';
import type { Sector } from '@mander/structures';
import { describe, expect, it } from 'vitest';

import { freezeLevelBlocks } from './freeze-level-blocks';

const STRUCTURES: Sector[] = [];

const createTiles = (): Tile[][] => [
  [TILE_AIR, TILE_BRICK],
  [TILE_DIRT, TILE_WOOD],
];

const createBackTiles = (): Tile[][] => [[TILE_BRICK, TILE_AIR]];

const freezeIn = (season: Season) =>
  freezeLevelBlocks({
    levelNumber: 1,
    levelVariant: 'NORMAL',
    season,
    structures: STRUCTURES,
    tiles: createTiles(),
    backTiles: createBackTiles(),
    random: createRandom('DAY-1'),
  });

describe('freezeLevelBlocks', () => {
  it('should freeze every block but the dirt when the season is winter', () => {
    expect(freezeIn('WINTER').tiles).toEqual([
      [TILE_AIR, TILE_ICE],
      [TILE_DIRT, TILE_ICE],
    ]);
  });

  it('should freeze the blocks standing behind the level when the season is winter', () => {
    expect(freezeIn('WINTER').backTiles).toEqual([[TILE_ICE, TILE_AIR]]);
  });

  it('should leave the blocks as they are when the season is not winter', () => {
    expect(freezeIn('SPRING').tiles).toEqual(createTiles());
    expect(freezeIn('SUMMER').tiles).toEqual(createTiles());
    expect(freezeIn('AUTUMN').tiles).toEqual(createTiles());
  });

  it('should leave the blocks behind the level as they are when the season is not winter', () => {
    expect(freezeIn('AUTUMN').backTiles).toEqual(createBackTiles());
  });

  it('should pass the rest of the level on unchanged when it freezes the blocks', () => {
    const level = freezeIn('WINTER');

    expect(level.levelNumber).toBe(1);
    expect(level.levelVariant).toBe('NORMAL');
    expect(level.season).toBe('WINTER');
    expect(level.structures).toBe(STRUCTURES);
  });
});
