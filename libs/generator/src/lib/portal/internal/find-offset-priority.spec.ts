import { TILE_AIR, type Tile } from '@mander/model';
import { times } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { findOffsetPriority } from './find-offset-priority';

const createLevel = (width: number): Tile[][] => [times(width, () => TILE_AIR)];

const LEVEL = createLevel(10);

describe('findOffsetPriority', () => {
  it('should put the second column from the right first when it is one of the preferred columns', () => {
    expect(findOffsetPriority(LEVEL, { row: 3, column: 8 })).toBe(0);
  });

  it('should rank the right edge after the preferred columns near it when it is the last column', () => {
    expect(findOffsetPriority(LEVEL, { row: 3, column: 9 })).toBe(3);
  });

  it('should rank the column by its distance from the right edge when it is not a preferred column', () => {
    expect(findOffsetPriority(LEVEL, { row: 3, column: 2 })).toBe(7);
  });

  it('should give minus one when the level is empty', () => {
    expect(findOffsetPriority([], { row: 0, column: 0 })).toBe(-1);
  });
});
