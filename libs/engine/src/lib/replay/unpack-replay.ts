import { compact, map } from 'lodash-es';
import { match, P } from 'ts-pattern';

import type { Action } from '../actions/actions';
import type { GameLevel } from '../game-level';
import { ACTION_CODES } from './action-codes';
import type { PackedEntry, PackedReplay } from './packed-replay';
import type { RecordedAction } from './recorded-action';
import type { Replay } from './replay';

const levelAt = (levels: GameLevel[], index: number): GameLevel | undefined =>
  levels[index];

const unpackAction = (entry: PackedEntry, levels: GameLevel[]): Action | null =>
  match(ACTION_CODES[entry[1]])
    .with('TICK', (): Action => ({ type: 'TICK', deltaSeconds: entry[2] }))
    .with('CHOOSE_ITEM', (): Action => ({
      type: 'CHOOSE_ITEM',
      index: entry[2],
    }))
    .with('LOAD_LEVEL', (): Action | null =>
      match(levelAt(levels, entry[2]))
        .with(P.nonNullable, (level): Action => ({
          type: 'LOAD_LEVEL',
          level,
          levelIndex: entry[2],
        }))
        .otherwise(() => null),
    )
    .with('RESTART', (): Action | null =>
      match(levelAt(levels, 0))
        .with(P.nonNullable, (level): Action => ({ type: 'RESTART', level }))
        .otherwise(() => null),
    )
    .with(P.nullish, () => null)
    .otherwise((type): Action => ({ type }) as Action);

const unpackEntry = (
  entry: PackedEntry,
  levels: GameLevel[],
): RecordedAction | null =>
  match(unpackAction(entry, levels))
    .with(P.nonNullable, (action): RecordedAction => ({
      atMs: entry[0],
      action,
    }))
    .otherwise(() => null);

export const unpackReplay = (
  packed: PackedReplay,
  levels: GameLevel[],
): Replay => ({
  worldName: packed.worldName,
  startedAtMs: 0,
  entries: compact(map(packed.entries, (entry) => unpackEntry(entry, levels))),
});
