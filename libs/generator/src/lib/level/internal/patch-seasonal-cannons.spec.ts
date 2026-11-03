import { createRandom, type Random } from '@mander/engine';
import {
  type Season,
  TILE_CANNON,
  TILE_CANNON_TRIPLE,
  type Tile,
} from '@mander/model';
import type { Sector } from '@mander/structures';
import { flatten, includes, times } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { patchSeasonalCannons } from './patch-seasonal-cannons';
import type { FurnishedLevel } from './types/furnished-level';

const STRUCTURES: Sector[] = [];

const BACK_TILES: Tile[][] = [[TILE_CANNON]];

const TILES: Tile[][] = [times(40, () => TILE_CANNON)];

const RANDOM: Random = createRandom('DAY-1');

const createLevel = (season: Season, random: Random): FurnishedLevel => ({
  levelNumber: 8,
  levelVariant: 'NORMAL',
  season,
  structures: STRUCTURES,
  tiles: TILES,
  backTiles: BACK_TILES,
  random,
});

const patchIn = (season: Season): FurnishedLevel =>
  patchSeasonalCannons(createLevel(season, createRandom('DAY-1')));

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
    const tiles = times(40, () => TILE_CANNON);

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
});
