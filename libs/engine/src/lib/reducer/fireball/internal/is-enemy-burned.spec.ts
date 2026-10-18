import {
  type Enemy,
  type Fireball,
  MAX_TICK_SECONDS,
  type Tile,
  TILE_AIR,
  TILE_DIRT,
  TILE_ENEMY,
} from '@mander/model';
import { head, map, size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import type { GameLevel } from '../../../types/game-level';
import { ENEMY_HEIGHT, ENEMY_WIDTH } from '../../enemy/consts';
import { createEnemies } from '../../enemy/create-enemies';
import { getPlayerFireballPosition } from '../get-player-fireball-position';
import { isEnemyBurned } from './is-enemy-burned';

const LEGEND: Record<string, Tile> = {
  '.': TILE_AIR,
  '#': TILE_DIRT,
  e: TILE_ENEMY,
};

const createLevel = (rows: string[]): GameLevel => ({
  seed: 'SEED',
  width: size(head(rows)),
  height: size(rows),
  tiles: map(rows, (row) => map(row, (symbol) => LEGEND[symbol])),
  chestItems: [],
  hornedEnemyChance: 0,
});

const LEVEL = createLevel(['.....', '..e..', '#####']);

const FIREBALL: Fireball = {
  spin: 'CLOCKWISE',
  origin: { x: 200, y: 200 },
  angle: 0,
};

const createEnemyAround = (
  angle: number,
  death: number | null = null,
): Enemy => ({
  ...createEnemies(LEVEL)[0],
  position: {
    x: getPlayerFireballPosition({ ...FIREBALL, angle }).x - ENEMY_WIDTH / 2,
    y: getPlayerFireballPosition({ ...FIREBALL, angle }).y - ENEMY_HEIGHT / 2,
  },
  timers: { death },
});

describe('isEnemyBurned', () => {
  it('should burn the enemy when the fireball sits on it', () => {
    const isBurned = isEnemyBurned([FIREBALL], createEnemyAround(0), 0);

    expect(isBurned).toBe(true);
  });

  it('should burn the enemy when the fireball sweeps through it during the step', () => {
    const isBurned = isEnemyBurned(
      [FIREBALL],
      createEnemyAround(-0.1),
      MAX_TICK_SECONDS,
    );

    expect(isBurned).toBe(true);
  });

  it('should spare the enemy when the fireball swept past it but no time has passed', () => {
    const isBurned = isEnemyBurned([FIREBALL], createEnemyAround(-0.1), 0);

    expect(isBurned).toBe(false);
  });

  it('should burn the enemy when only the second fireball reaches it', () => {
    const isBurned = isEnemyBurned(
      [{ ...FIREBALL, angle: Math.PI }, FIREBALL],
      createEnemyAround(0),
      MAX_TICK_SECONDS,
    );

    expect(isBurned).toBe(true);
  });

  it('should spare the enemy when it is already dying', () => {
    const isBurned = isEnemyBurned(
      [FIREBALL],
      createEnemyAround(0, 0.1),
      MAX_TICK_SECONDS,
    );

    expect(isBurned).toBe(false);
  });

  it('should spare the enemy when it stands out of reach of the fireball', () => {
    const isBurned = isEnemyBurned(
      [FIREBALL],
      createEnemyAround(Math.PI),
      MAX_TICK_SECONDS,
    );

    expect(isBurned).toBe(false);
  });

  it('should spare the enemy when there are no fireballs', () => {
    const isBurned = isEnemyBurned([], createEnemyAround(0), MAX_TICK_SECONDS);

    expect(isBurned).toBe(false);
  });
});
