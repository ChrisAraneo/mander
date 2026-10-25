import { TILE_AIR } from '@mander/model';
import { describe, expect, it } from 'vitest';

import { STRUCTURE_END } from '../../consts';
import { isMarkerAt } from './is-marker-at';

describe('isMarkerAt', () => {
  it('should return true when the only marker is at the cell', () => {
    expect(
      isMarkerAt(
        [
          [TILE_AIR, STRUCTURE_END],
          [TILE_AIR, TILE_AIR],
        ],
        STRUCTURE_END,
        0,
        1,
      ),
    ).toBe(true);
  });

  it('should return false when the marker is at another cell', () => {
    expect(
      isMarkerAt(
        [
          [STRUCTURE_END, TILE_AIR],
          [TILE_AIR, TILE_AIR],
        ],
        STRUCTURE_END,
        0,
        1,
      ),
    ).toBe(false);
  });

  it('should return false when another marker is in the same row', () => {
    expect(
      isMarkerAt([[STRUCTURE_END, STRUCTURE_END]], STRUCTURE_END, 0, 1),
    ).toBe(false);
  });

  it('should return false when another marker is in another row', () => {
    expect(
      isMarkerAt(
        [
          [TILE_AIR, STRUCTURE_END],
          [STRUCTURE_END, TILE_AIR],
        ],
        STRUCTURE_END,
        0,
        1,
      ),
    ).toBe(false);
  });

  it('should return false when the structure is empty', () => {
    expect(isMarkerAt([], STRUCTURE_END, 0, 0)).toBe(false);
  });
});
