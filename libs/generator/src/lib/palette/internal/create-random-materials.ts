import type { Random } from '@mander/engine';
import type { Season } from '@mander/model';
import { createRandomBrick } from './create-random-brick';
import { createRandomCeramic } from './create-random-ceramic';
import { createRandomWood } from './create-random-wood';
import type { PaletteMaterialTones } from './types/palette-material-tones';

export const createRandomMaterials = (
  season: Season,
  random: Random,
): PaletteMaterialTones => ({
  brick: createRandomBrick(season, random),
  wood: createRandomWood(season, random),
  ceramic: createRandomCeramic(season, random),
});
