import { createPlayback, type GameLevel, type Replay } from '@mander/engine';
import { map } from 'lodash-es';
import { pipe } from 'remeda';
import { createStartState } from '../create-start-state';
import type { GhostPlayback } from '../types/ghost-playback';
import { createPlaybackStartFrame } from './create-playback-start-frame';

export const createGhosts = (
  recordings: Replay[],
  levels: GameLevel[],
  score: number,
): GhostPlayback[] =>
  map(recordings, (recording) =>
    pipe(
      createStartState(levels, score),
      createPlayback,
      createPlaybackStartFrame,
      (frame): GhostPlayback => ({ ...frame, recording }),
    ),
  );
