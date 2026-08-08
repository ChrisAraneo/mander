import { map, slice } from 'lodash-es';

import type { RecordedAction } from './types/recorded-action';
import { applyActions } from './apply-actions';
import type { Replay } from './types/replay';
import type { ReplayPlayback } from './types/replay-playback';

const dueIndex = (
  entries: RecordedAction[],
  index: number,
  untilMs: number,
): number => {
  let next = index;
  while (next < entries.length && entries[next].atMs <= untilMs) next++;
  return next;
};

export const advancePlayback = (
  replay: Replay,
  playback: ReplayPlayback,
  deltaMs: number,
): ReplayPlayback => {
  const elapsedMs = playback.elapsedMs + Math.max(0, deltaMs);
  const index = dueIndex(replay.entries, playback.index, elapsedMs);
  const due = map(
    slice(replay.entries, playback.index, index),
    (entry) => entry.action,
  );

  return { elapsedMs, index, state: applyActions(playback.state, due) };
};
