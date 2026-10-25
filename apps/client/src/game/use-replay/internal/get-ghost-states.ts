import { type GameState, isReplayFinished } from '@mander/engine';
import { computeInterpolatedState } from '@mander/render';
import { filter, map } from 'lodash-es';
import { pipe } from 'remeda';
import type { GhostPlayback } from '../types/ghost-playback';

export const getGhostStates = (
  ghosts: GhostPlayback[],
  alpha: number,
): GameState[] =>
  pipe(
    ghosts,
    (all) =>
      filter(
        all,
        (ghost) => !isReplayFinished(ghost.recording, ghost.playback),
      ),
    (running) =>
      map(running, (ghost) =>
        computeInterpolatedState(ghost.previous, ghost.playback.state, alpha),
      ),
  );
