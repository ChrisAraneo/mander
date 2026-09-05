import { chain } from '@mander/utils';
import { filter, find, take } from 'lodash-es';
import { match, P } from 'ts-pattern';

import { GHOSTS_SHOWN } from './consts';
import { playableWorlds } from './playable-worlds';
import type { RunRecord, SaveData } from './save-data';

const { nonNullable } = P;

export const ghostRuns = (
  save: SaveData,
  name: string,
  excludeId: string,
): RunRecord[] =>
  chain(playableWorlds(save))
    .thru((worlds) =>
      match(find(worlds, { name }))
        .with(nonNullable, (world) => world.replays)
        .otherwise((): RunRecord[] => []),
    )
    .thru((replays) => filter(replays, (run) => run.id !== excludeId))
    .thru((replays) => take(replays, GHOSTS_SHOWN))
    .value();
