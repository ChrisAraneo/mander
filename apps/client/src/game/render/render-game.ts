import { type GameState, PLAYER_HEIGHT, PLAYER_WIDTH } from '@mander/engine';
import { TILE_SIZE } from '@mander/generator';
import { clamp, forEach, round } from 'lodash-es';

import { VIEW_HEIGHT, VIEW_WIDTH } from './constants';
import { drawChest } from './draw-chest';
import { drawEnemy } from './draw-enemy';
import { drawHillLayer } from './draw-hill-layer';
import { drawKey } from './draw-key';
import { drawPlayer } from './draw-player';
import { drawPortal } from './draw-portal';
import { drawSky } from './draw-sky';
import { drawTiles } from './draw-tiles';

export function renderGame(
  context: CanvasRenderingContext2D,
  state: GameState,
): void {
  const { level, player } = state;
  const cameraX = clamp(
    player.x + PLAYER_WIDTH / 2 - VIEW_WIDTH / 2,
    0,
    Math.max(0, level.width * TILE_SIZE - VIEW_WIDTH),
  );
  const cameraY = clamp(
    player.y + PLAYER_HEIGHT / 2 - VIEW_HEIGHT / 2,
    0,
    Math.max(0, level.height * TILE_SIZE - VIEW_HEIGHT),
  );

  drawSky(context);
  drawHillLayer(context, cameraX, 0.2, '#243447', 46, 290);
  drawHillLayer(context, cameraX, 0.45, '#1d2a38', 58, 372);

  context.save();
  context.translate(-round(cameraX), -round(cameraY));
  drawTiles(context, level, cameraX, cameraY);
  drawKey(context, state);
  drawChest(context, state);
  drawPortal(context, state);
  forEach(state.enemies, (enemy) => drawEnemy(context, enemy, state.time));
  drawPlayer(context, player, state.time);
  context.restore();
}
