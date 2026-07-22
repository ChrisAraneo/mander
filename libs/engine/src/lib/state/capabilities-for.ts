import { sumBy } from 'lodash-es';
import type { Item } from '@mander/generator';
import { MAX_SPEED_BONUS_PERCENT } from './constants';
import type { PlayerCapabilities } from './player-capabilities';

const BASE_MOVE_SPEED = 210;
const BASE_JUMP_VELOCITY = 700;

export function capabilitiesFor(inventory: readonly Item[]): PlayerCapabilities {
  const speedPercent = Math.min(
    MAX_SPEED_BONUS_PERCENT,
    sumBy(inventory, (item) => (item.effect.kind === 'speed' ? item.effect.percent : 0))
  );
  return {
    moveSpeed: BASE_MOVE_SPEED * (1 + speedPercent / 100),
    jumpVelocity: BASE_JUMP_VELOCITY,
  };
}
