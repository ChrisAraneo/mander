import type { GameState } from '@mander/engine';
import { TILE_SIZE } from '@mander/engine';
import { chain, clamp, map } from 'lodash-es';

import {
  restore,
  run,
  save,
  setTransform,
  translate,
} from '../canvas/commands';
import { paint, sequence } from '../canvas/paint';
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

const cameraAxis = (
  focusAt: number,
  viewSize: number,
  worldSize: number,
  scale: number,
): number =>
  snapToDevicePixel(
    clamp(focusAt - viewSize / 2, 0, Math.max(0, worldSize - viewSize)),
    scale,
  );

export const renderGame = (
  context: CanvasRenderingContext2D,
  state: GameState,
  palette: Palette,
  viewport: Viewport,
  focus: Focus = playerFocus(state),
): void =>
  chain(state.level)
    .thru((level) => ({
      cameraX: cameraAxis(
        focus.x,
        viewport.width,
        level.width * TILE_SIZE,
        viewport.scale,
      ),
      cameraY: cameraAxis(
        focus.y,
        viewport.height,
        level.height * TILE_SIZE,
        viewport.scale,
      ),
    }))
    .thru(({ cameraX, cameraY }) =>
      paint(
        context,
        setTransform(viewport.scale, 0, 0, viewport.scale, 0, 0),
        run((target) => drawSky(target, palette, viewport)),
        sequence(
          map(HILL_LAYERS, (layer, index) =>
            run((target) =>
              drawHillLayer(
                target,
                cameraX,
                layer,
                palette.hills[index],
                viewport,
              ),
            ),
          ),
        ),
        save,
        translate(-cameraX, -cameraY),
        run((target) =>
          drawTiles(target, state.level, palette, cameraX, cameraY, viewport),
        ),
        run((target) => drawDiamonds(target, state)),
        run((target) => drawKey(target, state)),
        run((target) => drawChest(target, state)),
        run((target) => drawPortal(target, state)),
        sequence(
          map(state.enemies, (enemy) =>
            run((target) => drawEnemy(target, enemy, state.time)),
          ),
        ),
        run((target) => drawPlayer(target, state.player, state.time)),
        restore,
      ),
    )
    .value();
