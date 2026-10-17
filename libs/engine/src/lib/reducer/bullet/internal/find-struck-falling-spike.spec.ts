import {
  type Bullet,
  type FallingSpike,
  type Tile,
  TILE_AIR,
  TILE_DIRT,
  TILE_SPIKE_FALLING,
} from '@mander/model';
import { head, map, size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import type { GameLevel } from '../../../types/game-level';
import { createFallingSpikes } from '../../falling-spike/create-falling-spikes';
import { BULLET_SPEED } from '../consts';
import { findStruckFallingSpike } from './find-struck-falling-spike';

const LEGEND: Record<string, Tile> = {
  '.': TILE_AIR,
  '#': TILE_DIRT,
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

const LEVEL = createLevel(['f....', '.....', '#####']);

const createFallingSpikeAt = (left: number, top: number): FallingSpike => ({
  ...createFallingSpikes(LEVEL)[0],
  position: { x: left, y: top },
});

const createBulletAt = (left: number, top: number): Bullet => ({
  position: { x: left, y: top },
  velocity: { x: { current: BULLET_SPEED, max: BULLET_SPEED } },
});

const BULLET = createBulletAt(10, 5);

describe('findStruckFallingSpike', () => {
  it('should pick the first falling spike in the list when the bullet overlaps two of them', () => {
    const farSpike = createFallingSpikeAt(128, 0);
    const firstSpike = createFallingSpikeAt(0, 0);
    const secondSpike = createFallingSpikeAt(2, 0);

    const spike = findStruckFallingSpike(BULLET, [
      farSpike,
      firstSpike,
      secondSpike,
    ]);

    expect(spike).toBe(firstSpike);
  });

  it('should find no spike when the bullet misses every falling spike', () => {
    const spikes = [createFallingSpikeAt(128, 0), createFallingSpikeAt(0, 64)];

    const spike = findStruckFallingSpike(BULLET, spikes);

    expect(spike).toBeUndefined();
  });

  it('should find no spike when there are no falling spikes', () => {
    const spike = findStruckFallingSpike(BULLET, []);

    expect(spike).toBeUndefined();
  });
});
