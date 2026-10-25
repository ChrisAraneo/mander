import type { Random } from '@mander/engine';
import { createRandomSky } from './create-random-sky';
import type { PaletteSkyDraft } from './types/palette-sky-draft';

export const createPaletteSky = ({
  random,
}: {
  random: Random;
}): PaletteSkyDraft => ({
  sky: createRandomSky(random),
  random,
});
