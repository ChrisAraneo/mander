import type { createRandom } from '@mander/engine';
import type { Palette } from '@mander/render';
import { flow } from 'lodash-es';
import { createPaletteGround } from './internal/create-palette-ground';
import { createPaletteSky } from './internal/create-palette-sky';
import { formatPaletteColours } from './internal/format-palette-colours';

export const createPalette = (
  random: ReturnType<typeof createRandom>,
): Palette =>
  flow(createPaletteSky, createPaletteGround, formatPaletteColours)({ random });
