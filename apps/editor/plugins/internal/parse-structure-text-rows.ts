import { map, split } from 'lodash-es';

export const parseStructureTextRows = (text: string): string[][] =>
  map([...text.matchAll(/ {4}\[(\w+(?:, \w+)*)\],/g)], ([, row]) =>
    split(row, ', '),
  );
