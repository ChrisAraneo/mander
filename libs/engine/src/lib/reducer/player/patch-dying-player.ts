import { GRAVITY, type Level, MAX_TICK_SECONDS, type Player, TERMINAL_VELOCITY, chain } from '@mander/model';
import { min } from 'lodash-es';
import { match } from 'ts-pattern';
import { PLAYER_DEATH_SECONDS } from './consts';
import { createPlayer } from './create-player';

export const patchDyingPlayer = (
  level: Level,
  player: Player,
  death: number,
  elapsedSeconds: number,
): Player =>
  chain(min([elapsedSeconds, MAX_TICK_SECONDS]))
    .thru((deltaSeconds) =>
      match(death + deltaSeconds >= PLAYER_DEATH_SECONDS)
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
              current: min([
                player.velocity.y.current + GRAVITY * deltaSeconds,
                TERMINAL_VELOCITY,
              ]),
            },
          },
          timers: { ...player.timers, death: death + deltaSeconds },
        })),
    )
    .value();
