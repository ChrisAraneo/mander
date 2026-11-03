import { createRandom, type Random } from '@mander/engine';
import {
  type Season,
  TILE_AIR,
  TILE_BRICK,
  TILE_DIRT,
  TILE_FIREBALL,
  TILE_ICE,
  TILE_ICEBALL,
  TILE_PINKBALL,
  TILE_SAND,
  type Tile,
  TILE_WOOD,
} from '@mander/model';
import type { Sector } from '@mander/structures';
import {
  difference,
  filter,
  flatten,
  includes,
  isEqual,
  map,
  size,
  times,
  uniq,
} from 'lodash-es';
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

const SEEDS = times(50, (day) => `DAY-${day}`);

const createSummerBackTiles = (): Tile[][] => [
  [TILE_DIRT, TILE_BRICK, TILE_WOOD, TILE_FIREBALL],
];

const patchSummer = (seed: string) =>
  patchSeasonalBlocks({
    levelNumber: 1,
    levelVariant: 'NORMAL',
    season: 'SUMMER',
    structures: STRUCTURES,
    tiles: createTiles(),
    backTiles: createSummerBackTiles(),
    random: createRandom(seed),
  });

const findGoneTiles = (tiles: Tile[][], patched: Tile[][]): Tile[] =>
  uniq(difference(flatten(tiles), flatten(patched)));

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

  it('should turn all the blocks of exactly one kind to sand when the season is summer', () => {
    const gone = map(SEEDS, (seed) =>
      size(findGoneTiles(createTiles(), patchSummer(seed).tiles)),
    );

    expect(uniq(gone)).toEqual([1]);
    expect(includes(flatten(patchSummer('DAY-1').tiles), TILE_SAND)).toBe(true);
  });

  it('should take other kinds of block when the summer levels start from other seeds', () => {
    const kinds = map(
      SEEDS,
      (seed) => findGoneTiles(createTiles(), patchSummer(seed).tiles)[0],
    );

    expect(uniq(kinds).sort()).toEqual(
      [TILE_DIRT, TILE_BRICK, TILE_WOOD].sort(),
    );
  });

  it('should take the same kind of block when the summer level starts from the same seed', () => {
    expect(patchSummer('DAY-1').tiles).toEqual(patchSummer('DAY-1').tiles);
  });

  it('should turn the same kind of block to sand behind the level when the season is summer', () => {
    const layers = map(SEEDS, (seed) => patchSummer(seed));

    expect(
      filter(
        layers,
        ({ tiles, backTiles }) =>
          !isEqual(
            findGoneTiles(createTiles(), tiles),
            findGoneTiles(createSummerBackTiles(), backTiles),
          ),
      ),
    ).toEqual([]);
  });

  it('should only take a kind of block from the front of the level when the season is summer', () => {
    const layers = map(SEEDS, (seed) =>
      patchSeasonalBlocks({
        levelNumber: 1,
        levelVariant: 'NORMAL',
        season: 'SUMMER',
        structures: STRUCTURES,
        tiles: [[TILE_AIR, TILE_WOOD]],
        backTiles: [[TILE_BRICK, TILE_WOOD]],
        random: createRandom(seed),
      }),
    );

    expect(uniq(map(layers, ({ tiles }) => tiles[0][1]))).toEqual([TILE_SAND]);
    expect(uniq(map(layers, ({ backTiles }) => backTiles[0][0]))).toEqual([
      TILE_BRICK,
    ]);
  });

  it('should leave the air and the fireballs alone when the season is summer', () => {
    const { tiles } = patchSummer('DAY-1');

    expect(tiles[0][0]).toBe(TILE_AIR);
    expect(tiles[2][0]).toBe(TILE_FIREBALL);
  });

  it('should not change the old level when the season is summer', () => {
    const tiles = createTiles();

    patchSeasonalBlocks({
      levelNumber: 1,
      levelVariant: 'NORMAL',
      season: 'SUMMER',
      structures: STRUCTURES,
      tiles,
      backTiles: createBackTiles(),
      random: createRandom('DAY-1'),
    });

    expect(tiles).toEqual(createTiles());
  });

  it('should roll no dice when the season is not summer', () => {
    const rolls: number[] = [];
    const countingRandom: Random = () => rolls.push(1);

    map(['SPRING', 'AUTUMN', 'WINTER'] as Season[], (season) =>
      patchSeasonalBlocks({
        levelNumber: 1,
        levelVariant: 'NORMAL',
        season,
        structures: STRUCTURES,
        tiles: createTiles(),
        backTiles: createBackTiles(),
        random: countingRandom,
      }),
    );

    expect(rolls).toEqual([]);
  });

  it('should leave the blocks as they are when the season is autumn', () => {
    expect(patchIn('AUTUMN').tiles).toEqual(createTiles());
  });

  it('should leave the blocks behind the level as they are when the season is autumn', () => {
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
