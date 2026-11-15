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

import { createEnemies } from '../../enemy/create-enemies';
import { createFallingSpikes } from '../../falling-spike/create-falling-spikes';
import { FIRST_LEVEL_INDEX } from '../../load-level/consts';
import { PLAYER_HEIGHT, PLAYER_WIDTH } from '../../player/consts';
import { createInitialState } from '../../start/create-initial-state';
import type { GameLevel } from '../../state/types/game-level';
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
  freezingEnemyChance: 0,
});

const LEVEL = createLevel([
  '##########',
  '..f.......',
  '..........',
  '..........',
  's.....^.e.',
  '##########',
]);

const STATE = createInitialState(LEVEL, FIRST_LEVEL_INDEX, []);

const ENEMIES = createEnemies(LEVEL);

const FALLING_SPIKES = createFallingSpikes(LEVEL);

const createPlayerAt = (left: number, top: number): Player => ({
  ...STATE.player,
  position: { x: left, y: top },
});

const CLEAR_COLUMN = 4;

const CLEAR_ROW = 2;

const FIRST_ENEMY = 0;

const OVERLAP_Y = 12;

const DYING_SECONDS = 0.1;

const CLEAR_PLAYER = createPlayerAt(
  CLEAR_COLUMN * TILE_SIZE,
  CLEAR_ROW * TILE_SIZE,
);

const createEnemyOnPlayer = (death: number | null): Enemy => ({
  ...ENEMIES[FIRST_ENEMY],
  position: {
    x: CLEAR_PLAYER.position.x,
    y: CLEAR_PLAYER.position.y + OVERLAP_Y,
  },
  timers: { death, reload: 0 },
});

const CANNONBALL: Cannonball = {
  position: { x: 0, y: 0 },
  velocity: { x: { current: 0, max: 0 }, y: { current: 0, max: 0 } },
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
    const enemy = createEnemyOnPlayer(DYING_SECONDS);

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
