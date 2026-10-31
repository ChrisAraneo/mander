import type { Random } from '@mander/engine';
import type { Season } from '@mander/model';
import type { Palette } from '@mander/render';
import { pipe } from 'remeda';
import { createPaletteGround } from './internal/create-palette-ground';
import { createPaletteMaterials } from './internal/create-palette-materials';
import { createPaletteSky } from './internal/create-palette-sky';
import { formatPaletteColours } from './internal/format-palette-colours';

export const createPalette = (season: Season, random: Random): Palette =>
  pipe(
    { season, random },
    createPaletteSky,
    createPaletteGround,
    createPaletteMaterials,
    formatPaletteColours,
  );
