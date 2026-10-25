import { getEntityRectangle, GEM_ENTITY_BOX, type Point } from '@mander/model';
import { pipe } from 'remeda';
import { CYAN_GEM_COLORS } from '../gem-shape/consts';
import { createGemShapeStep } from '../gem-shape/create-gem-shape-step';
import type { CanvasStep } from '../types/canvas-step';

const BOB_SPEED = 3;

const BOB_HEIGHT = 3;

const SPIN_SPEED = 2;

const SPIN_FLAT = 0.4;

export const createGemStep = (tile: Point, time: number): CanvasStep =>
  pipe(
    {
      box: getEntityRectangle(tile, GEM_ENTITY_BOX),
      phase: tile.x + tile.y,
    },
    ({ box, phase }) => ({
      box,
      phase,
      bob: Math.sin(time * BOB_SPEED + phase) * BOB_HEIGHT,
    }),
    ({ box, phase, bob }) => ({
      centerX: box.x + box.width / 2,
      centerY: box.y + box.height / 2 + bob,
      halfWidth:
        (box.width / 2) *
        (SPIN_FLAT +
          (1 - SPIN_FLAT) * Math.abs(Math.cos(time * SPIN_SPEED + phase))),
      halfHeight: box.height / 2,
    }),
    ({ centerX, centerY, halfWidth, halfHeight }) =>
      createGemShapeStep(
        centerX,
        centerY,
        halfWidth,
        halfHeight,
        CYAN_GEM_COLORS,
      ),
  );
