import {
  type Enemy,
  GRAVITY,
  type Tile,
  TILE_AIR,
  TILE_DIRT,
  TILE_ENEMY,
} from '@mander/model';
import { head, map, size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import type { GameLevel } from '../../../types/game-level';
import { createPatrols } from './create-patrols';
import { patchDyingEnemy } from './patch-dying-enemy';
import { patchFadingEnemy } from './patch-fading-enemy';

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

const LEVEL = createLevel(['.....', '..e..', '.....', '.....', '#####']);

const createDyingEnemy = (): Enemy => ({
  ...createPatrols(LEVEL)[0],
  position: { x: 40, y: 20 },
  timers: { death: 0.1, reload: 0 },
});

describe('patchFadingEnemy', () => {
  it('should add the elapsed time to the death timer when it is given a dying enemy', () => {
    const enemy = createDyingEnemy();

    const patched = patchFadingEnemy(LEVEL, enemy, 0.1, 0.02);

    expect(patched.timers.death).toBeCloseTo(0.12, 6);
  });

  it('should let the enemy fall as a dying enemy does when it drops through the air', () => {
    const enemy = createDyingEnemy();

    const patched = patchFadingEnemy(LEVEL, enemy, 0.1, 0.02);
    const fallen = patchDyingEnemy(LEVEL, enemy, 0.02);

    expect(patched.position).toEqual(fallen.position);
    expect(patched.velocity.y.current).toBe(fallen.velocity.y.current);
    expect(patched.velocity.y.current).toBeCloseTo(GRAVITY * 0.02, 6);
  });

  it('should leave the given enemy unchanged when it patches a dying enemy', () => {
    const enemy = createDyingEnemy();

    patchFadingEnemy(LEVEL, enemy, 0.1, 0.02);

    expect(enemy).toEqual(createDyingEnemy());
  });
});
