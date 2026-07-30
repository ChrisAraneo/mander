import type { Level } from '@mander/model';
import { match } from 'ts-pattern';

import { GRAVITY, MAX_TICK_SECONDS, TERMINAL_VELOCITY } from '../physics';
import type { Player } from '../state';
import { createPlayer, PLAYER_DEATH_SECONDS } from '../state';

export const stepPlayerDeath = (
  level: Level,
  player: Player,
  death: number,
  elapsedSeconds: number,
): Player => {
  const deltaSeconds = Math.min(elapsedSeconds, MAX_TICK_SECONDS);
  return match(death + deltaSeconds >= PLAYER_DEATH_SECONDS)
    .with(true, () => createPlayer(level, player))
    .otherwise((): Player => ({
      ...player,
      position: {
        ...player.position,
        y: player.position.y + player.velocity.y.current * deltaSeconds,
      },
      velocity: {
        ...player.velocity,
        y: {
          ...player.velocity.y,
          current: Math.min(
            player.velocity.y.current + GRAVITY * deltaSeconds,
            TERMINAL_VELOCITY,
          ),
        },
      },
      timers: { ...player.timers, death: death + deltaSeconds },
    }));
};
