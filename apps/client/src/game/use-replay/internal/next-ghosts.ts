import { type Clock, isReplayFinished } from '@mander/engine';
import { map } from 'lodash-es';
import { match } from 'ts-pattern';
import type { GhostPlayback } from '../types/ghost-playback';
import { nextFrames } from './next-frames';

export const nextGhosts = (
  ghosts: GhostPlayback[],
  steps: number,
  now: Clock,
): GhostPlayback[] =>
  map(ghosts, (ghost) =>
    match(isReplayFinished(ghost.recording, ghost.playback))
      .with(true, () => ghost)
      .otherwise((): GhostPlayback => ({
        ...nextFrames(ghost.recording, ghost, steps, now),
        recording: ghost.recording,
      })),
  );
