import { createRandomMaterials } from './create-random-materials';
import type { PaletteDraft } from './types/palette-draft';
import type { PaletteGroundDraft } from './types/palette-ground-draft';

export const createPaletteMaterials = ({
  season,
  sky,
  ground,
  random,
}: PaletteGroundDraft): PaletteDraft => ({
  sky,
  ground,
  materials: createRandomMaterials(season, random),
});
