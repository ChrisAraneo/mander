import { TILE_DIRT } from '@mander/model';
import { VERTICAL_BAND_HEIGHT, VERTICAL_HEIGHT } from '@mander/structures';
import { size, take, times } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { sliceLayer } from './slice-layer';

const LAYER = times(VERTICAL_HEIGHT, (row) => [TILE_DIRT, row]);

describe('sliceLayer', () => {
  it('should keep the whole layer in a horizontal level when it cuts it', () => {
    expect(sliceLayer(LAYER, 'HORIZONTAL')).toBe(LAYER);
  });

  it('should keep only the rows of the band in a vertical level when it cuts the layer', () => {
    expect(sliceLayer(LAYER, 'VERTICAL')).toEqual(
      take(LAYER, VERTICAL_BAND_HEIGHT),
    );
    expect(size(sliceLayer(LAYER, 'VERTICAL'))).toBe(VERTICAL_BAND_HEIGHT);
  });

  it('should give an empty layer in a horizontal level when the layer is empty', () => {
    expect(sliceLayer([], 'HORIZONTAL')).toEqual([]);
  });

  it('should give an empty layer in a vertical level when the layer is empty', () => {
    expect(sliceLayer([], 'VERTICAL')).toEqual([]);
  });
});
