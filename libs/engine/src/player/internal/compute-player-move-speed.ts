import type { Level, Player } from '@mander/model';
import { computeWalkSpeed } from '../../sand/compute-walk-speed';
import { PLAYER_HEIGHT, PLAYER_WIDTH } from '../consts';
import { getPlayerMoveVelocity } from '../get-player-move-velocity';

export const computePlayerMoveSpeed = (level: Level, player: Player): number =>
  computeWalkSpeed(
    level,
    player,
    PLAYER_WIDTH,
    PLAYER_HEIGHT,
    getPlayerMoveVelocity(player),
  );
