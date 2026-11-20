import { createRandom, type Random } from '@mander/common';
import {
  type Season,
  TILE_CANNON,
  TILE_CANNON_TRIPLE,
  type Tile,
} from '@mander/model';
import type { Sector } from '@mander/structures';
import { flatten, includes, map, size, times, toString, uniq } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { patchSeasonalCannons } from './patch-seasonal-cannons';
import type { LevelFurniture } from './types/level-furniture';

const STRUCTURES: Sector[] = [];

const BACK_TILES: Tile[][] = [[TILE_CANNON]];

const CANNON_ROW_WIDTH = 40;

const SEEDS_TRIED = 20;

const SEEDS = times(SEEDS_TRIED, (day) => `DAY-${day}`);

const TILES: Tile[][] = [times(CANNON_ROW_WIDTH, () => TILE_CANNON)];

const RANDOM: Random = createRandom('DAY-1');

const createLevel = (season: Season, random: Random): LevelFurniture => ({
  levelNumber: 8,
  levelVariant: 'NORMAL',
  season,
  structures: STRUCTURES,
  tiles: TILES,
  backTiles: BACK_TILES,
  random,
});

const patchIn = (season: Season): LevelFurniture =>
  patchSeasonalCannons(createLevel(season, createRandom('DAY-1')));

const patchSummerWith = (seed: string): LevelFurniture =>
  patchSeasonalCannons(createLevel('SUMMER', createRandom(seed)));

describe('patchSeasonalCannons', () => {
  it('should swap in triple cannons and keep some regular ones when the season is summer', () => {
    const tiles = flatten(patchIn('SUMMER').tiles);

    expect(includes(tiles, TILE_CANNON_TRIPLE)).toBe(true);
    expect(includes(tiles, TILE_CANNON)).toBe(true);
  });

  it('should keep the regular cannons when the season is spring', () => {
    expect(patchIn('SPRING').tiles).toBe(TILES);
  });

  it('should keep the regular cannons when the season is autumn', () => {
    expect(patchIn('AUTUMN').tiles).toBe(TILES);
  });

  it('should keep the regular cannons when the season is winter', () => {
    expect(patchIn('WINTER').tiles).toBe(TILES);
  });

  it('should roll no dice when the season is not summer', () => {
    const rolls: number[] = [];
    const countingRandom: Random = () => rolls.push(1);

    patchSeasonalCannons(createLevel('SPRING', countingRandom));
    patchSeasonalCannons(createLevel('AUTUMN', countingRandom));
    patchSeasonalCannons(createLevel('WINTER', countingRandom));

    expect(rolls).toEqual([]);
  });

  it('should not change the old level when the season is summer', () => {
    const tiles = times(CANNON_ROW_WIDTH, () => TILE_CANNON);

    patchSeasonalCannons({
      ...createLevel('SUMMER', createRandom('DAY-1')),
      tiles: [tiles],
    });

    expect(tiles).toEqual(TILES[0]);
  });

  it('should pass the level number on when it patches the cannons', () => {
    expect(patchIn('SUMMER').levelNumber).toBe(8);
  });

  it('should pass the level variant on when it patches the cannons', () => {
    expect(patchIn('SUMMER').levelVariant).toBe('NORMAL');
  });

  it('should pass the season on when it patches the cannons', () => {
    expect(patchIn('SUMMER').season).toBe('SUMMER');
  });

  it('should pass the structures on when it patches the cannons', () => {
    expect(patchIn('SUMMER').structures).toBe(STRUCTURES);
  });

  it('should pass the blocks behind the level on when it patches the cannons', () => {
    expect(patchIn('SUMMER').backTiles).toBe(BACK_TILES);
  });

  it('should pass the generator on when it patches the cannons', () => {
    expect(patchSeasonalCannons(createLevel('SUMMER', RANDOM)).random).toBe(
      RANDOM,
    );
  });

  it('should give back empty layers when the level holds no blocks', () => {
    const level = patchSeasonalCannons({
      ...createLevel('SUMMER', createRandom('DAY-1')),
      tiles: [],
      backTiles: [],
    });

    expect(level.tiles).toEqual([]);
    expect(level.backTiles).toEqual([]);
  });

  it('should swap in the same cannons when the generator starts from the same seed', () => {
    expect(patchSummerWith('DAY-1').tiles).toEqual(
      patchSummerWith('DAY-1').tiles,
    );
  });

  it('should swap in other cannons when the generator starts from other seeds', () => {
    expect(
      size(
        uniq(
          map(SEEDS, (seed) => toString(flatten(patchSummerWith(seed).tiles))),
        ),
      ),
    ).toBeGreaterThan(1);
  });
});
