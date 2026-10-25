import { hashString } from '@mander/engine';
import { pipe } from 'remeda';
import { formatDateSeed } from './internal/format-date-seed';

export const computeWorldName = (date: Date): string =>
  pipe(date, formatDateSeed, hashString);
