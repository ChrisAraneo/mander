import { type Enemy, type EnemyKind, TILE_SIZE } from '@mander/model';
import { describe, expect, it } from 'vitest';

import { patchCaughtEnemies } from './patch-caught-enemies';

const TRAP_X = 197;

const TRAP_Y = 362;

const createEnemyAt = (kind: EnemyKind, left: number, top: number): Enemy => ({
  kind,
  position: { x: left, y: top },
  velocity: { x: { current: 30, max: 78 }, y: { current: 0, max: 0 } },
  timers: { death: null },
  spawn: { x: left, y: top },
  statuses: { isFacingRight: true, isGrounded: true },
});

const TRAP = createEnemyAt('BEARTRAP', TRAP_X, TRAP_Y);

describe('patchCaughtEnemies', () => {
  it('should start the death of the enemy when a trap catches it', () => {
    const prey = createEnemyAt('HOPPING', TRAP_X, TRAP_Y);

    const [, caught] = patchCaughtEnemies([TRAP, prey], [TRAP]);

    expect(caught.timers.death).toBe(0);
    expect(caught.velocity.x.current).toBe(0);
  });

  it('should give back the same trap when the trap catches an enemy', () => {
    const prey = createEnemyAt('HOPPING', TRAP_X, TRAP_Y);

    const [snapped] = patchCaughtEnemies([TRAP, prey], [TRAP]);

    expect(snapped).toBe(TRAP);
  });

  it('should give back the same enemy when the trap is nowhere near it', () => {
    const prey = createEnemyAt('HOPPING', TRAP_X + TILE_SIZE * 3, TRAP_Y);

    const [, untouched] = patchCaughtEnemies([TRAP, prey], [TRAP]);

    expect(untouched).toBe(prey);
  });

  it('should give back the same enemies when there are no traps', () => {
    const prey = createEnemyAt('HOPPING', TRAP_X, TRAP_Y);

    const [untouched] = patchCaughtEnemies([prey], []);

    expect(untouched).toBe(prey);
  });

  it('should not change the old enemies when a trap catches one', () => {
    const prey = createEnemyAt('HOPPING', TRAP_X, TRAP_Y);

    patchCaughtEnemies([TRAP, prey], [TRAP]);

    expect(prey).toEqual(createEnemyAt('HOPPING', TRAP_X, TRAP_Y));
  });

  it('should give no enemies when there are no enemies', () => {
    expect(patchCaughtEnemies([], [TRAP])).toEqual([]);
  });
});
