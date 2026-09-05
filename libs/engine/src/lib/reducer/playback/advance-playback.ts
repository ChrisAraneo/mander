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

/**
 * Entries are in step order, so the inputs due on a step are the run of entries
 * starting at `index` that carry it. Recursion depth is the number of inputs
 * seen within one step, which is a keypress or two.
 */
const dueEnd = (
  entries: RecordedAction[],
  index: number,
  step: number,
): number =>
  match<RecordedAction | undefined>(entries[index])
    .with({ atStep: step }, () => dueEnd(entries, index + 1, step))
    .otherwise(() => index);

const stepOnce = (replay: Replay, playback: ReplayPlayback): ReplayPlayback =>
  chain(dueEnd(replay.entries, playback.index, playback.step))
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

/**
 * Runs whole fixed steps, so a replay lands on exactly the states the run did.
 * There is no resampling against the wall clock: how many steps to take is the
 * caller's decision, and the frame clock is what makes that decision.
 */
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
