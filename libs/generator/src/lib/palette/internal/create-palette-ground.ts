import { createRandomGround } from './create-random-ground';
import type { PaletteGroundDraft } from './types/palette-ground-draft';
import type { PaletteSkyDraft } from './types/palette-sky-draft';

export const createPaletteGround = ({
  season,
  sky,
  random,
}: PaletteSkyDraft): PaletteGroundDraft => ({
  season,
  sky,
  ground: createRandomGround(season, random),
  random,
});
