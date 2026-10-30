import { createRandomGround } from './create-random-ground';
import type { PaletteDraft } from './types/palette-draft';
import type { PaletteSkyDraft } from './types/palette-sky-draft';

export const createPaletteGround = ({
  season,
  sky,
  random,
}: PaletteSkyDraft): PaletteDraft => ({
  sky,
  ground: createRandomGround(season, random),
});
