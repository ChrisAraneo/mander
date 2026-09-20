import type { Tile } from '@mander/model';
import { map } from 'lodash-es';
import { findValidSpawnRows } from './find-valid-spawn-rows';

export interface PlayerSpawnCandidate {
  column: number;
  rows: number[];
}

export const createPlayerSpawnCandidates = (
  tiles: Tile[][],
  columns: number[],
): PlayerSpawnCandidate[] =>
  map(columns, (column) => ({
    column,
    rows: findValidSpawnRows(tiles, column),
  }));
