import { sumBy } from 'lodash-es';
import { match } from 'ts-pattern';

import { GRAVITY, MAX_JUMP_TILES } from '../physics/constants';
import { type Item, TILE_SIZE } from '../world';
import type { Player } from '../world/player/player';
import { MAX_SPEED_BONUS_PERCENT } from './constants';

const BASE_MOVE_SPEED = 210;

const BASE_JUMP_VELOCITY = Math.sqrt(2 * GRAVITY * MAX_JUMP_TILES * TILE_SIZE);

export const capabilitiesFor = (
  inventory: readonly Item[],
): Pick<Player, 'moveSpeed' | 'jumpVelocity'> => {
  const speedPercent = Math.min(
    MAX_SPEED_BONUS_PERCENT,
    sumBy(inventory, (item) =>
      match(item.effect)
        .with({ kind: 'SPEED' }, (effect) => effect.percent)
        .otherwise(() => 0),
    ),
  );
  return {
    moveSpeed: BASE_MOVE_SPEED * (1 + speedPercent / 100),
    jumpVelocity: BASE_JUMP_VELOCITY,
  };
};
