import { some } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { TILE_AIR } from '../air/tile-air';
import { TILE_SPIKE } from '../spike/tile-spike';
import { isIceTile } from './is-ice-tile';
import { TILE_BRICK } from './tile-brick';
import { TILE_CERAMIC } from './tile-ceramic';
import { TILE_DIRT } from './tile-dirt';
import { TILE_ICE } from './tile-ice';
import { TILE_STONE } from './tile-stone';
import { TILE_WOOD } from './tile-wood';

describe('isIceTile', () => {
  it('should return true when the tile is ice', () => {
    expect(isIceTile(TILE_ICE)).toBe(true);
  });

  it('should return false when the tile is another kind of block', () => {
    expect(
      some(
        [TILE_DIRT, TILE_BRICK, TILE_STONE, TILE_WOOD, TILE_CERAMIC],
        isIceTile,
      ),
    ).toBe(false);
  });

  it('should return false when the tile does not block', () => {
    expect(some([TILE_AIR, TILE_SPIKE], isIceTile)).toBe(false);
  });
});
