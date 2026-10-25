import { getAlias } from '@mander/structures';
import { join, map } from 'lodash-es';

export const formatRow = (row: number[], indent: string): string =>
  `${indent}[${join(
    map(row, (cell) => getAlias(cell)),
    ', ',
  )}],`;
