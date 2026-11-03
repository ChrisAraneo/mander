import { createRandom } from '@mander/engine';
import {
  TILE_AIR,
  TILE_CANNON,
  TILE_CANNON_TRIPLE,
  TILE_DIRT,
  type Tile,
} from '@mander/model';
import { filter, flatten, size, times } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { patchTripleCannons } from './patch-triple-cannons';

const createCannonRows = (): Tile[][] =>
  times(20, () => times(50, () => TILE_CANNON));

const countTiles = (tiles: Tile[][], tile: Tile): number =>
  size(filter(flatten(tiles), (cell) => cell === tile));

describe('patchTripleCannons', () => {
  it('should turn about half of the regular cannons into triple ones when the level is full of them', () => {
    const patched = patchTripleCannons(
      createCannonRows(),
      createRandom('DAY-1'),
    );

    expect(countTiles(patched, TILE_CANNON_TRIPLE)).toBeGreaterThan(450);
    expect(countTiles(patched, TILE_CANNON_TRIPLE)).toBeLessThan(550);
    expect(
      countTiles(patched, TILE_CANNON) +
        countTiles(patched, TILE_CANNON_TRIPLE),
    ).toBe(1000);
  });

  it('should leave every other tile alone when it patches the cannons', () => {
    const tiles = [
      [TILE_AIR, TILE_DIRT],
      [TILE_DIRT, TILE_AIR],
    ];

    expect(patchTripleCannons(tiles, createRandom('DAY-1'))).toEqual(tiles);
  });

  it('should not change the old level when it patches the cannons', () => {
    const tiles = createCannonRows();

    patchTripleCannons(tiles, createRandom('DAY-1'));

    expect(tiles).toEqual(createCannonRows());
  });

  it('should turn the same cannons when the seed is the same', () => {
    expect(
      patchTripleCannons(createCannonRows(), createRandom('DAY-1')),
    ).toEqual(patchTripleCannons(createCannonRows(), createRandom('DAY-1')));
  });

  it('should turn other cannons when the seed is different', () => {
    expect(
      patchTripleCannons(createCannonRows(), createRandom('DAY-1')),
    ).not.toEqual(
      patchTripleCannons(createCannonRows(), createRandom('DAY-2')),
    );
  });

  it('should give an empty level when the level is empty', () => {
    expect(patchTripleCannons([], createRandom('DAY-1'))).toEqual([]);
  });
});
