import { map } from 'lodash-es';
import { parseCells } from './parse-cells';
import type { StructureRow } from './types/structure-row';

const ROW = /^ {4}\[([\w, ]+)\],$/gm;

export const parseStructureRows = (text: string): StructureRow[] =>
  map([...text.matchAll(ROW)], (found): StructureRow => ({
    cells: parseCells(found[1]),
    at: found.index ?? 0,
  }));
