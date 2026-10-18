import type { Cannonball, Enemy, FallingSpike, Player } from '@mander/model';
import { size, some } from 'lodash-es';
import type { GameState } from '../../../types/game-state';
import { isTouchingEnemy } from '../../enemy/is-touching-enemy';
import { PLAYER_HEIGHT, PLAYER_WIDTH } from '../../player/consts';
import { isAlive } from '../../player/is-alive';
import { isOverlappingSpike } from '../../spike/is-overlapping-spike';
import { isTouchingAnyFallingSpike } from './is-touching-any-falling-spike';

export const isTouchingHazard = (
  state: GameState,
  player: Player,
  enemies: Enemy[],
  fallingSpikes: FallingSpike[],
  hits: Cannonball[],
  isBurned: boolean,
): boolean =>
  isOverlappingSpike(
    state.level,
    player.position.x,
    player.position.y,
    PLAYER_WIDTH,
    PLAYER_HEIGHT,
  ) ||
  isTouchingAnyFallingSpike(player, fallingSpikes) ||
  some(enemies, (enemy) => isAlive(enemy) && isTouchingEnemy(player, enemy)) ||
  size(hits) > 0 ||
  isBurned;
