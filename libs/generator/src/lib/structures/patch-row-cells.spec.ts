import { TILE_AIR, TILE_DIRT, TILE_GEM, type Tile } from '@mander/model';
import { describe, expect, it } from 'vitest';

import { patchRowCells } from './patch-row-cells';

const createRow = (): Tile[] => [TILE_AIR, TILE_AIR, TILE_DIRT];

describe('patchRowCells', () => {
  it('should put the marked tile into the row when it gets a mark', () => {
    expect(
      patchRowCells(createRow(), [{ row: 0, column: 1, tile: TILE_GEM }]),
    ).toEqual([TILE_AIR, TILE_GEM, TILE_DIRT]);
  });

  it('should keep the last mark when two marks fall on the same spot', () => {
    expect(
      patchRowCells(createRow(), [
        { row: 0, column: 0, tile: TILE_GEM },
        { row: 0, column: 0, tile: TILE_DIRT },
      ]),
    ).toEqual([TILE_DIRT, TILE_AIR, TILE_DIRT]);
  });

  it('should leave a mark out when it falls off the row', () => {
    expect(
      patchRowCells(createRow(), [{ row: 0, column: 5, tile: TILE_GEM }]),
    ).toEqual(createRow());
  });

  it('should give back a copy of the row when it gets no marks', () => {
    const cells = createRow();

    const patched = patchRowCells(cells, []);

    expect(patched).toEqual(cells);
    expect(patched).not.toBe(cells);
  });

  it('should give back an empty row when the row is empty', () => {
    expect(patchRowCells([], [{ row: 0, column: 0, tile: TILE_GEM }])).toEqual(
      [],
    );
  });

  it('should not change the old row when it puts marks in', () => {
    const cells = createRow();

    patchRowCells(cells, [{ row: 0, column: 1, tile: TILE_GEM }]);

    expect(cells).toEqual(createRow());
  });
});
