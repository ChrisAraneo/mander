import {
  type Clock,
  nextPlayback,
  type Replay,
  type ReplayPlayback,
} from '@mander/engine';
import { match, P } from 'ts-pattern';
import type { PlaybackFrame } from '../types/playback-frame';

const { number } = P;

const createFrameAfterStep = (
  replay: Replay,
  before: ReplayPlayback,
  now: Clock,
): PlaybackFrame => ({
  previous: before.state,
  playback: nextPlayback(replay, before, 1, now),
});

export const nextFrames = (
  replay: Replay,
  frame: PlaybackFrame,
  steps: number,
  now: Clock,
): PlaybackFrame =>
  match(steps)
    .with(number.lte(0), () => frame)
    .otherwise((count) =>
      createFrameAfterStep(
        replay,
        nextPlayback(replay, frame.playback, count - 1, now),
        now,
      ),
    );
