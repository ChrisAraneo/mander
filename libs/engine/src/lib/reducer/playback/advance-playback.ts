import { chain } from '@mander/utils';
import { map, size, slice } from 'lodash-es';
import { match } from 'ts-pattern';

import type { RecordedAction } from '../recorder/types/recorded-action';
import { applyActions } from '../apply-actions';
import type { Replay } from '../recorder/types/replay';
import type { ReplayPlayback } from './types/replay-playback';

const dueIndex = (
  entries: RecordedAction[],
  index: number,
  untilMs: number,
): number =>
  chain(entries)
    .slice(index)
    .findIndex((entry) => entry.atMs > untilMs)
    .thru((offset) =>
      match(offset)
        .with(-1, () => size(entries))
        .otherwise((found) => index + found),
    )
    .value();

export const advancePlayback = (
  replay: Replay,
  playback: ReplayPlayback,
  deltaMs: number,
): ReplayPlayback =>
  chain(playback.elapsedMs + Math.max(0, deltaMs))
    .thru((elapsedMs) => ({
      elapsedMs,
      index: dueIndex(replay.entries, playback.index, elapsedMs),
    }))
    .thru(({ elapsedMs, index }) => ({
      elapsedMs,
      index,
      state: applyActions(
        playback.state,
        map(
          slice(replay.entries, playback.index, index),
          (entry) => entry.action,
        ),
      ),
    }))
    .value();
