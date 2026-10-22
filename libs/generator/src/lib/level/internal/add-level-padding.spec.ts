import { createRandom } from '@mander/engine';
import { TILE_AIR, TILE_BRICK, TILE_DIRT, type Tile } from '@mander/model';
import type { Sector } from '@mander/structures';
import { map, size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { addPadding } from '../../padding/add-padding';
import { addLevelPadding } from './add-level-padding';

const RANDOM = createRandom('SEED');

const STRUCTURES: Sector[] = [];

const FRONT: Tile[][] = [
  [TILE_AIR, TILE_AIR],
  [TILE_DIRT, TILE_DIRT],
];

const BACK: Tile[][] = [
  [TILE_BRICK, TILE_BRICK],
  [TILE_AIR, TILE_AIR],
];

const addPaddingIn = (tiles: Tile[][], backTiles: Tile[][]) =>
  addLevelPadding({
    levelNumber: 1,
    levelVariant: 'NORMAL',
    levelType: 'HORIZONTAL',
    structures: STRUCTURES,
    tiles,
    backTiles,
    random: RANDOM,
  });

describe('addLevelPadding', () => {
  it('should pad the front layer when it pads the level', () => {
    expect(addPaddingIn(FRONT, BACK).tiles).toEqual(addPadding(FRONT));
  });

  it('should pad the back layer to the shape of the front when it pads the level', () => {
    const { tiles, backTiles } = addPaddingIn(FRONT, BACK);

    expect(backTiles).toEqual(addPadding(BACK, FRONT));
    expect(map(backTiles, size)).toEqual(map(tiles, size));
  });

  it('should give back two empty layers when both layers are empty', () => {
    const { tiles, backTiles } = addPaddingIn([], []);

    expect(tiles).toEqual([]);
    expect(backTiles).toEqual([]);
  });

  it('should pass the generator on when it pads the level', () => {
    expect(addPaddingIn([], []).random).toBe(RANDOM);
  });

  it('should pass the level number on when it pads the level', () => {
    expect(addPaddingIn([], []).levelNumber).toBe(1);
  });

  it('should pass the level type on when it pads the level', () => {
    expect(addPaddingIn([], []).levelType).toBe('HORIZONTAL');
  });

  it('should pass the level variant on when it pads the level', () => {
    expect(addPaddingIn([], []).levelVariant).toBe('NORMAL');
  });

  it('should pass the structures on when it pads the level', () => {
    expect(addPaddingIn([], []).structures).toBe(STRUCTURES);
  });
});
