import { some } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { TILE_AIR } from '../air/tile-air';
import { TILE_BRICK } from '../blocks/tile-brick';
import { TILE_DIRT } from '../blocks/tile-dirt';
import { TILE_CHEST } from '../chest/tile-chest';
import { TILE_KEY } from '../key/tile-key';
import { TILE_PORTAL } from '../portal/tile-portal';
import { isSpikeTile } from './is-spike-tile';
import { TILE_SPIKE } from './tile-spike';
import { TILE_SPIKE_CEILING } from './tile-spike-ceiling';

describe('isSpikeTile', () => {
  it('should return true when the tile is a floor spike', () => {
    expect(isSpikeTile(TILE_SPIKE)).toBe(true);
  });

  it('should return true when the tile is a ceiling spike', () => {
    expect(isSpikeTile(TILE_SPIKE_CEILING)).toBe(true);
  });

  it('should return false when the tile is air, a block or a pickup', () => {
    expect(
      some(
        [TILE_AIR, TILE_DIRT, TILE_BRICK, TILE_CHEST, TILE_KEY, TILE_PORTAL],
        isSpikeTile,
      ),
    ).toBe(false);
  });

  it('should return false when the tile is unknown', () => {
    expect(isSpikeTile(999)).toBe(false);
  });
});
