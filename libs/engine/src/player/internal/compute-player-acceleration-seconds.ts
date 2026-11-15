import type { Level, Player } from '@mander/model';
import { match } from 'ts-pattern';
import { ACCELERATION_SECONDS, ICE_ACCELERATION_SECONDS } from '../consts';
import { isOnIce } from './is-on-ice';

export const computePlayerAccelerationSeconds = (
  level: Level,
  player: Player,
): number =>
  match(isOnIce(level, player))
    .with(true, () => ICE_ACCELERATION_SECONDS)
    .otherwise(() => ACCELERATION_SECONDS);
