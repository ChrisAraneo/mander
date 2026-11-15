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

import { createEnemies } from '../../enemy/create-enemies';
import { startEnemyDeath } from '../../enemy/start-enemy-death';
import { STOMP_BOUNCE_VELOCITY } from '../../player/consts';
import { createPlayer } from '../../player/create-player';
import type { GameLevel } from '../../state/types/game-level';
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
  freezingEnemyChance: 0,
});

const LEVEL = createLevel(['.......', 's.e.e..', '#######']);

const FALL_SPEED = 400;

const HEARTS = 3;

const FIRST_ENEMY = 0;

const SECOND_ENEMY = 1;

const BASE_PLAYER = createPlayer(LEVEL, { hearts: { value: HEARTS } });

const cloneFallingPlayer = (): Player => ({
  ...BASE_PLAYER,
  velocity: {
    ...BASE_PLAYER.velocity,
    y: { ...BASE_PLAYER.velocity.y, current: FALL_SPEED },
  },
});

const createLevelEnemies = (): Enemy[] => createEnemies(LEVEL);

describe('createStompBounce', () => {
  it('should send the player up at full jump speed when jump is held', () => {
    const player = cloneFallingPlayer();
    const enemies = createLevelEnemies();

    const bounce = createStompBounce(
      player,
      enemies,
      [enemies[FIRST_ENEMY]],
      true,
    );

    expect(bounce.player.velocity.y.current).toBe(-player.velocity.y.max);
  });

  it('should send the player up at stomp speed when jump is not held', () => {
    const player = cloneFallingPlayer();
    const enemies = createLevelEnemies();

    const bounce = createStompBounce(
      player,
      enemies,
      [enemies[FIRST_ENEMY]],
      false,
    );

    expect(bounce.player.velocity.y.current).toBe(-STOMP_BOUNCE_VELOCITY);
  });

  it('should start the death of the stomped enemies and keep the others when the player bounces', () => {
    const player = cloneFallingPlayer();
    const enemies = createLevelEnemies();

    const bounce = createStompBounce(
      player,
      enemies,
      [enemies[FIRST_ENEMY]],
      false,
    );

    expect(bounce.enemies).toEqual([
      startEnemyDeath(enemies[FIRST_ENEMY]),
      enemies[SECOND_ENEMY],
    ]);
    expect(bounce.enemies[SECOND_ENEMY]).toBe(enemies[SECOND_ENEMY]);
  });

  it('should send the player up and leave the enemies alone when no enemy was stomped', () => {
    const player = cloneFallingPlayer();
    const enemies = createLevelEnemies();

    const bounce = createStompBounce(player, enemies, [], false);

    expect(bounce.player.velocity.y.current).toBe(-STOMP_BOUNCE_VELOCITY);
    expect(bounce.enemies).toEqual(enemies);
  });

  it('should send the player up and give no enemies when the level has none', () => {
    const player = cloneFallingPlayer();

    const bounce = createStompBounce(player, [], [], false);

    expect(bounce.player.velocity.y.current).toBe(-STOMP_BOUNCE_VELOCITY);
    expect(bounce.enemies).toEqual([]);
  });
});
