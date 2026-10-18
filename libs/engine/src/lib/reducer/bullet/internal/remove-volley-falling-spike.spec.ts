import {
  type Bullet,
  type Tile,
  TILE_AIR,
  TILE_DIRT,
  TILE_ENEMY,
  TILE_SPIKE_FALLING,
} from '@mander/model';
import { head, map, size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import type { GameLevel } from '../../../types/game-level';
import { createEnemies } from '../../enemy/create-enemies';
import { createFallingSpikes } from '../../falling-spike/create-falling-spikes';
import { BULLET_SPEED } from '../consts';
import type { Volley } from '../types/volley';
import { removeVolleyFallingSpike } from './remove-volley-falling-spike';

const LEGEND: Record<string, Tile> = {
  '.': TILE_AIR,
  '#': TILE_DIRT,
  e: TILE_ENEMY,
  f: TILE_SPIKE_FALLING,
};

const createLevel = (rows: string[]): GameLevel => ({
  seed: 'SEED',
  width: size(head(rows)),
  height: size(rows),
  tiles: map(rows, (row) => map(row, (symbol) => LEGEND[symbol])),
  chestItems: [],
  hornedEnemyChance: 0,
});

const LEVEL = createLevel(['f...f', '...e.', '#####']);

const createBulletAt = (left: number, top: number): Bullet => ({
  position: { x: left, y: top },
  velocity: { x: { current: BULLET_SPEED, max: BULLET_SPEED } },
});

const createVolley = (): Volley => ({
  bullets: [createBulletAt(10, 40)],
  enemies: createEnemies(LEVEL),
  fallingSpikes: createFallingSpikes(LEVEL),
  level: LEVEL,
});

describe('removeVolleyFallingSpike', () => {
  it('should take the falling spike out of the volley when the bullet knocks it out', () => {
    const volley = createVolley();

    const result = removeVolleyFallingSpike(volley, volley.fallingSpikes[0]);

    expect(result.fallingSpikes).toEqual([volley.fallingSpikes[1]]);
    expect(result.fallingSpikes[0]).toBe(volley.fallingSpikes[1]);
  });

  it('should keep every falling spike when the spike knocked out is only a copy of one in the volley', () => {
    const volley = createVolley();

    const result = removeVolleyFallingSpike(volley, {
      ...volley.fallingSpikes[0],
    });

    expect(result.fallingSpikes).toEqual(volley.fallingSpikes);
    expect(result.fallingSpikes[0]).toBe(volley.fallingSpikes[0]);
  });

  it('should keep the same bullets when it takes a falling spike out', () => {
    const volley = createVolley();

    const result = removeVolleyFallingSpike(volley, volley.fallingSpikes[0]);

    expect(result.bullets).toBe(volley.bullets);
  });

  it('should keep the same enemies when it takes a falling spike out', () => {
    const volley = createVolley();

    const result = removeVolleyFallingSpike(volley, volley.fallingSpikes[0]);

    expect(result.enemies).toBe(volley.enemies);
  });

  it('should keep the same level when it takes a falling spike out', () => {
    const volley = createVolley();

    const result = removeVolleyFallingSpike(volley, volley.fallingSpikes[0]);

    expect(result.level).toBe(volley.level);
  });

  it('should leave the falling spikes of the given volley alone when it takes one out', () => {
    const volley = createVolley();
    const fallingSpikes = volley.fallingSpikes;

    removeVolleyFallingSpike(volley, volley.fallingSpikes[0]);

    expect(volley.fallingSpikes).toBe(fallingSpikes);
    expect(volley.fallingSpikes).toEqual(createFallingSpikes(LEVEL));
  });
});
