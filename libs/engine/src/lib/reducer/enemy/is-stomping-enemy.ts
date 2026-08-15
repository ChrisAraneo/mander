import { type Enemy, MAX_TICK_SECONDS, type Player } from '@mander/model';

import {
  PLAYER_HEIGHT,
  PLAYER_HITBOX_INSET_BOTTOM,
  PLAYER_HITBOX_INSET_X,
  PLAYER_WIDTH,
} from '../player/consts';
import {
  ENEMY_HITBOX_INSET,
  ENEMY_WIDTH,
  STOMP_GRACE_X,
  STOMP_GRACE_Y,
} from './consts';

const feetOf = (player: Player): number =>
  player.position.y + PLAYER_HEIGHT - PLAYER_HITBOX_INSET_BOTTOM;

const headOf = (enemy: Enemy): number => enemy.position.y + ENEMY_HITBOX_INSET;

const headBeforeHopOf = (enemy: Enemy, deltaSeconds: number): number =>
  headOf(enemy) -
  Math.min(0, enemy.velocity.y.current) *
    Math.min(deltaSeconds, MAX_TICK_SECONDS);

const isOverlappingHorizontally = (player: Player, enemy: Enemy): boolean => {
  const playerLeft = player.position.x + PLAYER_HITBOX_INSET_X - STOMP_GRACE_X;
  const playerRight =
    player.position.x + PLAYER_WIDTH - PLAYER_HITBOX_INSET_X + STOMP_GRACE_X;
  const enemyLeft = enemy.position.x + ENEMY_HITBOX_INSET;
  const enemyRight = enemy.position.x + ENEMY_WIDTH - ENEMY_HITBOX_INSET;

  return playerLeft < enemyRight && playerRight > enemyLeft;
};

const dropsOntoHead = (
  previousPlayer: Player,
  player: Player,
  enemy: Enemy,
  deltaSeconds: number,
): boolean =>
  feetOf(previousPlayer) <=
    headBeforeHopOf(enemy, deltaSeconds) + STOMP_GRACE_Y &&
  feetOf(player) >= headOf(enemy);

export const isStompingEnemy = (
  previousPlayer: Player,
  player: Player,
  enemy: Enemy,
  deltaSeconds: number,
): boolean =>
  player.velocity.y.current > 0 &&
  isOverlappingHorizontally(player, enemy) &&
  dropsOntoHead(previousPlayer, player, enemy, deltaSeconds);
