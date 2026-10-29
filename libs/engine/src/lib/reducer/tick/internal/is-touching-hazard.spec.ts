import {
  type Cannonball,
  type Enemy,
  type Player,
  PRONG_HEIGHT,
  type Tile,
  TILE_AIR,
  TILE_DIRT,
  TILE_ENEMY,
  TILE_SIZE,
  TILE_SPAWN,
  TILE_SPIKE,
  TILE_SPIKE_FALLING,
} from '@mander/model';
import { head, map, size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { createInitialState } from '../../../state/create-initial-state';
import type { GameLevel } from '../../../types/game-level';
import { createEnemies } from '../../enemy/create-enemies';
import { createFallingSpikes } from '../../falling-spike/create-falling-spikes';
import { PLAYER_HEIGHT, PLAYER_WIDTH } from '../../player/consts';
import { isTouchingHazard } from './is-touching-hazard';

const LEGEND: Record<string, Tile> = {
  '.': TILE_AIR,
  '#': TILE_DIRT,
  '^': TILE_SPIKE,
  e: TILE_ENEMY,
  f: TILE_SPIKE_FALLING,
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

const LEVEL = createLevel([
  '##########',
  '..f.......',
  '..........',
  '..........',
  's.....^.e.',
  '##########',
]);

const STATE = createInitialState(LEVEL, 0, []);

const ENEMIES = createEnemies(LEVEL);

const FALLING_SPIKES = createFallingSpikes(LEVEL);

const createPlayerAt = (left: number, top: number): Player => ({
  ...STATE.player,
  position: { x: left, y: top },
});

const CLEAR_PLAYER = createPlayerAt(4 * TILE_SIZE, 2 * TILE_SIZE);

const createEnemyOnPlayer = (death: number | null): Enemy => ({
  ...ENEMIES[0],
  position: { x: CLEAR_PLAYER.position.x, y: CLEAR_PLAYER.position.y + 12 },
  timers: { death, reload: 0 },
});

const CANNONBALL: Cannonball = {
  position: { x: 0, y: 0 },
  velocity: { x: { current: 0, max: 0 } },
};

describe('isTouchingHazard', () => {
  it('should say no when the player is clear of every hazard and is not burned', () => {
    const isHarmed = isTouchingHazard(
      STATE,
      CLEAR_PLAYER,
      ENEMIES,
      FALLING_SPIKES,
      [],
      false,
    );

    expect(isHarmed).toBe(false);
  });

  it('should say yes when the player stands on a biting spike tile', () => {
    const player = createPlayerAt(
      6 * TILE_SIZE + TILE_SIZE / 2 - PLAYER_WIDTH / 2,
      5 * TILE_SIZE - PLAYER_HEIGHT,
    );

    const isHarmed = isTouchingHazard(STATE, player, [], [], [], false);

    expect(isHarmed).toBe(true);
  });

  it('should say yes when the player touches a falling spike', () => {
    const player = createPlayerAt(
      2 * TILE_SIZE + TILE_SIZE / 2 - PLAYER_WIDTH / 2,
      TILE_SIZE + PRONG_HEIGHT - PLAYER_HEIGHT / 2,
    );

    const isHarmed = isTouchingHazard(
      STATE,
      player,
      [],
      FALLING_SPIKES,
      [],
      false,
    );

    expect(isHarmed).toBe(true);
  });

  it('should say yes when the player touches a living enemy', () => {
    const enemy = createEnemyOnPlayer(null);

    const isHarmed = isTouchingHazard(
      STATE,
      CLEAR_PLAYER,
      [enemy],
      [],
      [],
      false,
    );

    expect(isHarmed).toBe(true);
  });

  it('should say no when the enemy the player touches is dying', () => {
    const enemy = createEnemyOnPlayer(0.1);

    const isHarmed = isTouchingHazard(
      STATE,
      CLEAR_PLAYER,
      [enemy],
      [],
      [],
      false,
    );

    expect(isHarmed).toBe(false);
  });

  it('should say yes when a cannonball has hit the player', () => {
    const isHarmed = isTouchingHazard(
      STATE,
      CLEAR_PLAYER,
      [],
      [],
      [CANNONBALL],
      false,
    );

    expect(isHarmed).toBe(true);
  });

  it('should say yes when the player is burned', () => {
    const isHarmed = isTouchingHazard(STATE, CLEAR_PLAYER, [], [], [], true);

    expect(isHarmed).toBe(true);
  });
});
