import { every, isArray, isFinite } from 'lodash-es';

export const isPackedEntry = (value: unknown): value is number[] =>
  isArray(value) && every(value, isFinite);
