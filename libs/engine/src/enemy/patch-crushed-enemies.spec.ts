import { type Enemy, type EnemyKind, TILE_SIZE } from '@mander/model';
import { describe, expect, it } from 'vitest';

import { ENEMY_HEIGHT, ENEMY_WIDTH } from './consts';
import { patchCrushedEnemies } from './patch-crushed-enemies';

const FLOOR_ROW = 12;

const TRAP_COLUMN = 6;

const TRAP_X = TRAP_COLUMN * TILE_SIZE + (TILE_SIZE - ENEMY_WIDTH) / 2;

const TRAP_Y = FLOOR_ROW * TILE_SIZE - ENEMY_HEIGHT;

const createEnemyAt = (kind: EnemyKind, left: number, top: number): Enemy => ({
  kind,
  position: { x: left, y: top },
  velocity: { x: { current: 0, max: 0 }, y: { current: 0, max: 0 } },
  timers: { death: null, reload: 0 },
  spawn: { x: left, y: top },
  statuses: { isFacingRight: true, isGrounded: true },
});

const OVERLAP_OFFSET = 4;

const DEATH_STARTED = 0;

const TRAP = createEnemyAt('BEARTRAP', TRAP_X, TRAP_Y);

describe('patchCrushedEnemies', () => {
  it('should kill the enemy when it closes on one', () => {
    const prey = createEnemyAt('HOPPING', TRAP_X, TRAP_Y);

    const [snapped, caught] = patchCrushedEnemies([TRAP, prey]);

    expect(caught.timers.death).toBe(DEATH_STARTED);
    expect(snapped.timers.death).toBe(null);
  });

  it('should kill the enemy when the one it closes on is horned', () => {
    const [, caught] = patchCrushedEnemies([
      TRAP,
      createEnemyAt('HORNED', TRAP_X + OVERLAP_OFFSET, TRAP_Y - OVERLAP_OFFSET),
    ]);

    expect(caught.timers.death).toBe(DEATH_STARTED);
  });

  it('should leave the enemy alone when the trap is nowhere near it', () => {
    const prey = createEnemyAt('HOPPING', TRAP_X + TILE_SIZE * 3, TRAP_Y);

    expect(patchCrushedEnemies([TRAP, prey])).toEqual([TRAP, prey]);
  });

  it('should leave the other trap alone when it is sitting on one', () => {
    const other = createEnemyAt('BEARTRAP', TRAP_X, TRAP_Y);

    expect(patchCrushedEnemies([TRAP, other])).toEqual([TRAP, other]);
  });

  it('should leave the enemies alone when the trap is dying itself', () => {
    const dying = { ...TRAP, timers: { death: 0.1, reload: 0 } };
    const prey = createEnemyAt('HOPPING', TRAP_X, TRAP_Y);

    expect(patchCrushedEnemies([dying, prey])).toEqual([dying, prey]);
  });

  it('should leave the enemy where it lies when it is already dying', () => {
    const dying = {
      ...createEnemyAt('HOPPING', TRAP_X, TRAP_Y),
      timers: { death: 0.2, reload: 0 },
    };

    expect(patchCrushedEnemies([TRAP, dying])).toEqual([TRAP, dying]);
  });

  it('should hand the enemies back untouched when no trap is laid', () => {
    const crowd = [
      createEnemyAt('HOPPING', TRAP_X, TRAP_Y),
      createEnemyAt('HORNED', TRAP_X, TRAP_Y),
    ];

    expect(patchCrushedEnemies(crowd)).toEqual(crowd);
  });

  it('should leave the given enemies unchanged when it closes the trap', () => {
    const prey = createEnemyAt('HOPPING', TRAP_X, TRAP_Y);
    const enemies = [TRAP, prey];

    patchCrushedEnemies(enemies);

    expect(enemies).toEqual([
      createEnemyAt('BEARTRAP', TRAP_X, TRAP_Y),
      createEnemyAt('HOPPING', TRAP_X, TRAP_Y),
    ]);
  });
});
