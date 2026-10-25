import type { Player } from '@mander/model';
import { createConditionalStep } from '../../canvas/create-conditional-step';
import { createStyleStep } from '../../canvas/create-style-step';
import type { CanvasStep } from '../../types/canvas-step';
import { computeInvincibleAlpha } from './compute-invincible-alpha';
import { isPlayerInvincible } from './is-player-invincible';

export const createPlayerAlphaStep = (
  player: Player,
  time: number,
): CanvasStep =>
  createConditionalStep(
    isPlayerInvincible(player),
    createStyleStep({ globalAlpha: computeInvincibleAlpha(time) }),
  );
