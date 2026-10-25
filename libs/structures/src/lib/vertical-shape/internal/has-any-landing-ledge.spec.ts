import { TILE_AIR, TILE_DIRT } from '@mander/model';
import { isEqual, map, some, times } from 'lodash-es';
import { match } from 'ts-pattern';
import { describe, expect, it } from 'vitest';

import { STRUCTURE_WIDTH } from '../../consts';
import {
  VERTICAL_HEADROOM_ROWS,
  VERTICAL_HEIGHT,
  VERTICAL_LANDING_BANDS,
  VERTICAL_LANDING_ROW,
} from '../consts';
import { hasAnyLandingLedge } from './has-any-landing-ledge';

const createStructure = (solidCells: [number, number][]): number[][] =>
  times(VERTICAL_HEIGHT, (row) =>
    times(STRUCTURE_WIDTH, (column) =>
      match(
        some(solidCells, ([solidRow, solidColumn]) =>
          isEqual([solidRow, solidColumn], [row, column]),
        ),
      )
        .with(true, () => TILE_DIRT)
        .otherwise(() => TILE_AIR),
    ),
  );

const LEDGE_CELLS: [number, number][] = map(
  VERTICAL_LANDING_BANDS[0],
  (column): [number, number] => [VERTICAL_LANDING_ROW, column],
);

describe('hasAnyLandingLedge', () => {
  it('should return true when a landing band is solid and clear above', () => {
    expect(hasAnyLandingLedge(createStructure(LEDGE_CELLS))).toBe(true);
  });

  it('should return false when the landing row has no ledge', () => {
    expect(hasAnyLandingLedge(createStructure([]))).toBe(false);
  });

  it('should return false when a block sits in the headroom above the ledge', () => {
    expect(
      hasAnyLandingLedge(
        createStructure([
          ...LEDGE_CELLS,
          [VERTICAL_HEADROOM_ROWS[0], VERTICAL_LANDING_BANDS[0][0]],
        ]),
      ),
    ).toBe(false);
  });
});
