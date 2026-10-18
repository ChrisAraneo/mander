import type { GameState } from '@mander/engine';
import { TILE_SIZE } from '@mander/model';
import { chain } from '@mander/utils';
import { map } from 'lodash-es';
import { drawBullets } from '../bullet/draw-bullets';
import { drawCannon } from '../cannon/draw-cannon';
import { drawCannonballs } from '../cannon/draw-cannonballs';
import { createActionStep } from '../canvas/create-action-step';
import { createSequenceStep } from '../canvas/create-sequence-step';
import { createSetTransformStep } from '../canvas/create-set-transform-step';
import { createTranslateStep } from '../canvas/create-translate-step';
import { draw } from '../canvas/draw';
import { drawRestore } from '../canvas/draw-restore';
import { drawSave } from '../canvas/draw-save';
import { drawChest } from '../chest/draw-chest';
import { drawEnemy } from '../enemies/draw-enemy';
import { drawFireballs } from '../fireball/draw-fireballs';
import { drawPlayerFireballs } from '../fireball/draw-player-fireballs';
import { getPlayerFocus } from '../focus/get-player-focus';
import { drawGems } from '../gem/draw-gems';
import { HILL_LAYERS } from '../hill/consts';
import { drawHillLayer } from '../hill/draw-hill-layer';
import { drawKey } from '../key/draw-key';
import { drawGhost } from '../player/draw-ghost';
import { drawPlayer } from '../player/draw-player';
import { drawPortal } from '../portal/draw-portal';
import { drawSky } from '../sky/draw-sky';
import { drawFallingSpike } from '../spike/draw-falling-spike';
import { drawTiles } from '../tile/draw-tiles';
import type { Focus } from '../types/focus';
import type { Ghost } from '../types/ghost';
import type { Palette } from '../types/palette';
import type { Viewport } from '../types/viewport';
import { getCameraAxis } from './get-camera-axis';

export const renderGame = (
  context: CanvasRenderingContext2D,
  state: GameState,
  palette: Palette,
  viewport: Viewport,
  focus: Focus = getPlayerFocus(state),
  ghosts: Ghost[] = [],
): void =>
  chain(state.level)
    .thru((level) => ({
      cameraX: getCameraAxis(
        focus.x,
        viewport.width,
        level.width * TILE_SIZE,
        viewport.scale,
      ),
      cameraY: getCameraAxis(
        focus.y,
        viewport.height,
        level.height * TILE_SIZE,
        viewport.scale,
      ),
    }))
    .thru(({ cameraX, cameraY }) =>
      draw(
        context,
        createSetTransformStep(viewport.scale, 0, 0, viewport.scale, 0, 0),
        createActionStep((target) => drawSky(target, palette, viewport)),
        createSequenceStep(
          map(HILL_LAYERS, (layer, index) =>
            createActionStep((target) =>
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
        drawSave,
        createTranslateStep(-cameraX, -cameraY),
        createActionStep((target) =>
          drawTiles(target, state.level, palette, cameraX, cameraY, viewport),
        ),
        createSequenceStep(
          map(state.cannons, (cannon) =>
            createActionStep((target) => drawCannon(target, cannon)),
          ),
        ),
        createActionStep((target) => drawGems(target, state)),
        createActionStep((target) => drawKey(target, state)),
        createActionStep((target) => drawChest(target, state)),
        createActionStep((target) => drawPortal(target, state)),
        createSequenceStep(
          map(state.enemies, (enemy) =>
            createActionStep((target) => drawEnemy(target, enemy, state.time)),
          ),
        ),
        createSequenceStep(
          map(state.fallingSpikes, (spike) =>
            createActionStep((target) => drawFallingSpike(target, spike)),
          ),
        ),
        createSequenceStep(
          map(ghosts, (ghost) =>
            createActionStep((target) => drawGhost(target, ghost)),
          ),
        ),
        createActionStep((target) =>
          drawPlayer(target, state.player, state.time),
        ),
        createActionStep((target) => drawCannonballs(target, state)),
        createActionStep((target) => drawFireballs(target, state)),
        createActionStep((target) => drawPlayerFireballs(target, state)),
        createActionStep((target) => drawBullets(target, state)),
        drawRestore,
      ),
    )
    .value();
