import { TILE_SPAWN } from '@mander/model';
import { map } from 'lodash-es';
import { match, P } from 'ts-pattern';
import type { FoundPlayerSpawn, PlayerSpawnPatches } from './interfaces';

const { nullish } = P;

export const createPlayerSpawnPatches = ({
  tiles,
  found,
}: FoundPlayerSpawn): PlayerSpawnPatches => ({
  tiles,
  patches: match(found)
    .with(nullish, () => [])
    .otherwise(({ column, rows }) =>
      map(rows, (row) => ({
        row,
        column,
        tile: TILE_SPAWN,
      })),
    ),
});
