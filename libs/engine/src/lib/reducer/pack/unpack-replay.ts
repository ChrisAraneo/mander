import { compact, map } from 'lodash-es';
import { match, P } from 'ts-pattern';

import type { RecordableAction } from '../../actions/actions';
import type { GameLevel } from '../../types/game-level';
import { ACTION_CODES } from './action-codes';
import type { PackedEntry, PackedReplay } from './types/packed-replay';
import type { RecordedAction } from '../recorder/types/recorded-action';
import type { Replay } from '../recorder/types/replay';

const { nonNullable, nullish } = P;

const levelAt = (levels: GameLevel[], index: number): GameLevel | undefined =>
  levels[index];

const unpackAction = (
  entry: PackedEntry,
  levels: GameLevel[],
): RecordableAction | null =>
  match(ACTION_CODES[entry[1]])
    .with('CHOOSE_ITEM', (): RecordableAction => ({
      type: 'CHOOSE_ITEM',
      index: entry[2],
    }))
    .with('LOAD_LEVEL', (): RecordableAction | null =>
      match(levelAt(levels, entry[2]))
        .with(nonNullable, (level): RecordableAction => ({
          type: 'LOAD_LEVEL',
          level,
          levelIndex: entry[2],
        }))
        .otherwise(() => null),
    )
    .with('RESTART', (): RecordableAction | null =>
      match(levelAt(levels, 0))
        .with(nonNullable, (level): RecordableAction => ({
          type: 'RESTART',
          level,
        }))
        .otherwise(() => null),
    )
    .with(nullish, () => null)
    .otherwise((type): RecordableAction => ({ type }) as RecordableAction);

const unpackEntry = (
  entry: PackedEntry,
  levels: GameLevel[],
): RecordedAction | null =>
  match(unpackAction(entry, levels))
    .with(nonNullable, (action): RecordedAction => ({
      atStep: entry[0],
      action,
    }))
    .otherwise(() => null);

export const unpackReplay = (
  packed: PackedReplay,
  levels: GameLevel[],
): Replay => ({
  worldName: packed.worldName,
  steps: packed.steps,
  entries: compact(map(packed.entries, (entry) => unpackEntry(entry, levels))),
});
