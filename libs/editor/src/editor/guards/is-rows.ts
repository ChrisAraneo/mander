import { isArray, some } from 'lodash-es';

export const isRows = (value: unknown): value is unknown[][] =>
  isArray(value) && !some(value, (row) => !isArray(row));
