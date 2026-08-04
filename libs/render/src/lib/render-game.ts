import type { GameState } from '@mander/engine';
import { TILE_SIZE } from '@mander/engine';
import { clamp, forEach } from 'lodash-es';

import { HILL_LAYERS } from './consts';
import { snapToDevicePixel } from './device-pixel';
import { drawChest } from './draw-chest';
import { drawEnemy } from './draw-enemy';
import { drawHillLayer } from './draw-hill-layer';
import { drawKey } from './draw-key';
import { drawPlayer } from './draw-player';
import { drawPortal } from './draw-portal';
import { drawSky } from './draw-sky';
import { drawTiles } from './draw-tiles';
import type { Focus } from './focus';
import type { Palette } from './palette';
import { playerFocus } from './player-focus';
import type { Viewport } from './viewport';

export const renderGame = (
  context: CanvasRenderingContext2D,
  state: GameState,
  palette: Palette,
  viewport: Viewport,
  focus: Focus = playerFocus(state),
): void => {
  const { level, player, enemies, time } = state;
  const cameraX = snapToDevicePixel(
    clamp(
      focus.x - viewport.width / 2,
      0,
      Math.max(0, level.width * TILE_SIZE - viewport.width),
    ),
    viewport.scale,
  );
  const cameraY = snapToDevicePixel(
    clamp(
      focus.y - viewport.height / 2,
      0,
      Math.max(0, level.height * TILE_SIZE - viewport.height),
    ),
    viewport.scale,
  );

  context.setTransform(viewport.scale, 0, 0, viewport.scale, 0, 0);
  drawSky(context, palette, viewport);
  forEach(HILL_LAYERS, (layer, index) =>
    drawHillLayer(context, cameraX, layer, palette.hills[index], viewport),
  );

  context.save();
  context.translate(-cameraX, -cameraY);
  drawTiles(context, level, palette, cameraX, cameraY, viewport);
  drawKey(context, state);
  drawChest(context, state);
  drawPortal(context, state);
  forEach(enemies, (enemy) => drawEnemy(context, enemy, time));
  drawPlayer(context, player, time);
  context.restore();
};
