import type { ReplayPlayback } from '@mander/engine';
import type { PlaybackFrame } from '../types/playback-frame';

export const createPlaybackStartFrame = (
  playback: ReplayPlayback,
): PlaybackFrame => ({
  previous: playback.state,
  playback,
});
