import { GHOST_ALPHA } from './consts';
import { drawPlayer } from './draw-player';
import type { Ghost } from './ghost';

export const drawGhost = (
  context: CanvasRenderingContext2D,
  ghost: Ghost,
): void => drawPlayer(context, ghost.player, ghost.time, GHOST_ALPHA);
