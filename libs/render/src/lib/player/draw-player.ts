import type { Player } from '@mander/model';
import { draw } from '../canvas/draw';
import { createPlayerStep } from './internal/create-player-step';

export const drawPlayer = (
  context: CanvasRenderingContext2D,
  player: Player,
  time: number,
): void => draw(context, createPlayerStep(player, time));
