import { chain } from '@mander/utils';
import { TILE_SIZE } from '@mander/model';
import { forEach, range, round } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { snapToDevicePixel } from './snap-to-device-pixel';
import { getWholeTileScale } from './get-whole-tile-scale';

const RAW_SCALES = [0.5, 0.83, 1, 1.25, 1.3333333, 1.5625, 2, 2.7, 3.1];

describe('getWholeTileScale', () => {
  it('should give the tile a whole number of device pixels when it is given any scale', () => {
    forEach(RAW_SCALES, (raw) =>
      chain(getWholeTileScale(raw) * TILE_SIZE)
        .thru((tile) => expect(tile, `${raw}`).toBe(round(tile)))
        .value(),
    );
  });

  it('should stay within half a device pixel per tile when it rounds the scale asked for', () => {
    forEach(RAW_SCALES, (raw) => {
      expect(
        Math.abs(getWholeTileScale(raw) - raw) * TILE_SIZE,
      ).toBeLessThanOrEqual(0.5);
    });
  });

  it('should never collapse the tile to nothing when the scale is tiny', () => {
    expect(getWholeTileScale(0.001) * TILE_SIZE).toBe(1);
  });
});

describe('snapToDevicePixel', () => {
  it('should put every tile edge on a device pixel edge when it snaps the camera', () => {
    forEach(RAW_SCALES, (raw) =>
      chain(getWholeTileScale(raw))
        .thru((scale) => ({
          scale,
          camera: snapToDevicePixel(137.4213, scale),
        }))
        .thru(({ scale, camera }) =>
          forEach(range(0, 40), (column) =>
            chain((column * TILE_SIZE - camera) * scale)
              .thru((edge) =>
                expect(
                  Math.abs(edge - round(edge)),
                  `${raw} @ ${column}`,
                ).toBeLessThan(1e-6),
              )
              .value(),
          ),
        )
        .value(),
    );
  });

  it('should leave the camera where it is when it already sits on a pixel', () => {
    expect(snapToDevicePixel(64, 2)).toBe(64);
  });
});
