import { map } from 'lodash-es';
import type { Field } from './field';

export const multiplyFields = (field: Field, other: Field): Field =>
  map(field, (cells, row) =>
    map(cells, (share, column) => share * other[row][column]),
  );
