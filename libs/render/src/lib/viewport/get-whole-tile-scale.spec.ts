import { TILE_SIZE } from '@mander/model';
import { chain } from '@mander/utils';
import { map, round } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { getWholeTileScale } from './get-whole-tile-scale';

const RAW_SCALES = [0.5, 0.83, 1, 1.25, 1.3333333, 1.5625, 2, 2.7, 3.1];

describe('getWholeTileScale', () => {
  it('should give the tile a whole number of device pixels when it is given any scale', () => {
    map(RAW_SCALES, (raw) =>
      chain(getWholeTileScale(raw) * TILE_SIZE)
        .thru((tile) => expect(tile, `${raw}`).toBe(round(tile)))
        .value(),
    );
  });

  it('should stay within half a device pixel per tile when it rounds the scale asked for', () => {
    map(RAW_SCALES, (raw) =>
      expect(
        Math.abs(getWholeTileScale(raw) - raw) * TILE_SIZE,
        `${raw}`,
      ).toBeLessThanOrEqual(0.5),
    );
  });

  it('should never collapse the tile to nothing when the scale is tiny', () => {
    expect(getWholeTileScale(0.001) * TILE_SIZE).toBe(1);
  });
});
