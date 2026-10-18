import type { Ghost } from '../types/ghost';
import { drawPlayer } from './draw-player';

export const drawGhost = (
  context: CanvasRenderingContext2D,
  ghost: Ghost,
): void => drawPlayer(context, ghost.player, ghost.time);
