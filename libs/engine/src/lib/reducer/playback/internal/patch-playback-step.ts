import { chain } from '@mander/model';
import { map, slice } from 'lodash-es';
import { applyActions } from '../../apply-actions';
import type { Replay } from '../../recorder/types/replay';
import type { Action } from '../../types/action';
import type { ReplayPlayback } from '../types/replay-playback';
import { findDueEntryEnd } from './find-due-entry-end';

const TICK: Action = { type: 'TICK' };

export const patchPlaybackStep = (
  replay: Replay,
  playback: ReplayPlayback,
): ReplayPlayback =>
  chain(findDueEntryEnd(replay.entries, playback.index, playback.step))
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
