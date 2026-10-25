import { hashString, type Random } from '@mander/engine';
import { toString } from 'lodash-es';

export const hashLevelSeed = (random: Random): string =>
  hashString(toString(random()));
