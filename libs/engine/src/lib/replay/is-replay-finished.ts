import type { Replay } from './replay';
import type { ReplayPlayback } from './replay-playback';

export const isReplayFinished = (
  replay: Replay,
  playback: ReplayPlayback,
): boolean => playback.index >= replay.entries.length;
