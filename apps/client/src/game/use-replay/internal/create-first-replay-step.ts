import { createPlayback, parseReplay } from '@mander/engine';
import { map } from 'lodash-es';
import { createStartState } from '../create-start-state';
import type { ReplayStage } from '../types/replay-stage';
import { createGhosts } from './create-ghosts';
import { createPlaybackStartFrame } from './create-playback-start-frame';
import type { ReplayStep } from './types/replay-step';

export const createFirstReplayStep = (stage: ReplayStage): ReplayStep => ({
  frame: createPlaybackStartFrame(
    createPlayback(createStartState(stage.levels, stage.score)),
  ),
  ghosts: createGhosts(
    map(stage.rivals, (run) => parseReplay(run.replay, stage.levels)),
    stage.levels,
    stage.score,
  ),
  alpha: 0,
});
