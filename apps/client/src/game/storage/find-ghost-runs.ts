import { filter, find, take } from 'lodash-es';
import { pipe } from 'remeda';
import { match, P } from 'ts-pattern';
import { GHOSTS_SHOWN } from './consts';
import { getPlayableWorlds } from './get-playable-worlds';
import type { RunRecord } from './types/run-record';
import type { SaveData } from './types/save-data';

const { nonNullable } = P;

export const findGhostRuns = (
  save: SaveData,
  name: string,
  excludeId: string,
): RunRecord[] =>
  pipe(
    save,
    getPlayableWorlds,
    (worlds) =>
      match(find(worlds, { name }))
        .with(nonNullable, (world) => world.replays)
        .otherwise((): RunRecord[] => []),
    (replays) => filter(replays, (run) => run.id !== excludeId),
    (replays) => take(replays, GHOSTS_SHOWN),
  );
