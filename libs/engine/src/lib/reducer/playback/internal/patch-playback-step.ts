import { map, slice } from 'lodash-es';
import { pipe } from 'remeda';
import { patchGameState } from '../../patch-game-state';
import type { Replay } from '../../recorder/types/replay';
import type { Action } from '../../types/action';
import type { Clock } from '../../types/clock';
import type { ReplayPlayback } from '../types/replay-playback';
import { findDueEntryEnd } from './find-due-entry-end';

const TICK: Action = { type: 'TICK' };

export const patchPlaybackStep = (
  replay: Replay,
  playback: ReplayPlayback,
  now: Clock,
): ReplayPlayback =>
  pipe(
    findDueEntryEnd(replay.entries, playback.index, playback.step),
    (index) => ({
      index,
      due: map(
        slice(replay.entries, playback.index, index),
        (entry) => entry.action,
      ),
    }),
    ({ index, due }): ReplayPlayback => ({
      step: playback.step + 1,
      index,
      state: patchGameState(playback.state, [...due, TICK], now),
    }),
  );
