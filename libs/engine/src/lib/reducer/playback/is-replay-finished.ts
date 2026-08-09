import type { Replay } from '../recorder/types/replay';
import type { ReplayPlayback } from './types/replay-playback';

export const isReplayFinished = (
  replay: Replay,
  playback: ReplayPlayback,
): boolean => playback.index >= replay.entries.length;
