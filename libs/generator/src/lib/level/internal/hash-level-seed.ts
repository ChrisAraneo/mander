import { type createRandom, hashString } from '@mander/utils';

export const hashLevelSeed = (
  random: ReturnType<typeof createRandom>,
): string => hashString(String(random.rollFloat()));
