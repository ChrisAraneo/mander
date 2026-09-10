import type { Layers } from '@mander/model';
import { chain } from '@mander/utils';
import { compact, filter, map, size, split, trim } from 'lodash-es';

import { parseAlias } from '@mander/structures';

const ROW = /^ {4}\[([\w, ]+)\],$/gm;

const LAYER_END = /^ {2}\],$/m;

interface Row {
  cells: number[];
  at: number;
}

const cellsOf = (row: string): number[] =>
  map(compact(map(split(row, ','), trim)), parseAlias);

const rowsOf = (text: string): Row[] =>
  map([...text.matchAll(ROW)], (match): Row => ({
    cells: cellsOf(match[1]),
    at: match.index ?? 0,
  }));

// the two layers are told apart by where the front one is closed off
const boundaryOf = (text: string): number =>
  chain(text.search(LAYER_END))
    .thru((at) => (at < 0 ? size(text) : at))
    .value();

const before = (rows: Row[], boundary: number): number[][] =>
  map(
    filter(rows, (row) => row.at < boundary),
    (row) => row.cells,
  );

const after = (rows: Row[], boundary: number): number[][] =>
  map(
    filter(rows, (row) => row.at > boundary),
    (row) => row.cells,
  );

export const parseStructure = (text: string): Layers =>
  chain({ rows: rowsOf(text), boundary: boundaryOf(text) })
    .thru(({ rows, boundary }): Layers => ({
      tiles: before(rows, boundary),
      backTiles: after(rows, boundary),
    }))
    .value();
