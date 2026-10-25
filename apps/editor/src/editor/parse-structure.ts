import type { Layers } from '@mander/model';
import { parseAlias } from '@mander/structures';
import { compact, filter, map, size, split, trim } from 'lodash-es';
import { pipe } from 'remeda';
import type { StructureRow } from './types/structure-row';

const ROW = /^ {4}\[([\w, ]+)\],$/gm;

const LAYER_END = /^ {2}\],$/m;

const parseCells = (row: string): number[] =>
  map(compact(map(split(row, ','), trim)), parseAlias);

const parseRows = (text: string): StructureRow[] =>
  map([...text.matchAll(ROW)], (found): StructureRow => ({
    cells: parseCells(found[1]),
    at: found.index ?? 0,
  }));

const findBoundary = (text: string): number =>
  LAYER_END.exec(text)?.index ?? size(text);

const sliceRowsBefore = (rows: StructureRow[], boundary: number): number[][] =>
  map(
    filter(rows, (row) => row.at < boundary),
    (row) => row.cells,
  );

const sliceRowsAfter = (rows: StructureRow[], boundary: number): number[][] =>
  map(
    filter(rows, (row) => row.at > boundary),
    (row) => row.cells,
  );

export const parseStructure = (text: string): Layers =>
  pipe(
    text,
    (source) => ({ rows: parseRows(source), boundary: findBoundary(source) }),
    ({ rows, boundary }): Layers => ({
      tiles: sliceRowsBefore(rows, boundary),
      backTiles: sliceRowsAfter(rows, boundary),
    }),
  );
