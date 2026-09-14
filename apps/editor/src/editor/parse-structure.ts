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

const parseCells = (row: string): number[] =>
  map(compact(map(split(row, ','), trim)), parseAlias);

const parseRows = (text: string): Row[] =>
  map([...text.matchAll(ROW)], (match): Row => ({
    cells: parseCells(match[1]),
    at: match.index ?? 0,
  }));

// the two layers are told apart by where the front one is closed off
const findBoundary = (text: string): number =>
  chain(text.search(LAYER_END))
    .thru((at) => (at < 0 ? size(text) : at))
    .value();

const takeBefore = (rows: Row[], boundary: number): number[][] =>
  map(
    filter(rows, (row) => row.at < boundary),
    (row) => row.cells,
  );

const takeAfter = (rows: Row[], boundary: number): number[][] =>
  map(
    filter(rows, (row) => row.at > boundary),
    (row) => row.cells,
  );

export const parseStructure = (text: string): Layers =>
  chain({ rows: parseRows(text), boundary: findBoundary(text) })
    .thru(({ rows, boundary }): Layers => ({
      tiles: takeBefore(rows, boundary),
      backTiles: takeAfter(rows, boundary),
    }))
    .value();
