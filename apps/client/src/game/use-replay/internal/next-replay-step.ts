import type { Clock, Replay } from '@mander/engine';
import type { GhostPlayback } from '../types/ghost-playback';
import type { PlaybackFrame } from '../types/playback-frame';
import { nextFrames } from './next-frames';
import { nextGhosts } from './next-ghosts';
import type { ReplayStep } from './types/replay-step';

export const nextReplayStep = (
  recording: Replay,
  frame: PlaybackFrame,
  ghosts: GhostPlayback[],
  steps: number,
  alpha: number,
  now: Clock,
): ReplayStep => ({
  frame: nextFrames(recording, frame, steps, now),
  ghosts: nextGhosts(ghosts, steps, now),
  alpha,
});
