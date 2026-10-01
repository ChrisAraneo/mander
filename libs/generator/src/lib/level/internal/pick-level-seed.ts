import { type createRandom, hashString } from '@mander/utils';

export const pickLevelSeed = (
  random: ReturnType<typeof createRandom>,
): string => hashString(String(random.rollFloat()));
