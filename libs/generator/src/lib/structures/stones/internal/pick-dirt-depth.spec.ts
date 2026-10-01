import { TILE_AIR, TILE_DIRT, type Tile } from '@mander/model';
import { createRandom } from '@mander/utils';
import { includes, sortBy, times, uniq } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { DEEP_DIRT_DEPTH, DIRT_DEPTH } from '../../../consts';
import { pickDirtDepth } from './pick-dirt-depth';

const createGround = (): Tile[][] => [
  times(8, (): Tile => TILE_AIR),
  times(8, (): Tile => TILE_DIRT),
];

const pickFrom = (seed: string): number =>
  pickDirtDepth({ tiles: createGround(), random: createRandom(seed) }).depth;

describe('pickDirtDepth', () => {
  it('should give the normal or the deep dirt depth when it picks one', () => {
    expect(includes([DIRT_DEPTH, DEEP_DIRT_DEPTH], pickFrom('DAY-1'))).toBe(
      true,
    );
  });

  it('should give the same depth when the generator starts from the same seed', () => {
    expect(pickFrom('DAY-1')).toBe(pickFrom('DAY-1'));
  });

  it('should give both depths when the generator starts from many seeds', () => {
    expect(sortBy(uniq(times(40, (day) => pickFrom(`DAY-${day}`))))).toEqual([
      DIRT_DEPTH,
      DEEP_DIRT_DEPTH,
    ]);
  });

  it('should keep the grid the same when it picks the depth', () => {
    const tiles = createGround();

    expect(pickDirtDepth({ tiles, random: createRandom('DAY-1') }).tiles).toBe(
      tiles,
    );
  });
});
