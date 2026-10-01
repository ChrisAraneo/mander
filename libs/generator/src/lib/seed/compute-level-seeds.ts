import { hashString } from '@mander/utils';
import { map, range } from 'lodash-es';
import { LEVELS_PER_DAY } from '../consts';
import { formatDateSeed } from './internal/format-date-seed';

export const computeLevelSeeds = (date: Date): string[] =>
  map(range(LEVELS_PER_DAY), (index) =>
    hashString(`${formatDateSeed(date)}#${index}`),
  );
