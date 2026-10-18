import type { Level } from '@mander/model';
import { match } from 'ts-pattern';
import type { Facing } from '../../types/facing';
import { computeOppositeFacing } from './compute-opposite-facing';
import { isBeartrapAhead } from './is-beartrap-ahead';
import { isLedgeAhead } from './is-ledge-ahead';
import { isSpikeAhead } from './is-spike-ahead';
import { isWallAhead } from './is-wall-ahead';

export const computeEnemyTurn = (
  level: Level,
  left: number,
  top: number,
  facing: Facing,
  isGrounded: boolean,
): Facing =>
  match({
    isGrounded,
    hasObstacle:
      isWallAhead(level, left, top, facing) ||
      isLedgeAhead(level, left, top, facing) ||
      isSpikeAhead(level, left, top, facing) ||
      isBeartrapAhead(level, left, top, facing),
  })
    .with({ isGrounded: true, hasObstacle: true }, () =>
      computeOppositeFacing(facing),
    )
    .otherwise(() => facing);
