import { every, map, size, uniq } from 'lodash-es';
import { parseStructureTextRows } from './internal/parse-structure-text-rows.ts';

const LAYER = String.raw`(?:\[\]|\[\n(?: {4}\[\w+(?:, \w+)*\],\n)+ {2}\])`;

const SHAPE = new RegExp(String.raw`^\[\n {2}${LAYER},\n {2}${LAYER},\n\]$`);

export const isStructureText = (text: string): boolean =>
  SHAPE.test(text) &&
  size(uniq(map(parseStructureTextRows(text), size))) === 1 &&
  every(parseStructureTextRows(text), (row) => size(row) > 0);
