import type { Level } from '@mander/generator';
import { match } from 'ts-pattern';

import { GRAVITY, MAX_TICK_SECONDS, TERMINAL_VELOCITY } from '../physics';
import type { Player } from '../state';
import { createPlayer, PLAYER_DEATH_SECONDS } from '../state';

export const stepPlayerDeath = (
  level: Level,
  player: Player,
  dyingFor: number,
  elapsedSeconds: number,
): Player => {
  const deltaSeconds = Math.min(elapsedSeconds, MAX_TICK_SECONDS);
  return match(dyingFor + deltaSeconds >= PLAYER_DEATH_SECONDS)
    .with(true, () => createPlayer(level))
    .otherwise(
      (): Player => ({
        ...player,
        y: player.y + player.vy * deltaSeconds,
        vy: Math.min(player.vy + GRAVITY * deltaSeconds, TERMINAL_VELOCITY),
        dyingFor: dyingFor + deltaSeconds,
      }),
    );
};
