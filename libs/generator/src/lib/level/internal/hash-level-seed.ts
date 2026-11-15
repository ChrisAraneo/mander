import { hashString, type Random } from '@mander/common';
import { toString } from 'lodash-es';

export const hashLevelSeed = (random: Random): string =>
  hashString(toString(random()));
