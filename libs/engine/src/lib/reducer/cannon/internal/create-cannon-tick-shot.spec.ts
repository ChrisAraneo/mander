import {
  type Cannon,
  type Player,
  type Tile,
  TILE_AIR,
  TILE_DIRT,
} from '@mander/model';
import { head, map, size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import type { GameLevel } from '../../../types/game-level';
import { BASE_HEARTS } from '../../player/consts';
import { createPlayer } from '../../player/create-player';
import { CANNON_RELOAD_SECONDS } from '../consts';
import { createFiredCannonball } from '../create-fired-cannonball';
import { createCannonTickShot } from './create-cannon-tick-shot';

const LEGEND: Record<string, Tile> = { '.': TILE_AIR, '#': TILE_DIRT };

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

const LEVEL = createLevel(['.....', '.....', '#####']);

const BASE_PLAYER = createPlayer(LEVEL, { hearts: { value: BASE_HEARTS } });

const createPlayerAt = (left: number): Player => ({
  ...BASE_PLAYER,
  position: { x: left, y: 56 },
});

const createCannon = (reload: number): Cannon => ({
  kind: 'REGULAR',
  barrelAngle: 0,
  roundIndex: 0,
  position: { x: 320, y: 64 },
  timers: { reload },
  statuses: { isFacingRight: true },
});

describe('createCannonTickShot', () => {
  it('should keep the same cannon, keep its reload and fire nothing when the player is out of range', () => {
    const cannon = createCannon(0);

    const shot = createCannonTickShot(cannon, createPlayerAt(1100), 0.5);

    expect(shot.cannon).toBe(cannon);
    expect(shot.cannon.timers.reload).toBe(0);
    expect(shot.cannonball).toBeUndefined();
  });

  it('should count down the reload and fire nothing when the player is in range and the cannon is still loading', () => {
    const cannon = createCannon(10);

    const shot = createCannonTickShot(cannon, createPlayerAt(400), 0.02);

    expect(shot.cannon.timers.reload).toBeCloseTo(9.98, 6);
    expect(shot.cannonball).toBeUndefined();
  });

  it('should fire a cannonball and start a new reload when the player is in range and the cannon finishes loading', () => {
    const cannon = createCannon(0.01);

    const shot = createCannonTickShot(cannon, createPlayerAt(400), 0.02);

    expect(shot.cannonball).toEqual(createFiredCannonball(cannon, 0));
    expect(shot.cannon.timers.reload).toBeCloseTo(
      0.01 - 0.02 + CANNON_RELOAD_SECONDS,
      6,
    );
  });

  it('should turn the barrel towards the next round when the player is in range and the shot is close', () => {
    const cannon: Cannon = { ...createCannon(0.5), kind: 'TRIPLE' };

    const shot = createCannonTickShot(cannon, createPlayerAt(400), 0.02);

    expect(shot.cannon.barrelAngle).toBeLessThan(0);
  });

  it('should hold the barrel where it is when the player is out of range', () => {
    const cannon: Cannon = {
      ...createCannon(0.5),
      kind: 'TRIPLE',
      barrelAngle: -0.1,
    };

    const shot = createCannonTickShot(cannon, createPlayerAt(1100), 0.02);

    expect(shot.cannon.barrelAngle).toBe(-0.1);
  });
});
