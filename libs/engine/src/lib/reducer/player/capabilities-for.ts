import {
  GRAVITY,
  type Item,
  MAX_JUMP_TILES,
  type Player,
  TILE_SIZE,
} from '@mander/model';
import { sumBy } from 'lodash-es';
import { match } from 'ts-pattern';

import { MAX_SPEED_BONUS_PERCENT } from './consts';

const BASE_MOVE_SPEED = 210;

const BASE_JUMP_VELOCITY = Math.sqrt(2 * GRAVITY * MAX_JUMP_TILES * TILE_SIZE);

export const capabilitiesFor = (
  inventory: readonly Item[],
): Player['velocity'] => {
  const speedPercent = Math.min(
    MAX_SPEED_BONUS_PERCENT,
    sumBy(inventory, (item) =>
      match(item.effect)
        .with({ kind: 'SPEED' }, (effect) => effect.percent)
        .otherwise(() => 0),
    ),
  );
  return {
    x: { current: 0, max: BASE_MOVE_SPEED * (1 + speedPercent / 100) },
    y: { current: 0, max: BASE_JUMP_VELOCITY },
  };
};
