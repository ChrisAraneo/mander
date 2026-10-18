import { map } from 'lodash-es';
import type { Field } from './types/field';

export const computeFieldProduct = (field: Field, other: Field): Field =>
  map(field, (cells, row) =>
    map(cells, (share, column) => share * other[row][column]),
  );
