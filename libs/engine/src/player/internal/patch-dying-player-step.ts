import type { Level, Player } from '@mander/model';
import { match } from 'ts-pattern';
import { PLAYER_DEATH_SECONDS } from '../consts';
import { createPlayer } from '../create-player';
import { patchDyingPlayerFall } from './patch-dying-player-fall';

export const patchDyingPlayerStep = (
  level: Level,
  player: Player,
  death: number,
  deltaSeconds: number,
): Player =>
  match(death + deltaSeconds >= PLAYER_DEATH_SECONDS)
    .with(true, () => createPlayer(level, player))
    .otherwise(() => patchDyingPlayerFall(player, death, deltaSeconds));
