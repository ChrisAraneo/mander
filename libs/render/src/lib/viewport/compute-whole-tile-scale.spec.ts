import { TILE_SIZE } from '@mander/model';
import { map, round } from 'lodash-es';
import { pipe } from 'remeda';
import { describe, expect, it } from 'vitest';

import { computeWholeTileScale } from './compute-whole-tile-scale';

const RAW_SCALES = [0.5, 0.83, 1, 1.25, 1.3333333, 1.5625, 2, 2.7, 3.1];

describe('computeWholeTileScale', () => {
  it('should give the tile a whole number of device pixels when it is given any scale', () => {
    map(RAW_SCALES, (raw) =>
      pipe(
        raw,
        computeWholeTileScale,
        (scale) => scale * TILE_SIZE,
        (tile) => expect(tile, `${raw}`).toBe(round(tile)),
      ),
    );
  });

  it('should stay within half a device pixel per tile when it rounds the scale asked for', () => {
    map(RAW_SCALES, (raw) =>
      expect(
        Math.abs(computeWholeTileScale(raw) - raw) * TILE_SIZE,
        `${raw}`,
      ).toBeLessThanOrEqual(0.5),
    );
  });

  it('should never collapse the tile to nothing when the scale is tiny', () => {
    expect(computeWholeTileScale(0.001) * TILE_SIZE).toBe(1);
  });
});
