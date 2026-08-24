import { chain } from '@mander/utils';
import type { GameState } from '@mander/engine';
import { GEM_ENTITY_BOX, toEntityRectangle } from '@mander/model';
import type { Point } from '@mander/utils';
import { map } from 'lodash-es';

import { type CanvasStep, paint } from '../canvas';
import { CYAN_GEM_COLORS, gemShapeStep } from '../gem-shape';

const BOB_SPEED = 3;
const BOB_HEIGHT = 3;
const SPIN_SPEED = 2;
const SPIN_FLAT = 0.4;
const GLOW_BLUR = 12;

const gemStep = (tile: Point, time: number): CanvasStep =>
  chain({
    box: toEntityRectangle(tile, GEM_ENTITY_BOX),
    phase: tile.x + tile.y,
  })
    .thru(({ box, phase }) => ({
      box,
      phase,
      bob: Math.sin(time * BOB_SPEED + phase) * BOB_HEIGHT,
    }))
    .thru(({ box, phase, bob }) => ({
      centerX: box.x + box.width / 2,
      centerY: box.y + box.height / 2 + bob,
      halfWidth:
        (box.width / 2) *
        (SPIN_FLAT +
          (1 - SPIN_FLAT) * Math.abs(Math.cos(time * SPIN_SPEED + phase))),
      halfHeight: box.height / 2,
    }))
    .thru(({ centerX, centerY, halfWidth, halfHeight }) =>
      gemShapeStep(
        centerX,
        centerY,
        halfWidth,
        halfHeight,
        CYAN_GEM_COLORS,
        GLOW_BLUR,
      ),
    )
    .value();

export const drawGems = (
  context: CanvasRenderingContext2D,
  state: GameState,
): void =>
  paint(context, ...map(state.gems, (tile) => gemStep(tile, state.time)));
