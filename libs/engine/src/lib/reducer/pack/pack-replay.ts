import { map } from 'lodash-es';
import { match } from 'ts-pattern';

import type { RecordableAction } from '../../actions/actions';
import { codeOf } from './action-codes';
import type { PackedEntry, PackedReplay } from './types/packed-replay';
import type { Replay } from '../recorder/types/replay';

const packAction = (action: RecordableAction): number[] =>
  match(action)
    .with({ type: 'CHOOSE_ITEM' }, ({ index }) => [
      codeOf('CHOOSE_ITEM'),
      index,
    ])
    .with({ type: 'LOAD_LEVEL' }, ({ levelIndex }) => [
      codeOf('LOAD_LEVEL'),
      levelIndex,
    ])
    .otherwise(({ type }) => [codeOf(type)]);

export const packReplay = (replay: Replay): PackedReplay => ({
  worldName: replay.worldName,
  steps: replay.steps,
  entries: map(replay.entries, ({ atStep, action }): PackedEntry => [
    atStep,
    ...packAction(action),
  ]),
});
