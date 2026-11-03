import { pipe } from 'remeda';
import { createActionStep } from '../canvas/create-action-step';
import { createConditionalStep } from '../canvas/create-conditional-step';
import { createImageStep } from '../canvas/create-image-step';
import { createStyleStep } from '../canvas/create-style-step';
import { drawRestore } from '../canvas/draw-restore';
import { drawSave } from '../canvas/draw-save';
import type { CanvasStep } from '../types/canvas-step';
import { LIGHT_COMPOSITE_OPERATION } from './consts';
import { computeLightGrid } from './internal/compute-light-grid';
import { drawLightingPass } from './internal/draw-lighting-pass';
import type { LightingPass } from './types/lighting-pass';
import type { LightingScene } from './types/lighting-scene';

export const createLightingStep = (
  pass: LightingPass,
  scene: LightingScene,
): CanvasStep =>
  pipe(computeLightGrid(scene), (grid) =>
    createConditionalStep(
      !pass.gl.isContextLost(),
      createActionStep(() => drawLightingPass(pass, scene, grid)),
      drawSave,
      createStyleStep({
        globalCompositeOperation: LIGHT_COMPOSITE_OPERATION,
        imageSmoothingEnabled: true,
      }),
      createImageStep(
        pass.canvas,
        grid.x - scene.cameraX,
        grid.y - scene.cameraY,
        grid.width,
        grid.height,
      ),
      drawRestore,
    ),
  );
