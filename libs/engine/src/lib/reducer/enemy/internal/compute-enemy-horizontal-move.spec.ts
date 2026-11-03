import {
  type Enemy,
  type Level,
  type Tile,
  TILE_AIR,
  TILE_DIRT,
  TILE_SAND,
} from '@mander/model';
import { head, map, size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { computeEnemyHorizontalMove } from './compute-enemy-horizontal-move';
import type { EnemyStepIntent } from './types/enemy-step-intent';

const LEGEND: Record<string, Tile> = {
  '.': TILE_AIR,
  '#': TILE_DIRT,
  s: TILE_SAND,
};

const createLevel = (rows: string[]): Level => ({
  seed: 'SEED',
  width: size(head(rows)),
  height: size(rows),
  tiles: map(rows, (row) => map(row, (symbol) => LEGEND[symbol])),
  chestItems: [],
});

const ROWS = ['......', '......', '...#..', '######'];

const LEVEL = createLevel(ROWS);

const SAND_LEVEL = createLevel(['......', '......', '......', 'ssssss']);

const createWalkingEnemy = (positionX: number): Enemy => ({
  kind: 'HOPPING',
  position: { x: positionX, y: 74 },
  velocity: { x: { current: 78, max: 78 }, y: { current: 0, max: 430 } },
  timers: { death: null, reload: 0 },
  spawn: { x: positionX, y: 74 },
  statuses: { isFacingRight: true, isGrounded: true },
});

const createIntent = (
  positionX: number,
  facing: EnemyStepIntent['facing'],
  deltaSeconds: number,
): EnemyStepIntent => ({
  level: LEVEL,
  enemy: createWalkingEnemy(positionX),
  deltaSeconds,
  facing,
  velocityY: 72,
  isGrounded: true,
});

describe('computeEnemyHorizontalMove', () => {
  it('should move the enemy the whole way at its top speed when nothing is in the way', () => {
    const move = computeEnemyHorizontalMove(createIntent(40, 1, 0.04));

    expect(move.position).toBeCloseTo(43.12, 6);
    expect(move.isBlocked).toBe(false);
  });

  it('should move the enemy to the left when it faces left', () => {
    const move = computeEnemyHorizontalMove(createIntent(40, -1, 0.04));

    expect(move.position).toBeCloseTo(36.88, 6);
    expect(move.isBlocked).toBe(false);
  });

  it('should stop the enemy flush against the wall when a solid tile is in the way', () => {
    const move = computeEnemyHorizontalMove(createIntent(72, 1, 0.04));

    expect(move.position).toBe(74);
    expect(move.isBlocked).toBe(true);
  });

  it('should leave the enemy where it is when no time has passed', () => {
    const move = computeEnemyHorizontalMove(createIntent(40, 1, 0));

    expect(move.position).toBe(40);
    expect(move.isBlocked).toBe(false);
  });

  it('should move the enemy at 0.65 of its top speed when it walks on sand', () => {
    const move = computeEnemyHorizontalMove({
      ...createIntent(40, 1, 0.04),
      level: SAND_LEVEL,
    });

    expect(move.position).toBeCloseTo(42.028, 6);
    expect(move.isBlocked).toBe(false);
  });

  it('should move the enemy left at 0.65 of its top speed when it walks left on sand', () => {
    const move = computeEnemyHorizontalMove({
      ...createIntent(40, -1, 0.04),
      level: SAND_LEVEL,
    });

    expect(move.position).toBeCloseTo(37.972, 6);
  });
});
