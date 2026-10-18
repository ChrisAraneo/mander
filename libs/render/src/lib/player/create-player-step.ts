import { isAlive, PLAYER_DEATH_SECONDS, PLAYER_WIDTH } from '@mander/engine';
import { type Player, chain } from '@mander/model';
import { createRotateStep } from '../canvas/create-rotate-step';
import { createScaleStep } from '../canvas/create-scale-step';
import { createSequenceStep } from '../canvas/create-sequence-step';
import { createTranslateStep } from '../canvas/create-translate-step';
import { drawRestore } from '../canvas/draw-restore';
import { drawSave } from '../canvas/draw-save';
import { computeDeathProgress } from '../compute-death-progress';
import { computeFacing } from '../compute-facing';
import type { CanvasStep } from '../types/canvas-step';
import { computePlayerSwing } from './internal/compute-player-swing';
import { HALF_HEIGHT } from './internal/consts';
import { createPlayerBodyStep } from './internal/create-player-body-step';
import { createPlayerHeadStep } from './internal/create-player-head-step';
import { createPlayerLegsStep } from './internal/create-player-legs-step';
import { getPlayerBodyColors } from './internal/get-player-body-colors';

const HALF_WIDTH = PLAYER_WIDTH / 2;

const DEATH_SPIN = Math.PI * 0.9;

export const createPlayerStep = (player: Player, time: number): CanvasStep =>
  chain({
    isDying: !isAlive(player),
    colors: getPlayerBodyColors(player),
    progress: computeDeathProgress(player.timers.death, PLAYER_DEATH_SECONDS),
    facing: computeFacing(player.statuses.isFacingRight),
    swing: computePlayerSwing(player, time),
  })
    .thru(({ isDying, colors, progress, facing, swing }) =>
      createSequenceStep([
        drawSave,
        createTranslateStep(
          player.position.x + HALF_WIDTH,
          player.position.y + HALF_HEIGHT,
        ),
        createRotateStep(-facing * progress * DEATH_SPIN),
        createScaleStep(facing, 1),
        createPlayerLegsStep(player.statuses.isGrounded, swing, colors),
        createPlayerBodyStep(swing, colors),
        createPlayerHeadStep(isDying, colors),
        drawRestore,
      ]),
    )
    .value();
