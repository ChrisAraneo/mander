import { hashString } from '@mander/utils';
import { formatDateSeed } from './internal/format-date-seed';

export const computeWorldName = (date: Date): string =>
  hashString(formatDateSeed(date));
