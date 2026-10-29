import {
  type Enemy,
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
import { STOMP_BOUNCE_VELOCITY } from '../../player/consts';
import { createPlayer } from '../../player/create-player';
import { createStompBounce } from './create-stomp-bounce';

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
  fastEnemyChance: 0,
  shooterEnemyChance: 0,
});

const LEVEL = createLevel(['.......', 's.e.e..', '#######']);

const FALL_SPEED = 400;

const BASE_PLAYER = createPlayer(LEVEL, { hearts: { value: 3 } });

const createFallingPlayer = (): Player => ({
  ...BASE_PLAYER,
  velocity: {
    ...BASE_PLAYER.velocity,
    y: { ...BASE_PLAYER.velocity.y, current: FALL_SPEED },
  },
});

const createLevelEnemies = (): Enemy[] => createEnemies(LEVEL);

describe('createStompBounce', () => {
  it('should send the player up at full jump speed when jump is held', () => {
    const player = createFallingPlayer();
    const enemies = createLevelEnemies();

    const bounce = createStompBounce(player, enemies, [enemies[0]], true);

    expect(bounce.player.velocity.y.current).toBe(-player.velocity.y.max);
  });

  it('should send the player up at stomp speed when jump is not held', () => {
    const player = createFallingPlayer();
    const enemies = createLevelEnemies();

    const bounce = createStompBounce(player, enemies, [enemies[0]], false);

    expect(bounce.player.velocity.y.current).toBe(-STOMP_BOUNCE_VELOCITY);
  });

  it('should start the death of the stomped enemies and keep the others when the player bounces', () => {
    const player = createFallingPlayer();
    const enemies = createLevelEnemies();

    const bounce = createStompBounce(player, enemies, [enemies[0]], false);

    expect(bounce.enemies).toEqual([startEnemyDeath(enemies[0]), enemies[1]]);
    expect(bounce.enemies[1]).toBe(enemies[1]);
  });
});
