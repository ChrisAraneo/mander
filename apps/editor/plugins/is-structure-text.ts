import { every, map, size, split, uniq } from 'lodash-es';

const SHAPE = /^\[\n(?: {2}\[\w+(?:, \w+)*\],\n)+\]$/;

const rowsOf = (text: string): string[][] =>
  map([...text.matchAll(/ {2}\[(\w+(?:, \w+)*)\],/g)], ([, row]) =>
    split(row, ', '),
  );

export const isStructureText = (text: string): boolean =>
  SHAPE.test(text) &&
  size(uniq(map(rowsOf(text), size))) === 1 &&
  every(rowsOf(text), (row) => size(row) > 0);
