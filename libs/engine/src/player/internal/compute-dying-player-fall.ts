import { GRAVITY, type Player, TERMINAL_VELOCITY } from '@mander/model';
import { min } from 'lodash-es';
import type { DyingPlayerFall } from './types/dying-player-fall';

export const computeDyingPlayerFall = ({
  player,
  death,
  deltaSeconds,
}: {
  player: Player;
  death: number;
  deltaSeconds: number;
}): DyingPlayerFall => ({
  player,
  death,
  deltaSeconds,
  velocityY: min([
    player.velocity.y.current + GRAVITY * deltaSeconds,
    TERMINAL_VELOCITY,
  ]),
});
