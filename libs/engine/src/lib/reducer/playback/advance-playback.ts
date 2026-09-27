import { chain } from '@mander/utils';
import { reduce as fold, map, slice, times } from 'lodash-es';
import { match } from 'ts-pattern';

import type { Action } from '../../actions/actions';
import { applyActions } from '../apply-actions';
import type { RecordedAction } from '../recorder/types/recorded-action';
import type { Replay } from '../recorder/types/replay';
import { isReplayFinished } from './is-replay-finished';
import type { ReplayPlayback } from './types/replay-playback';

const TICK: Action = { type: 'TICK' };

const getDueEnd = (
  entries: RecordedAction[],
  index: number,
  step: number,
): number =>
  match<RecordedAction | undefined>(entries[index])
    .with({ atStep: step }, () => getDueEnd(entries, index + 1, step))
    .otherwise(() => index);

const stepOnce = (replay: Replay, playback: ReplayPlayback): ReplayPlayback =>
  chain(getDueEnd(replay.entries, playback.index, playback.step))
    .thru((index) => ({
      index,
      due: map(
        slice(replay.entries, playback.index, index),
        (entry) => entry.action,
      ),
    }))
    .thru(({ index, due }): ReplayPlayback => ({
      step: playback.step + 1,
      index,
      state: applyActions(playback.state, [...due, TICK]),
    }))
    .value();

export const advancePlayback = (
  replay: Replay,
  playback: ReplayPlayback,
  steps: number,
): ReplayPlayback =>
  fold(
    times(Math.max(0, steps)),
    (current) =>
      match(isReplayFinished(replay, current))
        .with(true, () => current)
        .otherwise(() => stepOnce(replay, current)),
    playback,
  );
