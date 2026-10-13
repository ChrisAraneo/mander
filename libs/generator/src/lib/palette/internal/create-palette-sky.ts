import type { createRandom } from '@mander/utils';
import { createRandomSky } from './create-random-sky';

export const createPaletteSky = ({
  random,
}: {
  random: ReturnType<typeof createRandom>;
}) => ({
  sky: createRandomSky(random),
  random,
});
