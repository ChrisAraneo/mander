import { type Clock, nextPlayback, type Replay } from '@mander/engine';
import { match, P } from 'ts-pattern';
import type { PlaybackFrame } from '../types/playback-frame';
import { createFrameAfterStep } from './create-frame-after-step';

const { number } = P;

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
