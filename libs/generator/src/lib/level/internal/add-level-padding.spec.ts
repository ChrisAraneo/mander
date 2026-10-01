import { TILE_AIR, TILE_BRICK, TILE_DIRT, type Tile } from '@mander/model';
import type { Sector } from '@mander/structures';
import { map, size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { addPadding } from '../../structures/padding/add-padding';
import { addLevelPadding } from './add-level-padding';

const STRUCTURES: Sector[] = [];

const FRONT: Tile[][] = [
  [TILE_AIR, TILE_AIR],
  [TILE_DIRT, TILE_DIRT],
];

const BACK: Tile[][] = [
  [TILE_BRICK, TILE_BRICK],
  [TILE_AIR, TILE_AIR],
];

const padLevel = (tiles: Tile[][], backTiles: Tile[][]) =>
  addLevelPadding({
    seed: 'SEED',
    levelNumber: 1,
    levelType: 'HORIZONTAL',
    structures: STRUCTURES,
    tiles,
    backTiles,
  });

describe('addLevelPadding', () => {
  it('should pad the front layer when it pads the level', () => {
    expect(padLevel(FRONT, BACK).tiles).toEqual(addPadding(FRONT));
  });

  it('should pad the back layer to the shape of the front when it pads the level', () => {
    const { tiles, backTiles } = padLevel(FRONT, BACK);

    expect(backTiles).toEqual(addPadding(BACK, FRONT));
    expect(map(backTiles, size)).toEqual(map(tiles, size));
  });

  it('should give back two empty layers when both layers are empty', () => {
    const { tiles, backTiles } = padLevel([], []);

    expect(tiles).toEqual([]);
    expect(backTiles).toEqual([]);
  });

  it('should pass the seed on when it pads the level', () => {
    expect(padLevel([], []).seed).toBe('SEED');
  });

  it('should pass the level number on when it pads the level', () => {
    expect(padLevel([], []).levelNumber).toBe(1);
  });

  it('should pass the level type on when it pads the level', () => {
    expect(padLevel([], []).levelType).toBe('HORIZONTAL');
  });

  it('should pass the structures on when it pads the level', () => {
    expect(padLevel([], []).structures).toBe(STRUCTURES);
  });
});
