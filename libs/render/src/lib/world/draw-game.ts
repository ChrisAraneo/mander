import type { GameState } from '@mander/engine';
import { TILE_SIZE } from '@mander/model';
import { map } from 'lodash-es';
import { pipe } from 'remeda';
import { createBulletStep } from '../bullet/create-bullet-step';
import { createCannonStep } from '../cannon/create-cannon-step';
import { createCannonballStep } from '../cannon/create-cannonball-step';
import { createActionStep } from '../canvas/create-action-step';
import { createEachStep } from '../canvas/create-each-step';
import { createOptionalStep } from '../canvas/create-optional-step';
import { createSequenceStep } from '../canvas/create-sequence-step';
import { createSetTransformStep } from '../canvas/create-set-transform-step';
import { createTranslateStep } from '../canvas/create-translate-step';
import { draw } from '../canvas/draw';
import { drawRestore } from '../canvas/draw-restore';
import { drawSave } from '../canvas/draw-save';
import { createChestStep } from '../chest/create-chest-step';
import { findChestRectangle } from '../chest/find-chest-rectangle';
import { createEnemyStep } from '../enemies/create-enemy-step';
import { createFireballStep } from '../fireball/create-fireball-step';
import { computePlayerFocus } from '../focus/compute-player-focus';
import { createGemStep } from '../gem/create-gem-step';
import { HILL_LAYERS } from '../hill/consts';
import { createHillLayerStep } from '../hill/create-hill-layer-step';
import { createKeyStep } from '../key/create-key-step';
import { findKeyRectangle } from '../key/find-key-rectangle';
import { createPlayerStep } from '../player/create-player-step';
import { createPortalStep } from '../portal/create-portal-step';
import { findPortalRectangle } from '../portal/find-portal-rectangle';
import { drawSky } from '../sky/draw-sky';
import { createFallingSpikeStep } from '../spike/create-falling-spike-step';
import { drawTiles } from '../tile/draw-tiles';
import type { Focus } from '../types/focus';
import type { Ghost } from '../types/ghost';
import type { Palette } from '../types/palette';
import type { Viewport } from '../types/viewport';
import { computeCameraAxis } from './compute-camera-axis';

export const drawGame = (
  context: CanvasRenderingContext2D,
  state: GameState,
  palette: Palette,
  viewport: Viewport,
  focus: Focus = computePlayerFocus(state),
  ghosts: Ghost[] = [],
): void =>
  pipe(
    state.level,
    (level) => ({
      cameraX: computeCameraAxis(
        focus.x,
        viewport.width,
        level.width * TILE_SIZE,
        viewport.scale,
      ),
      cameraY: computeCameraAxis(
        focus.y,
        viewport.height,
        level.height * TILE_SIZE,
        viewport.scale,
      ),
    }),
    ({ cameraX, cameraY }) =>
      draw(
        context,
        createSetTransformStep(viewport.scale, 0, 0, viewport.scale, 0, 0),
        createActionStep((target) => drawSky(target, palette, viewport)),
        createSequenceStep(
          map(HILL_LAYERS, (layer, index) =>
            createHillLayerStep(cameraX, layer, palette.hills[index], viewport),
          ),
        ),
        drawSave,
        createTranslateStep(-cameraX, -cameraY),
        createActionStep((target) =>
          drawTiles(target, state.level, palette, cameraX, cameraY, viewport),
        ),
        createEachStep(state.cannons, createCannonStep),
        createEachStep(state.gems, (tile) => createGemStep(tile, state.time)),
        createOptionalStep(findKeyRectangle(state), (box) =>
          createKeyStep(box, state.time),
        ),
        createOptionalStep(findChestRectangle(state.level), (box) =>
          createChestStep(box, state),
        ),
        createOptionalStep(findPortalRectangle(state.level), (box) =>
          createPortalStep(box, state),
        ),
        createEachStep(state.enemies, (enemy) =>
          createEnemyStep(enemy, state.time),
        ),
        createEachStep(state.fallingSpikes, createFallingSpikeStep),
        createEachStep(ghosts, (ghost) =>
          createPlayerStep(ghost.player, ghost.time),
        ),
        createPlayerStep(state.player, state.time),
        createEachStep(state.cannonballs, createCannonballStep),
        createEachStep(state.fireballs, (fireball) =>
          createFireballStep(fireball, state.time),
        ),
        createEachStep(state.bullets, createBulletStep),
        drawRestore,
      ),
  );
