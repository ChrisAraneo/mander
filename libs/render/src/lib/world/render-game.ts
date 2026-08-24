import type { GameState } from '@mander/engine';
import { TILE_SIZE } from '@mander/model';
import { chain } from '@mander/utils';
import { clamp, map } from 'lodash-es';

import {
  paint,
  restore,
  run,
  save,
  sequence,
  setTransform,
  translate,
} from '../canvas';
import { drawBullets } from '../bullet';
import { drawCannon, drawCannonballs } from '../cannon';
import { drawChest } from '../chest';
import { drawGems } from '../gem';
import { drawEnemy } from '../enemies';
import { drawFireballs, drawPlayerFireballs } from '../fireball';
import { type Focus, playerFocus } from '../focus';
import { drawHillLayer, HILL_LAYERS } from '../hill';
import { drawKey } from '../key';
import type { Palette } from '../palette';
import { drawPlayer } from '../player';
import { drawPortal } from '../portal';
import { drawSky } from '../sky';
import { drawFallingSpike } from '../spike';
import { drawTiles } from '../tile';
import { snapToDevicePixel, type Viewport } from '../viewport';

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
        sequence(
          map(state.cannons, (cannon) =>
            run((target) => drawCannon(target, cannon)),
          ),
        ),
        run((target) => drawGems(target, state)),
        run((target) => drawKey(target, state)),
        run((target) => drawChest(target, state)),
        run((target) => drawPortal(target, state)),
        sequence(
          map(state.enemies, (enemy) =>
            run((target) => drawEnemy(target, enemy, state.time)),
          ),
        ),
        sequence(
          map(state.fallingSpikes, (spike) =>
            run((target) => drawFallingSpike(target, spike)),
          ),
        ),
        run((target) => drawPlayer(target, state.player, state.time)),
        run((target) => drawCannonballs(target, state)),
        run((target) => drawFireballs(target, state)),
        run((target) => drawPlayerFireballs(target, state)),
        run((target) => drawBullets(target, state)),
        restore,
      ),
    )
    .value();
