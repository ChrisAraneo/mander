import type { createRandom } from '@mander/engine';
import { createRandomSky } from './create-random-sky';
import type { PaletteSkyDraft } from './types/palette-sky-draft';

export const createPaletteSky = ({
  random,
}: {
  random: ReturnType<typeof createRandom>;
}): PaletteSkyDraft => ({
  sky: createRandomSky(random),
  random,
});
