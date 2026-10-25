import { parseAlias } from '@mander/structures';
import { compact, map, split, trim } from 'lodash-es';

export const parseCells = (row: string): number[] =>
  map(compact(map(split(row, ','), trim)), parseAlias);
