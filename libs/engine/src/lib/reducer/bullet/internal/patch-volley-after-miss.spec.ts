import {
  type Bullet,
  type Tile,
  TILE_AIR,
  TILE_DIRT,
  TILE_SPIKE,
  TILE_SPIKE_FALLING,
} from '@mander/model';
import { head, map, size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import type { GameLevel } from '../../../types/game-level';
import { createFallingSpikes } from '../../falling-spike/create-falling-spikes';
import { BULLET_SPEED } from '../consts';
import type { Volley } from '../types/volley';
import { patchVolleyAfterMiss } from './patch-volley-after-miss';

const LEGEND: Record<string, Tile> = {
  '.': TILE_AIR,
  '#': TILE_DIRT,
  '^': TILE_SPIKE,
  f: TILE_SPIKE_FALLING,
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

const createSpikeLevel = (): GameLevel =>
  createLevel(['f...f', '.....', '.^...', '#####']);

const createBulletAt = (left: number, top: number): Bullet => ({
  position: { x: left, y: top },
  velocity: { x: { current: BULLET_SPEED, max: BULLET_SPEED } },
});

const FLYING_BULLET = createBulletAt(10, 40);

const SPIKE_TILE_BULLET = createBulletAt(40, 80);

const FALLING_SPIKE_BULLET = createBulletAt(10, 5);

const MISSING_BULLET = createBulletAt(70, 40);

const createVolley = (): Volley => ({
  bullets: [createBulletAt(10, 40)],
  enemies: [],
  fallingSpikes: createFallingSpikes(createSpikeLevel()),
  level: createSpikeLevel(),
});

describe('patchVolleyAfterMiss', () => {
  it('should shatter the spike into air when the bullet flies into its prongs', () => {
    const volley = createVolley();

    const result = patchVolleyAfterMiss(volley, SPIKE_TILE_BULLET);

    expect(result.level.tiles).toEqual(
      createLevel(['f...f', '.....', '.....', '#####']).tiles,
    );
  });

  it('should use up the bullet when it shatters a spike', () => {
    const volley = createVolley();

    const result = patchVolleyAfterMiss(volley, SPIKE_TILE_BULLET);

    expect(result.bullets).toBe(volley.bullets);
  });

  it('should keep every falling spike when the bullet shatters a spike tile', () => {
    const volley = createVolley();

    const result = patchVolleyAfterMiss(volley, SPIKE_TILE_BULLET);

    expect(result.fallingSpikes).toBe(volley.fallingSpikes);
  });

  it('should knock out the falling spike when the bullet flies into it', () => {
    const volley = createVolley();

    const result = patchVolleyAfterMiss(volley, FALLING_SPIKE_BULLET);

    expect(result.fallingSpikes).toEqual([volley.fallingSpikes[1]]);
  });

  it('should use up the bullet when it knocks out a falling spike', () => {
    const volley = createVolley();

    const result = patchVolleyAfterMiss(volley, FALLING_SPIKE_BULLET);

    expect(result.bullets).toBe(volley.bullets);
  });

  it('should keep the level as it is when the bullet knocks out a falling spike', () => {
    const volley = createVolley();

    const result = patchVolleyAfterMiss(volley, FALLING_SPIKE_BULLET);

    expect(result.level).toBe(volley.level);
  });

  it('should keep the bullet flying when it hits nothing', () => {
    const volley = createVolley();

    const result = patchVolleyAfterMiss(volley, MISSING_BULLET);

    expect(result.bullets).toEqual([FLYING_BULLET, MISSING_BULLET]);
  });

  it('should keep the level and the falling spikes when the bullet hits nothing', () => {
    const volley = createVolley();

    const result = patchVolleyAfterMiss(volley, MISSING_BULLET);

    expect(result.level).toBe(volley.level);
    expect(result.fallingSpikes).toBe(volley.fallingSpikes);
  });

  it('should leave the given volley alone when the bullet shatters a spike', () => {
    const volley = createVolley();
    const level = volley.level;

    patchVolleyAfterMiss(volley, SPIKE_TILE_BULLET);

    expect(volley.level).toBe(level);
    expect(volley.level.tiles).toEqual(createSpikeLevel().tiles);
  });

  it('should leave the given volley alone when the bullet knocks out a falling spike', () => {
    const volley = createVolley();
    const fallingSpikes = volley.fallingSpikes;

    patchVolleyAfterMiss(volley, FALLING_SPIKE_BULLET);

    expect(volley.fallingSpikes).toBe(fallingSpikes);
    expect(volley.fallingSpikes).toEqual(createVolley().fallingSpikes);
  });
});
