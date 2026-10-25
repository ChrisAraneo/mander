import type { GameState } from '@mander/engine';
import { computePlayerFocus } from '@mander/render';
import { drawCanvasGame } from '../canvas';
import { getLevelGhosts } from './internal/get-level-ghosts';
import type { ReplayStage } from './types/replay-stage';

export const drawStageState = (
  stage: ReplayStage,
  state: GameState,
  ghosts: GameState[],
): void =>
  drawCanvasGame(
    stage.cell,
    state,
    stage.palette,
    computePlayerFocus(state),
    getLevelGhosts(state, ghosts),
  );
