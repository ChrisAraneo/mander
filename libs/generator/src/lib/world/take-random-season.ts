import { type Random, takeRandom } from '@mander/engine';
import type { Season } from '@mander/model';

const SEASONS: Season[] = ['SPRING', 'AUTUMN', 'WINTER'];

export const takeRandomSeason = (random: Random): Season =>
  takeRandom(SEASONS, random);
