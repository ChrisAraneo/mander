import {
  advancePlayback,
  type GameState,
  type Replay,
  type ReplayPlayback,
} from '@mander/engine';
import { chain } from '@mander/utils';
import { match, P } from 'ts-pattern';

export interface PlaybackFrame {
  previous: GameState;
  playback: ReplayPlayback;
}

export const createStartFrame = (playback: ReplayPlayback): PlaybackFrame => ({
  previous: playback.state,
  playback,
});

export const advanceFrames = (
  replay: Replay,
  frame: PlaybackFrame,
  steps: number,
): PlaybackFrame =>
  match(steps)
    .with(P.number.lte(0), () => frame)
    .otherwise((count) =>
      chain(advancePlayback(replay, frame.playback, count - 1))
        .thru((mid): PlaybackFrame => ({
          previous: mid.state,
          playback: advancePlayback(replay, mid, 1),
        }))
        .value(),
    );
