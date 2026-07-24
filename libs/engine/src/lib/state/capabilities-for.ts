import { type Item, MAX_JUMP_TILES, TILE_SIZE } from '@mander/generator';
import { sumBy } from 'lodash-es';

import { GRAVITY } from '../physics/constants';
import { MAX_SPEED_BONUS_PERCENT } from './constants';
import type { PlayerCapabilities } from './player-capabilities';

const BASE_MOVE_SPEED = 210;

const BASE_JUMP_VELOCITY = Math.sqrt(
  2 * GRAVITY * MAX_JUMP_TILES * TILE_SIZE,
);

export const capabilitiesFor = (
  inventory: readonly Item[],
): PlayerCapabilities => {
  const speedPercent = Math.min(
    MAX_SPEED_BONUS_PERCENT,
    sumBy(inventory, (item) => {
      if (item.effect.kind === 'SPEED') return item.effect.percent;
      return 0;
    }),
  );
  return {
    moveSpeed: BASE_MOVE_SPEED * (1 + speedPercent / 100),
    jumpVelocity: BASE_JUMP_VELOCITY,
  };
};
