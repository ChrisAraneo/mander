import {
  type Enemy,
  type Tile,
  TILE_AIR,
  TILE_DIRT,
  TILE_ENEMY,
} from '@mander/model';
import { head, map, size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import type { GameLevel } from '../../types/game-level';
import { ENEMY_DEATH_SECONDS } from './consts';
import { createEnemies } from './create-enemies';
import { isEnemyFaded } from './is-enemy-faded';

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
  shooterEnemyChance: 0,
});

const LEVEL = createLevel(['.....', '..e..', '#####']);

const createEnemyDyingFor = (death: number | null): Enemy => ({
  ...createEnemies(LEVEL)[0],
  timers: { death, reload: 0 },
});

describe('isEnemyFaded', () => {
  it('should say no when the enemy is still alive', () => {
    const enemy = createEnemyDyingFor(null);

    const isFaded = isEnemyFaded(enemy);

    expect(isFaded).toBe(false);
  });

  it('should say no when the enemy has only just started dying', () => {
    const enemy = createEnemyDyingFor(0);

    const isFaded = isEnemyFaded(enemy);

    expect(isFaded).toBe(false);
  });

  it('should say no when the enemy is a moment short of fading away', () => {
    const enemy = createEnemyDyingFor(ENEMY_DEATH_SECONDS - 0.01);

    const isFaded = isEnemyFaded(enemy);

    expect(isFaded).toBe(false);
  });

  it('should say yes when the enemy has been dying for exactly the death time', () => {
    const enemy = createEnemyDyingFor(ENEMY_DEATH_SECONDS);

    const isFaded = isEnemyFaded(enemy);

    expect(isFaded).toBe(true);
  });

  it('should say yes when the enemy has been dying for longer than the death time', () => {
    const enemy = createEnemyDyingFor(ENEMY_DEATH_SECONDS + 1);

    const isFaded = isEnemyFaded(enemy);

    expect(isFaded).toBe(true);
  });
});
