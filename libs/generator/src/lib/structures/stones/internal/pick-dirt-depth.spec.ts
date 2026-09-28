import { TILE_AIR, TILE_DIRT, type Tile } from '@mander/model';
import { includes, map, sortBy, times, uniq } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { DEEP_DIRT_DEPTH, DIRT_DEPTH } from '../../../consts';
import { pickDirtDepth } from './pick-dirt-depth';

const ground = (width: number): Tile[][] => [
  times(width, (): Tile => TILE_AIR),
  times(width, (): Tile => TILE_DIRT),
];

describe('pickDirtDepth', () => {
  it('should give the normal or the deep dirt depth', () => {
    expect(
      includes(
        [DIRT_DEPTH, DEEP_DIRT_DEPTH],
        pickDirtDepth({ tiles: ground(8) }).depth,
      ),
    ).toBe(true);
  });

  it('should give the same depth when it gets the same grid', () => {
    expect(pickDirtDepth({ tiles: ground(8) }).depth).toBe(
      pickDirtDepth({ tiles: ground(8) }).depth,
    );
  });

  it('should give both depths when it gets many grids', () => {
    expect(
      sortBy(
        uniq(
          map(
            times(40, (index) => ground(8 + index)),
            (tiles) => pickDirtDepth({ tiles }).depth,
          ),
        ),
      ),
    ).toEqual([DIRT_DEPTH, DEEP_DIRT_DEPTH]);
  });

  it('should keep the grid the same when it picks the depth', () => {
    const tiles = ground(8);

    expect(pickDirtDepth({ tiles }).tiles).toBe(tiles);
  });
});
