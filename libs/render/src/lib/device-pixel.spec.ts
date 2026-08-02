import { TILE_SIZE } from '@mander/engine';
import { forEach, range } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { snapToDevicePixel, wholeTileScale } from './device-pixel';

// Awkward window sizes over awkward pixel ratios: the scales that used to put
// tile edges halfway across a device pixel.
const RAW_SCALES = [0.5, 0.83, 1, 1.25, 1.3333333, 1.5625, 2, 2.7, 3.1];

describe('wholeTileScale', () => {
  it('gives every tile a whole number of device pixels', () => {
    forEach(RAW_SCALES, (raw) => {
      const tile = wholeTileScale(raw) * TILE_SIZE;
      expect(tile, `${raw}`).toBe(Math.round(tile));
    });
  });

  it('stays within half a device pixel per tile of the scale asked for', () => {
    forEach(RAW_SCALES, (raw) => {
      expect(
        Math.abs(wholeTileScale(raw) - raw) * TILE_SIZE,
      ).toBeLessThanOrEqual(0.5);
    });
  });

  it('never collapses a tile to nothing', () => {
    expect(wholeTileScale(0.001) * TILE_SIZE).toBe(1);
  });
});

describe('snapToDevicePixel', () => {
  it('puts every tile edge on a device pixel edge', () => {
    forEach(RAW_SCALES, (raw) => {
      const scale = wholeTileScale(raw);
      const camera = snapToDevicePixel(137.4213, scale);
      forEach(range(0, 40), (column) => {
        const edge = (column * TILE_SIZE - camera) * scale;
        expect(
          Math.abs(edge - Math.round(edge)),
          `${raw} @ ${column}`,
        ).toBeLessThan(1e-6);
      });
    });
  });

  it('leaves a camera already on a pixel where it is', () => {
    expect(snapToDevicePixel(64, 2)).toBe(64);
  });
});
