import { type Tile, TILE_AIR, TILE_DIRT, TILE_SPIKE } from '@mander/model';
import { describe, expect, it } from 'vitest';

import { patchShatteredSpikeRow } from './patch-shattered-spike-row';

const SPIKE_COLUMN = 1;
const OUTSIDE_COLUMN = 9;

const createRow = (): Tile[] => [TILE_DIRT, TILE_SPIKE, TILE_DIRT];

describe('patchShatteredSpikeRow', () => {
  it('should turn the struck cell into air when the column names a cell', () => {
    const cells = patchShatteredSpikeRow(createRow(), SPIKE_COLUMN);

    expect(cells).toEqual([TILE_DIRT, TILE_AIR, TILE_DIRT]);
  });

  it('should leave every cell alone when the column names no cell of the row', () => {
    const cells = patchShatteredSpikeRow(createRow(), OUTSIDE_COLUMN);

    expect(cells).toEqual(createRow());
  });

  it('should give an empty row when the row holds no cell', () => {
    const cells = patchShatteredSpikeRow([], SPIKE_COLUMN);

    expect(cells).toEqual([]);
  });

  it('should not change the row it was given when it shatters a cell', () => {
    const row = createRow();

    patchShatteredSpikeRow(row, SPIKE_COLUMN);

    expect(row).toEqual(createRow());
  });
});
