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

import type { GameLevel } from '../../types/game-level';
import { ENEMY_HEIGHT, ENEMY_WIDTH } from '../enemy/consts';
import { createEnemies } from '../enemy/create-enemies';
import { burnEnemies } from './burn-enemies';
import { getPlayerFireballPosition } from './get-player-fireball-position';

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

describe('burnEnemies', () => {
  it('should set the enemy dying when the fireball sits on it', () => {
    const enemy = createEnemyAround(0);

    const [burned] = burnEnemies([FIREBALL], [enemy]);

    expect(burned.timers.death).toBe(0);
    expect(burned.velocity.x.current).toBe(0);
  });

  it('should set the enemy dying when the fireball sweeps through it during the step', () => {
    const enemy = createEnemyAround(-0.1);

    const [burned] = burnEnemies([FIREBALL], [enemy], MAX_TICK_SECONDS);

    expect(burned.timers.death).toBe(0);
  });

  it('should spare the enemy the fireball swept past when no time is given', () => {
    const enemy = createEnemyAround(-0.1);

    const [spared] = burnEnemies([FIREBALL], [enemy]);

    expect(spared).toBe(enemy);
  });

  it('should leave the same enemy when it stands out of reach of the fireball', () => {
    const enemy = createEnemyAround(Math.PI);

    const [spared] = burnEnemies([FIREBALL], [enemy], MAX_TICK_SECONDS);

    expect(spared).toBe(enemy);
  });

  it('should leave the enemy as it is when it is already dying', () => {
    const enemy = createEnemyAround(0, 0.1);

    const [fading] = burnEnemies([FIREBALL], [enemy], MAX_TICK_SECONDS);

    expect(fading).toBe(enemy);
  });

  it('should leave the same enemy when there are no fireballs', () => {
    const enemy = createEnemyAround(0);

    const [spared] = burnEnemies([], [enemy]);

    expect(spared).toBe(enemy);
  });

  it('should give no enemies when the level has none', () => {
    const burned = burnEnemies([FIREBALL], []);

    expect(burned).toEqual([]);
  });

  it('should leave the given enemies unchanged when the fireball burns one', () => {
    const enemies = [createEnemyAround(0)];

    burnEnemies([FIREBALL], enemies);

    expect(enemies).toEqual([createEnemyAround(0)]);
  });
});
