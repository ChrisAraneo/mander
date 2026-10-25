import {
  type Clock,
  nextPlayback,
  type Replay,
  type ReplayPlayback,
} from '@mander/engine';
import type { PlaybackFrame } from '../types/playback-frame';

export const createFrameAfterStep = (
  replay: Replay,
  before: ReplayPlayback,
  now: Clock,
): PlaybackFrame => ({
  previous: before.state,
  playback: nextPlayback(replay, before, 1, now),
});
