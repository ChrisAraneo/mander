import { type Random, tryTakeRandom } from '@mander/common';
import type { Season } from '@mander/model';
import { SEASONS } from './consts';

export const takeRandomSeason = (random: Random): Season =>
  tryTakeRandom(SEASONS, random);
