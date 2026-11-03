import {
  ENEMY_HEIGHT,
  ENEMY_WIDTH,
  PLAYER_HEIGHT,
  PLAYER_WIDTH,
} from '@mander/engine';
import type { Enemy, EnemyKind } from '@mander/model';
import { size, times } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { createRenderTestState } from '../../../test/create-render-test-state';
import { MAX_LIGHT_OCCLUDERS } from '../consts';
import type { LightingScene } from '../types/lighting-scene';
import { findLightOccluders } from './find-light-occluders';

const BASE_STATE = createRenderTestState(['.@.', '###']);

const createEnemy = (
  x: number,
  kind: EnemyKind = 'HOPPING',
  death: number | null = null,
): Enemy => ({
  kind,
  position: { x, y: 10 },
  velocity: { x: { current: 0, max: 0 }, y: { current: 0, max: 0 } },
  timers: { death, reload: 0 },
  spawn: { x, y: 10 },
  statuses: { isFacingRight: true, isGrounded: true },
});

const createScene = (
  enemies: Enemy[],
  death: number | null = null,
): LightingScene => ({
  state: {
    ...BASE_STATE,
    enemies,
    player: {
      ...BASE_STATE.player,
      position: { x: 50, y: 60 },
      timers: { ...BASE_STATE.player.timers, death },
    },
  },
  viewport: { width: 320, height: 160, scale: 1 },
  cameraX: 0,
  cameraY: 0,
});

const PLAYER_BOX = {
  x: 50,
  y: 60,
  width: PLAYER_WIDTH,
  height: PLAYER_HEIGHT,
};

describe('findLightOccluders', () => {
  it('should give the box of the player when the player is alive', () => {
    expect(findLightOccluders(createScene([]))).toEqual([PLAYER_BOX]);
  });

  it('should leave the player out when the player is dying', () => {
    expect(findLightOccluders(createScene([], 0.5))).toEqual([]);
  });

  it('should give the box of an enemy after the player when an enemy is in view', () => {
    expect(findLightOccluders(createScene([createEnemy(100)]))).toEqual([
      PLAYER_BOX,
      { x: 100, y: 10, width: ENEMY_WIDTH, height: ENEMY_HEIGHT },
    ]);
  });

  it('should leave an enemy out when it is dying', () => {
    expect(
      findLightOccluders(createScene([createEnemy(100, 'HOPPING', 0.5)])),
    ).toEqual([PLAYER_BOX]);
  });

  it('should leave a beartrap out when one is in view because it lies flat', () => {
    expect(
      findLightOccluders(createScene([createEnemy(100, 'BEARTRAP')])),
    ).toEqual([PLAYER_BOX]);
  });

  it('should leave an enemy out when it is far outside the view', () => {
    expect(findLightOccluders(createScene([createEnemy(5000)]))).toEqual([
      PLAYER_BOX,
    ]);
  });

  it('should stop at the limit when there are more occluders than the shader holds', () => {
    const enemies = times(MAX_LIGHT_OCCLUDERS + 5, (index) =>
      createEnemy(index),
    );

    expect(size(findLightOccluders(createScene(enemies)))).toBe(
      MAX_LIGHT_OCCLUDERS,
    );
  });

  it('should keep the player when the enemies alone would fill the limit', () => {
    const enemies = times(MAX_LIGHT_OCCLUDERS + 5, (index) =>
      createEnemy(index),
    );

    expect(findLightOccluders(createScene(enemies))[0]).toEqual(PLAYER_BOX);
  });
});
