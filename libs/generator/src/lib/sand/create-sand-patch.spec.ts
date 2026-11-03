import { createRandom, type Random } from '@mander/engine';
import {
  type Tile,
  TILE_AIR,
  TILE_DIRT,
  TILE_SAND,
  TILE_WOOD,
} from '@mander/model';
import { describe, expect, it } from 'vitest';

import { createSandPatch } from './create-sand-patch';

const RANDOM: Random = createRandom('DAY-1');

const createTiles = (): Tile[][] => [[TILE_AIR, TILE_WOOD, TILE_WOOD]];

describe('createSandPatch', () => {
  it('should turn the blocks of the level to sand when it is applied to the level', () => {
    const tiles = createTiles();

    expect(createSandPatch(tiles, RANDOM)(tiles)).toEqual([
      [TILE_AIR, TILE_SAND, TILE_SAND],
    ]);
  });

  it('should turn the same kind of block to sand when it is applied to another layer', () => {
    const patch = createSandPatch(createTiles(), RANDOM);

    expect(patch([[TILE_WOOD, TILE_DIRT]])).toEqual([[TILE_SAND, TILE_DIRT]]);
  });

  it('should roll the dice once when it is applied to two layers', () => {
    const rolls: number[] = [];
    const countingRandom: Random = () => {
      rolls.push(1);

      return 0;
    };
    const patch = createSandPatch(createTiles(), countingRandom);

    patch(createTiles());
    patch(createTiles());

    expect(rolls).toEqual([1]);
  });

  it('should give back an empty layer when the level is empty', () => {
    expect(createSandPatch([], RANDOM)([])).toEqual([]);
  });

  it('should not change the old level when it is applied', () => {
    const tiles = createTiles();

    createSandPatch(tiles, RANDOM)(tiles);

    expect(tiles).toEqual(createTiles());
  });
});
