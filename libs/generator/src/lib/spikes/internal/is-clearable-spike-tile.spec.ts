import {
  TILE_AIR,
  TILE_DIRT,
  TILE_SPIKE,
  TILE_SPIKE_CEILING,
  TILE_SPIKE_FALLING,
} from '@mander/model';
import { describe, expect, it } from 'vitest';

import { isClearableSpikeTile } from './is-clearable-spike-tile';

describe('isClearableSpikeTile', () => {
  it('should count the tile when it is a floor spike', () => {
    expect(isClearableSpikeTile(TILE_SPIKE)).toBe(true);
  });

  it('should count the tile when it is a ceiling spike', () => {
    expect(isClearableSpikeTile(TILE_SPIKE_CEILING)).toBe(true);
  });

  it('should count the tile when it is a falling spike', () => {
    expect(isClearableSpikeTile(TILE_SPIKE_FALLING)).toBe(true);
  });

  it('should skip the tile when it is empty', () => {
    expect(isClearableSpikeTile(TILE_AIR)).toBe(false);
  });

  it('should skip the tile when it is a block', () => {
    expect(isClearableSpikeTile(TILE_DIRT)).toBe(false);
  });
});
