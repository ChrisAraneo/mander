import { TILE_SIZE } from '@mander/model';
import { map, range } from 'lodash-es';
import { match } from 'ts-pattern';
import { createFillRectStep } from '../../canvas/create-fill-rect-step';
import { createSequenceStep } from '../../canvas/create-sequence-step';
import { createStyleStep } from '../../canvas/create-style-step';
import type { CanvasStep } from '../../types/canvas-step';
import type { MaterialStyle } from '../../types/material-style';
import { HALF_TILE } from './consts';

const COURSE_HEIGHT = TILE_SIZE / 4;

const QUARTER_TILE = TILE_SIZE / 4;

const COURSE_COUNT = 4;

export const createBrickStep = (
  pixelX: number,
  pixelY: number,
  style: MaterialStyle,
): CanvasStep =>
  createSequenceStep([
    createStyleStep({ fillStyle: style.joint }),
    createSequenceStep(
      map(range(1, COURSE_COUNT), (course) =>
        createFillRectStep(
          pixelX,
          pixelY + course * COURSE_HEIGHT,
          TILE_SIZE,
          1,
        ),
      ),
    ),
    createSequenceStep(
      map(range(0, COURSE_COUNT), (course) =>
        createFillRectStep(
          pixelX +
            match(course % 2)
              .with(0, () => HALF_TILE)
              .otherwise(() => QUARTER_TILE),
          pixelY + course * COURSE_HEIGHT,
          1,
          COURSE_HEIGHT,
        ),
      ),
    ),
  ]);
