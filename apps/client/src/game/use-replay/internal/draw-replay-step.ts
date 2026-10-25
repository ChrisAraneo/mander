import { computeInterpolatedState } from '@mander/render';
import { drawStageState } from '../draw-stage-state';
import type { ReplaySession } from '../types/replay-session';
import { getGhostStates } from './get-ghost-states';
import type { ReplayStep } from './types/replay-step';

export const drawReplayStep = (
  session: ReplaySession,
  step: ReplayStep,
): void =>
  drawStageState(
    session.stage,
    computeInterpolatedState(
      step.frame.previous,
      step.frame.playback.state,
      step.alpha,
    ),
    getGhostStates(step.ghosts, step.alpha),
  );
