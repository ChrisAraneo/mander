import {
  DIAMOND_ENTITY_BOX,
  type GameState,
  toEntityRectangle,
} from '@mander/engine';
import type { Point } from '@mander/utils';
import { forEach } from 'lodash-es';

import { CYAN_GEM, drawGem } from './gem';

const BOB_SPEED = 3;
const BOB_HEIGHT = 3;
const SPIN_SPEED = 2;
const SPIN_FLAT = 0.4;
const GLOW_BLUR = 12;

const drawDiamond = (
  context: CanvasRenderingContext2D,
  tile: Point,
  time: number,
): void => {
  const box = toEntityRectangle(tile, DIAMOND_ENTITY_BOX);
  const phase = tile.x + tile.y;
  const bob = Math.sin(time * BOB_SPEED + phase) * BOB_HEIGHT;
  const centerX = box.x + box.width / 2;
  const centerY = box.y + box.height / 2 + bob;
  const halfWidth =
    (box.width / 2) *
    (SPIN_FLAT +
      (1 - SPIN_FLAT) * Math.abs(Math.cos(time * SPIN_SPEED + phase)));

  drawGem(
    context,
    centerX,
    centerY,
    halfWidth,
    box.height / 2,
    CYAN_GEM,
    GLOW_BLUR,
  );
};

export const drawDiamonds = (
  context: CanvasRenderingContext2D,
  state: GameState,
): void => {
  forEach(state.diamonds, (tile) => drawDiamond(context, tile, state.time));
};
