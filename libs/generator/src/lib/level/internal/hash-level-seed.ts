import { type createRandom, hashString } from '@mander/utils';
import { toString } from 'lodash-es';

export const hashLevelSeed = (
  random: ReturnType<typeof createRandom>,
): string => hashString(toString(random.rollFloat()));
