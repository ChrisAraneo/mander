import { createRandom } from '@mander/engine';
import { TILE_AIR, TILE_DIRT, type Tile } from '@mander/model';
import { includes, sortBy, times, uniq } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { DEEP_DIRT_DEPTH, DIRT_DEPTH } from '../../consts';
import { takeRandomStoneDirtDepth } from './take-random-stone-dirt-depth';

const createGround = (): Tile[][] => [
  times(8, (): Tile => TILE_AIR),
  times(8, (): Tile => TILE_DIRT),
];

const takeRandomFrom = (seed: string): number =>
  takeRandomStoneDirtDepth({
    tiles: createGround(),
    random: createRandom(seed),
  }).depth;

describe('takeRandomStoneDirtDepth', () => {
  it('should give the normal or the deep dirt depth when it picks one', () => {
    expect(
      includes([DIRT_DEPTH, DEEP_DIRT_DEPTH], takeRandomFrom('DAY-1')),
    ).toBe(true);
  });

  it('should give the same depth when the generator starts from the same seed', () => {
    expect(takeRandomFrom('DAY-1')).toBe(takeRandomFrom('DAY-1'));
  });

  it('should give another depth when the generator starts from another seed', () => {
    expect(takeRandomFrom('DAY-3')).not.toBe(takeRandomFrom('DAY-1'));
  });

  it('should give both depths when the generator starts from many seeds', () => {
    expect(
      sortBy(uniq(times(40, (day) => takeRandomFrom(`DAY-${day}`)))),
    ).toEqual([DIRT_DEPTH, DEEP_DIRT_DEPTH]);
  });

  it('should keep the grid the same when it picks the depth', () => {
    const tiles = createGround();

    expect(
      takeRandomStoneDirtDepth({ tiles, random: createRandom('DAY-1') }).tiles,
    ).toBe(tiles);
  });
});
