import { TILE_AIR } from '@mander/model';
import { STRUCTURE_WIDTH } from '@mander/structures';
import { times } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { isCut } from './is-cut';

const ROW = times(STRUCTURE_WIDTH, () => TILE_AIR);

describe('isCut', () => {
  it('should accept the grid when it has the height and every row the width of a structure', () => {
    expect(isCut([ROW, ROW], 2)).toBe(true);
  });

  it('should turn the grid away when it has another height', () => {
    expect(isCut([ROW], 2)).toBe(false);
  });

  it('should turn the grid away when a row has another width', () => {
    expect(isCut([ROW, [TILE_AIR]], 2)).toBe(false);
  });

  it('should accept the grid when it is empty and no height is asked for', () => {
    expect(isCut([], 0)).toBe(true);
  });
});
