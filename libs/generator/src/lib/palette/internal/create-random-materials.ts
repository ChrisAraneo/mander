import type { Random } from '@mander/common';
import type { Season } from '@mander/model';
import { takeRandomBrick } from './take-random-brick';
import { takeRandomCeramic } from './take-random-ceramic';
import { takeRandomWood } from './take-random-wood';
import type { PaletteMaterialTones } from './types/palette-material-tones';

export const createRandomMaterials = (
  season: Season,
  random: Random,
): PaletteMaterialTones => ({
  brick: takeRandomBrick(season, random),
  wood: takeRandomWood(season, random),
  ceramic: takeRandomCeramic(season, random),
});
