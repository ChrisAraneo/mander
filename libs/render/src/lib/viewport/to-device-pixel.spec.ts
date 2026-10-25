import { TILE_SIZE } from '@mander/model';
import { map, range, round } from 'lodash-es';
import { pipe } from 'remeda';
import { describe, expect, it } from 'vitest';

import { computeWholeTileScale } from './compute-whole-tile-scale';
import { toDevicePixel } from './to-device-pixel';

const RAW_SCALES = [0.5, 0.83, 1, 1.25, 1.3333333, 1.5625, 2, 2.7, 3.1];

describe('toDevicePixel', () => {
  it('should put every tile edge on a device pixel edge when it snaps the camera', () => {
    map(RAW_SCALES, (raw) =>
      pipe(
        raw,
        computeWholeTileScale,
        (scale) => ({
          scale,
          camera: toDevicePixel(137.4213, scale),
        }),
        ({ scale, camera }) =>
          map(range(0, 40), (column) => ({
            column,
            edge: (column * TILE_SIZE - camera) * scale,
          })),
        (edges) =>
          map(edges, ({ column, edge }) =>
            expect(
              Math.abs(edge - round(edge)),
              `${raw} @ ${column}`,
            ).toBeLessThan(1e-6),
          ),
      ),
    );
  });

  it('should leave the camera where it is when it already sits on a pixel', () => {
    expect(toDevicePixel(64, 2)).toBe(64);
  });
});
