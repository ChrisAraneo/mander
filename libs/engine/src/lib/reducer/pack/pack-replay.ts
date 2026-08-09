import { map } from 'lodash-es';
import { match } from 'ts-pattern';

import type { Action } from '../../actions/types/actions';
import { codeOf } from './action-codes';
import type { PackedEntry, PackedReplay } from './types/packed-replay';
import type { Replay } from '../recorder/types/replay';

const packAction = (action: Action): number[] =>
  match(action)
    .with({ type: 'TICK' }, ({ deltaSeconds }) => [
      codeOf('TICK'),
      deltaSeconds,
    ])
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
  entries: map(replay.entries, ({ atMs, action }): PackedEntry => [
    atMs,
    ...packAction(action),
  ]),
});
