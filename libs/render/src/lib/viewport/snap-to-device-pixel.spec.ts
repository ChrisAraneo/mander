import { TILE_SIZE } from '@mander/model';
import { chain } from '@mander/utils';
import { map, range, round } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { getWholeTileScale } from './get-whole-tile-scale';
import { snapToDevicePixel } from './snap-to-device-pixel';

const RAW_SCALES = [0.5, 0.83, 1, 1.25, 1.3333333, 1.5625, 2, 2.7, 3.1];

describe('snapToDevicePixel', () => {
  it('should put every tile edge on a device pixel edge when it snaps the camera', () => {
    map(RAW_SCALES, (raw) =>
      chain(getWholeTileScale(raw))
        .thru((scale) => ({
          scale,
          camera: snapToDevicePixel(137.4213, scale),
        }))
        .thru(({ scale, camera }) =>
          map(range(0, 40), (column) =>
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
