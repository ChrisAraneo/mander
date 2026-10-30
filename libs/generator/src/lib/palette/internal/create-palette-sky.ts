import type { Random } from '@mander/engine';
import type { Season } from '@mander/model';
import { createRandomSky } from './create-random-sky';
import type { PaletteSkyDraft } from './types/palette-sky-draft';

export const createPaletteSky = ({
  season,
  random,
}: {
  season: Season;
  random: Random;
}): PaletteSkyDraft => ({
  season,
  sky: createRandomSky(random),
  random,
});
