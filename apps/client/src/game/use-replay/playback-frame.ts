import {
  advancePlayback,
  type GameState,
  type Replay,
  type ReplayPlayback,
} from '@mander/engine';
import { chain } from '@mander/utils';
import { match, P } from 'ts-pattern';

/**
 * A playback and the state it was in one step ago. The renderer draws somewhere
 * between the two, so motion stays continuous on the frames that buy no step.
 */
export interface PlaybackFrame {
  previous: GameState;
  playback: ReplayPlayback;
}

export const startFrame = (playback: ReplayPlayback): PlaybackFrame => ({
  previous: playback.state,
  playback,
});

/**
 * A frame that buys no steps leaves both states alone on purpose: the alpha
 * keeps rising against the same pair, which is what carries the motion on
 * instead of freezing it.
 */
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
