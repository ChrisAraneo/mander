import type { GameState } from '@mander/engine';
import type { Enemy } from '@mander/model';
import { describe, expect, it } from 'vitest';

import { createRenderTestState } from '../../test/create-render-test-state';
import { interpolateState } from './interpolate-state';

const ROWS = ['.......', '.@.....', '#######'];

const createTestEnemy = (spawnX: number, positionX: number): Enemy => ({
  kind: 'HOPPING',
  position: { x: positionX, y: 32 },
  velocity: { x: { current: 0, max: 0 }, y: { current: 0, max: 0 } },
  timers: { death: null },
  spawn: { x: spawnX, y: 32 },
  statuses: { isFacingRight: true, isGrounded: true },
});

const BASE_STATE = createRenderTestState(ROWS);

const createFrame = (
  playerX: number,
  enemies: Enemy[],
  time: number,
): GameState =>
  createRenderTestState(ROWS, {
    enemies,
    time,
    player: { ...BASE_STATE.player, position: { x: playerX, y: 40 } },
  });

describe('interpolateState', () => {
  it('should hand back the current state when both frames are the same state', () => {
    const state = createFrame(100, [], 1);

    const result = interpolateState(state, state, 0.5);

    expect(result).toBe(state);
  });

  it('should hand back the current state when the frames belong to different levels', () => {
    const previous = createFrame(100, [], 1);
    const current = { ...createFrame(110, [], 2), levelIndex: 1 };

    const result = interpolateState(previous, current, 0.5);

    expect(result).toBe(current);
  });

  it('should place the player between the two frames when the player moved a little', () => {
    const previous = createFrame(100, [], 1);
    const current = createFrame(110, [], 2);

    const result = interpolateState(previous, current, 0.25);

    expect(result.player.position.x).toBeCloseTo(102.5, 6);
    expect(result.player.position.y).toBe(40);
  });

  it('should jump the player to the new place when the player moved further than two tiles', () => {
    const previous = createFrame(100, [], 1);
    const current = createFrame(200, [], 2);

    const result = interpolateState(previous, current, 0.25);

    expect(result.player.position).toEqual({ x: 200, y: 40 });
  });

  it('should place each enemy between its two frames when the enemy is found by its spawn', () => {
    const previous = createFrame(100, [createTestEnemy(64, 10)], 1);
    const current = createFrame(100, [createTestEnemy(64, 20)], 2);

    const result = interpolateState(previous, current, 0.5);

    expect(result.enemies[0].position.x).toBeCloseTo(15, 6);
  });

  it('should leave an enemy where it is when the enemy was not in the previous frame', () => {
    const previous = createFrame(100, [createTestEnemy(64, 10)], 1);
    const current = createFrame(100, [createTestEnemy(128, 20)], 2);

    const result = interpolateState(previous, current, 0.5);

    expect(result.enemies).toEqual([createTestEnemy(128, 20)]);
  });

  it('should blend the clock when it moves between two frames', () => {
    const previous = createFrame(100, [], 1);
    const current = createFrame(110, [], 2);

    const result = interpolateState(previous, current, 0.25);

    expect(result.time).toBeCloseTo(1.25, 6);
  });

  it('should not change either frame when it moves between them', () => {
    const previous = createFrame(100, [createTestEnemy(64, 10)], 1);
    const current = createFrame(110, [createTestEnemy(64, 20)], 2);

    interpolateState(previous, current, 0.5);

    expect(previous).toEqual(createFrame(100, [createTestEnemy(64, 10)], 1));
    expect(current).toEqual(createFrame(110, [createTestEnemy(64, 20)], 2));
  });
});
