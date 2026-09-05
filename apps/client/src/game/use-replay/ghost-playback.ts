import {
  advancePlayback,
  createPlayback,
  type GameState,
  isReplayFinished,
  type Replay,
  type ReplayPlayback,
} from '@mander/engine';
import { chain } from '@mander/utils';
import { filter, map } from 'lodash-es';
import { match } from 'ts-pattern';

export interface GhostPlayback {
  recording: Replay;
  playback: ReplayPlayback;
}

export const createGhosts = (
  recordings: Replay[],
  initialState: () => GameState,
): GhostPlayback[] =>
  map(recordings, (recording) => ({
    recording,
    playback: createPlayback(initialState()),
  }));

export const advanceGhosts = (
  ghosts: GhostPlayback[],
  deltaMs: number,
): GhostPlayback[] =>
  map(ghosts, (ghost) =>
    match(isReplayFinished(ghost.recording, ghost.playback))
      .with(true, () => ghost)
      .otherwise((): GhostPlayback => ({
        recording: ghost.recording,
        playback: advancePlayback(ghost.recording, ghost.playback, deltaMs),
      })),
  );

export const ghostStates = (ghosts: GhostPlayback[]): GameState[] =>
  chain(ghosts)
    .thru((all) =>
      filter(
        all,
        (ghost) => !isReplayFinished(ghost.recording, ghost.playback),
      ),
    )
    .thru((running) => map(running, (ghost) => ghost.playback.state))
    .value();
