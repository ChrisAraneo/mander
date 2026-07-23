import type { Item } from '@mander/generator';
import { sumBy } from 'lodash-es';

import { MAX_SPEED_BONUS_PERCENT } from './constants';
import type { PlayerCapabilities } from './player-capabilities';

const BASE_MOVE_SPEED = 210;
const BASE_JUMP_VELOCITY = 700;

export const capabilitiesFor = (
  inventory: readonly Item[],
): PlayerCapabilities => {
  const speedPercent = Math.min(
    MAX_SPEED_BONUS_PERCENT,
    sumBy(inventory, (item) => {
      if (item.effect.kind === 'speed') return item.effect.percent;
      return 0;
    }),
  );
  return {
    moveSpeed: BASE_MOVE_SPEED * (1 + speedPercent / 100),
    jumpVelocity: BASE_JUMP_VELOCITY,
  };
};
