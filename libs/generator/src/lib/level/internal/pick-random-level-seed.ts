import { type createRandom, hashString } from '@mander/utils';

export const pickRandomLevelSeed = (
  random: ReturnType<typeof createRandom>,
): string => hashString(String(random.rollFloat()));
