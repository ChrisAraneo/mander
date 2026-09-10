import { every, map, size, split, uniq } from 'lodash-es';

const LAYER = String.raw`(?:\[\]|\[\n(?: {4}\[\w+(?:, \w+)*\],\n)+ {2}\])`;

// a sector is written as its two layers, the back one left empty when nothing
// was painted behind the level
const SHAPE = new RegExp(String.raw`^\[\n {2}${LAYER},\n {2}${LAYER},\n\]$`);

const rowsOf = (text: string): string[][] =>
  map([...text.matchAll(/ {4}\[(\w+(?:, \w+)*)\],/g)], ([, row]) =>
    split(row, ', '),
  );

export const isStructureText = (text: string): boolean =>
  SHAPE.test(text) &&
  size(uniq(map(rowsOf(text), size))) === 1 &&
  every(rowsOf(text), (row) => size(row) > 0);
