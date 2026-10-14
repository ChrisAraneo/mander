import { hashString } from '@mander/utils';
import { flow } from 'lodash-es';
import { formatDateSeed } from './internal/format-date-seed';

export const computeWorldName: (date: Date) => string = flow(
  formatDateSeed,
  hashString,
);
