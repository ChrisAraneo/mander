import { parseAlias } from '@mander/structures';
import { compact, map, split, trim } from 'lodash-es';

const ROW = / {2}\[([\w, ]+)\],/g;

export const parseStructure = (text: string): number[][] =>
  map([...text.matchAll(ROW)], ([, row]) =>
    map(compact(map(split(row, ','), trim)), parseAlias),
  );
