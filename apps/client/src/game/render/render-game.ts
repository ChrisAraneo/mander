import { type GameState, PLAYER_HEIGHT, PLAYER_WIDTH } from '@mander/engine';
import { TILE_SIZE } from '@mander/generator';
import { clamp, forEach, round } from 'lodash-es';

import { HILL_LAYERS } from './constants';
import { drawChest } from './draw-chest';
import { drawEnemy } from './draw-enemy';
import { drawHillLayer } from './draw-hill-layer';
import { drawKey } from './draw-key';
import { drawPlayer } from './draw-player';
import { drawPortal } from './draw-portal';
import { drawSky } from './draw-sky';
import { drawTiles } from './draw-tiles';
import type { Viewport } from './viewport';

export const renderGame = (
  context: CanvasRenderingContext2D,
  state: GameState,
  viewport: Viewport,
): void => {
  const { level, player, enemies, time } = state;
  const cameraX = clamp(
    player.x + PLAYER_WIDTH / 2 - viewport.width / 2,
    0,
    Math.max(0, level.width * TILE_SIZE - viewport.width),
  );
  const cameraY = clamp(
    player.y + PLAYER_HEIGHT / 2 - viewport.height / 2,
    0,
    Math.max(0, level.height * TILE_SIZE - viewport.height),
  );

  context.setTransform(viewport.scale, 0, 0, viewport.scale, 0, 0);
  drawSky(context, level.palette, viewport);
  forEach(HILL_LAYERS, (layer, index) =>
    drawHillLayer(context, cameraX, layer, level.palette.hills[index], viewport),
  );

  context.save();
  context.translate(-round(cameraX), -round(cameraY));
  drawTiles(context, level, cameraX, cameraY, viewport);
  drawKey(context, state);
  drawChest(context, state);
  drawPortal(context, state);
  forEach(enemies, (enemy) => drawEnemy(context, enemy, time));
  drawPlayer(context, player, time);
  context.restore();
};
