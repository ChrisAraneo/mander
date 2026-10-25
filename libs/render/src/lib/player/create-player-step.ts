import { isAlive, PLAYER_DEATH_SECONDS } from '@mander/engine';
import { type Player } from '@mander/model';
import { createSequenceStep } from '../canvas/create-sequence-step';
import { drawRestore } from '../canvas/draw-restore';
import { drawSave } from '../canvas/draw-save';
import { computeDeathProgress } from '../compute-death-progress';
import { computeFacing } from '../compute-facing';
import type { CanvasStep } from '../types/canvas-step';
import { computePlayerSwing } from './internal/compute-player-swing';
import { createPlayerAlphaStep } from './internal/create-player-alpha-step';
import { createPlayerFigureStep } from './internal/create-player-figure-step';
import { createPlayerTransformStep } from './internal/create-player-transform-step';
import { getPlayerBodyColors } from './internal/get-player-body-colors';

export const createPlayerStep = (player: Player, time: number): CanvasStep =>
  createSequenceStep([
    drawSave,
    createPlayerAlphaStep(player, time),
    createPlayerTransformStep(
      player.position,
      computeFacing(player.statuses.isFacingRight),
      computeDeathProgress(player.timers.death, PLAYER_DEATH_SECONDS),
    ),
    createPlayerFigureStep(
      player.statuses.isGrounded,
      !isAlive(player),
      computePlayerSwing(player, time),
      getPlayerBodyColors(player),
    ),
    drawRestore,
  ]);
