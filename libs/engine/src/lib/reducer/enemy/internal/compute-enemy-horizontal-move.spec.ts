import {
  type Enemy,
  type Level,
  type Tile,
  TILE_AIR,
  TILE_DIRT,
} from '@mander/model';
import { head, map, size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { computeEnemyHorizontalMove } from './compute-enemy-horizontal-move';
import type { EnemyStepIntent } from './types/enemy-step-intent';

const LEGEND: Record<string, Tile> = { '.': TILE_AIR, '#': TILE_DIRT };

const ROWS = ['......', '......', '...#..', '######'];

const LEVEL: Level = {
  seed: 'SEED',
  width: size(head(ROWS)),
  height: size(ROWS),
  tiles: map(ROWS, (row) => map(row, (symbol) => LEGEND[symbol])),
  chestItems: [],
};

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
});
