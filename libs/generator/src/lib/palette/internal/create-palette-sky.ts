import type { createRandom } from '@mander/utils';
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
