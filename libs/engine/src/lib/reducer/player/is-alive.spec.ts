import {
  type Player,
  type Tile,
  TILE_AIR,
  TILE_DIRT,
  TILE_ENEMY,
} from '@mander/model';
import { head, map, size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import type { GameLevel } from '../../types/game-level';
import { createEnemies } from '../enemy/create-enemies';
import { createBasePlayerVelocity } from './create-base-player-velocity';
import { isAlive } from './is-alive';

const LEGEND: Record<string, Tile> = {
  '.': TILE_AIR,
  '#': TILE_DIRT,
  E: TILE_ENEMY,
};

const ROWS = ['.....', '..E..', '#####'];

const LEVEL: GameLevel = {
  seed: 'SEED',
  width: size(head(ROWS)),
  height: size(ROWS),
  tiles: map(ROWS, (row) => map(row, (symbol) => LEGEND[symbol])),
  chestItems: [],
  hornedEnemyChance: 0,
};

const [ENEMY] = createEnemies(LEVEL);

const createPlayerDiedAt = (death: number | null): Player => ({
  position: { x: 100, y: 200 },
  velocity: createBasePlayerVelocity(),
  hearts: { value: 3 },
  timers: { death, invincibility: 0, star: 0, hurt: 0 },
  statuses: { isFacingRight: true, isGrounded: true, isJumpQueued: false },
});

describe('isAlive', () => {
  it('should say the player is alive when the player has not started dying', () => {
    const player = createPlayerDiedAt(null);

    expect(isAlive(player)).toBe(true);
  });

  it('should say the player is dead when the player has been dying for a while', () => {
    const player = createPlayerDiedAt(0.3);

    expect(isAlive(player)).toBe(false);
  });

  it('should say the player is dead when the player has only just started dying', () => {
    const player = createPlayerDiedAt(0);

    expect(isAlive(player)).toBe(false);
  });

  it('should say the enemy is alive when the enemy has not started dying', () => {
    expect(isAlive(ENEMY)).toBe(true);
  });

  it('should say the enemy is dead when the enemy has only just started dying', () => {
    const enemy = { ...ENEMY, timers: { death: 0 } };

    expect(isAlive(enemy)).toBe(false);
  });
});
