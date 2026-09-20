import { map } from 'lodash-es';
import { findValidSpawnRows } from './find-valid-spawn-rows';
import type { PlayerSpawnCandidates, PlayerSpawnColumns } from './interfaces';

export const createPlayerSpawnCandidates = ({
  tiles,
  columns,
}: PlayerSpawnColumns): PlayerSpawnCandidates => ({
  tiles,
  candidates: map(columns, (column) => ({
    column,
    rows: findValidSpawnRows(tiles, column),
  })),
});
