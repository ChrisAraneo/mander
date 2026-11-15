import {
  type Bullet,
  type FallingSpike,
  type Tile,
  TILE_AIR,
  TILE_DIRT,
  TILE_SIZE,
  TILE_SPIKE_FALLING,
} from '@mander/model';
import { head, map, size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { createFallingSpikes } from '../../falling-spike/create-falling-spikes';
import type { GameLevel } from '../../state/types/game-level';
import { BULLET_SPEED } from '../consts';
import { isHittingFallingSpike } from './is-hitting-falling-spike';

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
  fastEnemyChance: 0,
  shooterEnemyChance: 0,
  freezingEnemyChance: 0,
});

const LEVEL = createLevel(['.f...', '.....', '#####']);

const SPIKE: FallingSpike = createFallingSpikes(LEVEL)[0];

const SPIKE_COLUMN = 1;
const SPIKE_MIDDLE = 10;
const LEFT_OF_BODY = 0;
const RIGHT_OF_BODY = 22;
const ABOVE_TIP = 5;
const AT_TIP = 20;
const BELOW_TIP = 22;

const createBulletAt = (left: number, top: number): Bullet => ({
  position: { x: left, y: top },
  velocity: { x: { current: BULLET_SPEED, max: BULLET_SPEED } },
});

describe('isHittingFallingSpike', () => {
  it('should say yes when the bullet flies into the body of the falling spike', () => {
    const bullet = createBulletAt(
      SPIKE_COLUMN * TILE_SIZE + SPIKE_MIDDLE,
      ABOVE_TIP,
    );

    const isHit = isHittingFallingSpike(bullet, SPIKE);

    expect(isHit).toBe(true);
  });

  it('should say yes when the bullet just clips the tip of the falling spike', () => {
    const bullet = createBulletAt(
      SPIKE_COLUMN * TILE_SIZE + SPIKE_MIDDLE,
      AT_TIP,
    );

    const isHit = isHittingFallingSpike(bullet, SPIKE);

    expect(isHit).toBe(true);
  });

  it('should say no when the bullet passes left of the spike inside its tile', () => {
    const bullet = createBulletAt(
      SPIKE_COLUMN * TILE_SIZE + LEFT_OF_BODY,
      ABOVE_TIP,
    );

    const isHit = isHittingFallingSpike(bullet, SPIKE);

    expect(isHit).toBe(false);
  });

  it('should say no when the bullet passes right of the spike inside its tile', () => {
    const bullet = createBulletAt(
      SPIKE_COLUMN * TILE_SIZE + RIGHT_OF_BODY,
      ABOVE_TIP,
    );

    const isHit = isHittingFallingSpike(bullet, SPIKE);

    expect(isHit).toBe(false);
  });

  it('should say no when the bullet passes below the spike inside its tile', () => {
    const bullet = createBulletAt(
      SPIKE_COLUMN * TILE_SIZE + SPIKE_MIDDLE,
      BELOW_TIP,
    );

    const isHit = isHittingFallingSpike(bullet, SPIKE);

    expect(isHit).toBe(false);
  });
});
