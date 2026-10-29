import {
  type Enemy,
  type EnemyKind,
  type Player,
  type Tile,
  TILE_AIR,
  TILE_DIRT,
  TILE_ENEMY,
  TILE_SPAWN,
} from '@mander/model';
import { head, map, size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import type { GameLevel } from '../../../types/game-level';
import { createEnemies } from '../../enemy/create-enemies';
import { startEnemyDeath } from '../../enemy/start-enemy-death';
import { PLAYER_HEIGHT, STOMP_BOUNCE_VELOCITY } from '../../player/consts';
import { createPlayer } from '../../player/create-player';
import { patchStompBounce } from './patch-stomp-bounce';

const LEGEND: Record<string, Tile> = {
  '.': TILE_AIR,
  '#': TILE_DIRT,
  e: TILE_ENEMY,
  s: TILE_SPAWN,
};

const createLevel = (rows: string[]): GameLevel => ({
  seed: 'SEED',
  width: size(head(rows)),
  height: size(rows),
  tiles: map(rows, (row) => map(row, (symbol) => LEGEND[symbol])),
  chestItems: [],
  hornedEnemyChance: 0,
  shooterEnemyChance: 0,
});

const LEVEL = createLevel(['.....', '.....', 's.e..', '#####']);

const BASE_PLAYER = createPlayer(LEVEL, { hearts: { value: 3 } });

const DELTA_SECONDS = 1 / 60;

const ENEMY_X = 100;

const ENEMY_Y = 200;

const ENEMY_HEAD = 203;

const createPlayerWithFeetAt = (feet: number, fallSpeed: number): Player => ({
  ...BASE_PLAYER,
  position: { x: ENEMY_X, y: feet - PLAYER_HEIGHT },
  velocity: {
    ...BASE_PLAYER.velocity,
    y: { ...BASE_PLAYER.velocity.y, current: fallSpeed },
  },
});

const createEnemyAt = (left: number, kind: EnemyKind): Enemy => ({
  ...createEnemies(LEVEL)[0],
  kind,
  position: { x: left, y: ENEMY_Y },
  timers: { death: null, reload: 0 },
});

const PREVIOUS_PLAYER = createPlayerWithFeetAt(ENEMY_HEAD - 10, 400);

const FALLING_PLAYER = createPlayerWithFeetAt(ENEMY_HEAD + 4, 400);

describe('patchStompBounce', () => {
  it('should bounce the player up at stomp speed when the player lands on an enemy without holding jump', () => {
    const enemies = [createEnemyAt(ENEMY_X, 'HOPPING')];

    const bounced = patchStompBounce(
      PREVIOUS_PLAYER,
      FALLING_PLAYER,
      enemies,
      false,
      DELTA_SECONDS,
    );

    expect(bounced.player).toEqual({
      ...FALLING_PLAYER,
      velocity: {
        ...FALLING_PLAYER.velocity,
        y: {
          ...FALLING_PLAYER.velocity.y,
          current: -STOMP_BOUNCE_VELOCITY,
        },
      },
    });
  });

  it('should bounce the player up at full jump speed when the player lands on an enemy holding jump', () => {
    const enemies = [createEnemyAt(ENEMY_X, 'HOPPING')];

    const bounced = patchStompBounce(
      PREVIOUS_PLAYER,
      FALLING_PLAYER,
      enemies,
      true,
      DELTA_SECONDS,
    );

    expect(bounced.player.velocity.y.current).toBe(
      -FALLING_PLAYER.velocity.y.max,
    );
  });

  it('should start the death of the stomped enemy and keep the others when the player lands on one enemy', () => {
    const stomped = createEnemyAt(ENEMY_X, 'HOPPING');
    const distant = createEnemyAt(ENEMY_X + 200, 'HOPPING');

    const bounced = patchStompBounce(
      PREVIOUS_PLAYER,
      FALLING_PLAYER,
      [stomped, distant],
      false,
      DELTA_SECONDS,
    );

    expect(bounced.enemies).toEqual([startEnemyDeath(stomped), distant]);
    expect(bounced.enemies[1]).toBe(distant);
  });

  it('should give back the same player and enemies when the player lands on no enemy', () => {
    const enemies = [createEnemyAt(ENEMY_X + 200, 'HOPPING')];

    const bounced = patchStompBounce(
      PREVIOUS_PLAYER,
      FALLING_PLAYER,
      enemies,
      true,
      DELTA_SECONDS,
    );

    expect(bounced.player).toBe(FALLING_PLAYER);
    expect(bounced.enemies).toBe(enemies);
  });

  it('should give back the same player and enemies when there are no enemies', () => {
    const enemies: Enemy[] = [];

    const bounced = patchStompBounce(
      PREVIOUS_PLAYER,
      FALLING_PLAYER,
      enemies,
      false,
      DELTA_SECONDS,
    );

    expect(bounced.player).toBe(FALLING_PLAYER);
    expect(bounced.enemies).toBe(enemies);
  });

  it('should leave the given player and enemies alone when the player lands on an enemy', () => {
    const player = createPlayerWithFeetAt(ENEMY_HEAD + 4, 400);
    const enemies = [createEnemyAt(ENEMY_X, 'HOPPING')];

    patchStompBounce(PREVIOUS_PLAYER, player, enemies, false, DELTA_SECONDS);

    expect(player).toEqual(createPlayerWithFeetAt(ENEMY_HEAD + 4, 400));
    expect(enemies).toEqual([createEnemyAt(ENEMY_X, 'HOPPING')]);
  });
});
