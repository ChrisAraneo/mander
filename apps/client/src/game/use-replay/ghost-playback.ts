import {
  createPlayback,
  type GameState,
  isReplayFinished,
  type Replay,
} from '@mander/engine';
import { interpolateState } from '@mander/render';
import { chain } from '@mander/utils';
import { filter, map } from 'lodash-es';
import { match } from 'ts-pattern';

import {
  advanceFrames,
  type PlaybackFrame,
  startFrame,
} from './playback-frame';

export interface GhostPlayback extends PlaybackFrame {
  recording: Replay;
}

export const createGhosts = (
  recordings: Replay[],
  initialState: () => GameState,
): GhostPlayback[] =>
  map(recordings, (recording) =>
    chain(startFrame(createPlayback(initialState())))
      .thru((frame): GhostPlayback => ({ ...frame, recording }))
      .value(),
  );

/**
 * Every ghost takes the same steps on the same frame, so they run in lockstep
 * with the replay they are shown against rather than each on its own clock.
 */
export const advanceGhosts = (
  ghosts: GhostPlayback[],
  steps: number,
): GhostPlayback[] =>
  map(ghosts, (ghost) =>
    match(isReplayFinished(ghost.recording, ghost.playback))
      .with(true, () => ghost)
      .otherwise((): GhostPlayback => ({
        ...advanceFrames(ghost.recording, ghost, steps),
        recording: ghost.recording,
      })),
  );

export const ghostStates = (
  ghosts: GhostPlayback[],
  alpha: number,
): GameState[] =>
  chain(ghosts)
    .thru((all) =>
      filter(
        all,
        (ghost) => !isReplayFinished(ghost.recording, ghost.playback),
      ),
    )
    .thru((running) =>
      map(running, (ghost) =>
        interpolateState(ghost.previous, ghost.playback.state, alpha),
      ),
    )
    .value();
