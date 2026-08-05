import type { GameState } from '@mander/engine';
import { TILE_SIZE } from '@mander/engine';
import { clamp, forEach } from 'lodash-es';

import { drawChest } from '../chest/draw-chest';
import { drawDiamonds } from '../diamond/draw-diamond';
import { drawEnemy } from '../enemies/draw-enemy';
import type { Focus } from '../focus/focus';
import { playerFocus } from '../focus/player-focus';
import { HILL_LAYERS } from '../hill/consts';
import { drawHillLayer } from '../hill/draw-hill-layer';
import { drawKey } from '../key/draw-key';
import type { Palette } from '../palette/palette';
import { drawPlayer } from '../player/draw-player';
import { drawPortal } from '../portal/draw-portal';
import { drawSky } from '../sky/draw-sky';
import { drawTiles } from '../tile/draw-tiles';
import { snapToDevicePixel } from '../viewport/device-pixel';
import type { Viewport } from '../viewport/viewport';

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
  drawDiamonds(context, state);
  drawKey(context, state);
  drawChest(context, state);
  drawPortal(context, state);
  forEach(enemies, (enemy) => drawEnemy(context, enemy, time));
  drawPlayer(context, player, time);
  context.restore();
};
