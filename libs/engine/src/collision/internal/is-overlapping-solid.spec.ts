import { type Level, type Tile, TILE_AIR, TILE_DIRT } from '@mander/model';
import { head, map, size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { isOverlappingSolid } from './is-overlapping-solid';

const LEGEND: Record<string, Tile> = { '.': TILE_AIR, '#': TILE_DIRT };

const ROWS = ['......', '.#..#.', '......', '######'];

const createLevel = (isOpenSided: boolean): Level => ({
  seed: 'SEED',
  width: size(head(ROWS)),
  height: size(ROWS),
  tiles: map(ROWS, (row) => map(row, (symbol) => LEGEND[symbol])),
  chestItems: [],
  isOpenSided,
});

const LEVEL = createLevel(false);

const OPEN_SIDED_LEVEL = createLevel(true);

describe('isOverlappingSolid', () => {
  it('should overlap when the box covers a solid tile', () => {
    const isOverlapping = isOverlappingSolid(LEVEL, 40, 40, 16, 16);

    expect(isOverlapping).toBe(true);
  });

  it('should overlap when the box reaches into a solid tile from the one beside it', () => {
    const isOverlapping = isOverlappingSolid(LEVEL, 20, 40, 16, 16);

    expect(isOverlapping).toBe(true);
  });

  it('should not overlap when the box is in open air', () => {
    const isOverlapping = isOverlappingSolid(LEVEL, 80, 8, 16, 16);

    expect(isOverlapping).toBe(false);
  });

  it('should overlap when the box pokes out of the side of a level that is closed at the sides', () => {
    const isOverlapping = isOverlappingSolid(LEVEL, -20, 70, 16, 16);

    expect(isOverlapping).toBe(true);
  });

  it('should not overlap when the box pokes out of the side of an open-sided level', () => {
    const isOverlapping = isOverlappingSolid(OPEN_SIDED_LEVEL, -20, 70, 16, 16);

    expect(isOverlapping).toBe(false);
  });
});
