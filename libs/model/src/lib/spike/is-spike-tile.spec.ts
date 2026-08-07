import { some } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { TILE_AIR } from '../air/air';
import { TILE_BRICK } from '../blocks/brick';
import { TILE_DIRT } from '../blocks/dirt';
import { TILE_CHEST } from '../chest/chest';
import { TILE_KEY } from '../key/key';
import { TILE_PORTAL } from '../portal/portal';
import { isSpikeTile } from './is-spike-tile';
import { TILE_SPIKE, TILE_SPIKE_CEILING } from './spike';

describe('isSpikeTile', () => {
  it('should return true when the tile is teeth standing on the floor', () => {
    expect(isSpikeTile(TILE_SPIKE)).toBe(true);
  });

  it('should return true when the tile is teeth hanging from the ceiling', () => {
    expect(isSpikeTile(TILE_SPIKE_CEILING)).toBe(true);
  });

  it('should return false when the tile is air, a block or a trinket', () => {
    expect(
      some(
        [TILE_AIR, TILE_DIRT, TILE_BRICK, TILE_CHEST, TILE_KEY, TILE_PORTAL],
        isSpikeTile,
      ),
    ).toBe(false);
  });

  it('should return false when the tile is one it has never heard of', () => {
    expect(isSpikeTile(999)).toBe(false);
  });
});
