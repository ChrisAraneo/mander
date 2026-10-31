import {
  TILE_BRICK,
  TILE_CERAMIC,
  TILE_DIRT,
  TILE_STONE,
  TILE_WOOD,
} from '@mander/model';
import { describe, expect, it } from 'vitest';

import type { Palette } from '../../types/palette';
import { getPaletteMaterial } from './get-palette-material';

const PLAIN: Palette = {
  sky: ['HSL(210, 30%, 12%)', 'HSL(210, 30%, 22%)', 'HSL(210, 30%, 28%)'],
  hills: ['HSL(210, 26%, 18%)', 'HSL(210, 26%, 14%)'],
  block: 'HSL(30, 25%, 27%)',
  blockCap: 'HSL(96, 42%, 48%)',
  blockCapHighlight: 'HSL(96, 47%, 54%)',
};

const ROLLED: Palette = {
  ...PLAIN,
  materials: {
    brick: 'HSL(14, 46%, 44%)',
    wood: 'HSL(30, 32%, 46%)',
    ceramic: 'HSL(186, 50%, 46%)',
  },
};

describe('getPaletteMaterial', () => {
  it('should hand back the colour the level rolled when the tile is built of it', () => {
    expect(getPaletteMaterial(TILE_BRICK, ROLLED)).toBe('HSL(14, 46%, 44%)');
    expect(getPaletteMaterial(TILE_WOOD, ROLLED)).toBe('HSL(30, 32%, 46%)');
    expect(getPaletteMaterial(TILE_CERAMIC, ROLLED)).toBe('HSL(186, 50%, 46%)');
  });

  it('should hand back no colour when the tile grows out of the ground', () => {
    expect(getPaletteMaterial(TILE_DIRT, ROLLED)).toBe('');
    expect(getPaletteMaterial(TILE_STONE, ROLLED)).toBe('');
  });

  it('should hand back no colour when the palette rolled no materials', () => {
    expect(getPaletteMaterial(TILE_BRICK, PLAIN)).toBe('');
    expect(getPaletteMaterial(TILE_WOOD, PLAIN)).toBe('');
    expect(getPaletteMaterial(TILE_CERAMIC, PLAIN)).toBe('');
  });
});
