import {
  type Enemy,
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
import { SHOOTER_RELOAD_SECONDS } from '../consts';
import { createShooterShot } from './create-shooter-shot';
import { createShotCannonball } from './create-shot-cannonball';

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

const PLAYER: Player = {
  ...createPlayer(LEVEL, { hearts: { value: BASE_HEARTS } }),
  position: { x: 600, y: 56 },
};

const createShooter = (reload: number): Enemy => ({
  kind: 'SHOOTER',
  position: { x: 320, y: 64 },
  velocity: {
    x: { current: 0, max: 39 },
    y: { current: 0, max: 301 },
  },
  timers: { death: null, reload },
  spawn: { x: 320, y: 64 },
  statuses: { isFacingRight: true, isGrounded: true },
});

describe('createShooterShot', () => {
  it('should hold the shot when the shooter is still loading', () => {
    const shooter = createShooter(1.5);

    const shot = createShooterShot(shooter, PLAYER);

    expect(shot.enemy).toBe(shooter);
    expect(shot.cannonball).toBeUndefined();
  });

  it('should fire a cannonball when the reload has run out', () => {
    const shooter = createShooter(0);

    const shot = createShooterShot(shooter, PLAYER);

    expect(shot.cannonball).toEqual(createShotCannonball(shooter, PLAYER));
  });

  it('should start a fresh reload when the reload has run out', () => {
    const shot = createShooterShot(createShooter(0), PLAYER);

    expect(shot.enemy.timers.reload).toBe(SHOOTER_RELOAD_SECONDS);
  });

  it('should carry the overshoot into the fresh reload when the reload went past zero', () => {
    const shot = createShooterShot(createShooter(-0.02), PLAYER);

    expect(shot.enemy.timers.reload).toBeCloseTo(
      SHOOTER_RELOAD_SECONDS - 0.02,
      6,
    );
  });

  it('should keep the walk and the death clock when it fires', () => {
    const shooter = createShooter(0);

    const shot = createShooterShot(shooter, PLAYER);

    expect(shot.enemy.position).toBe(shooter.position);
    expect(shot.enemy.velocity).toBe(shooter.velocity);
    expect(shot.enemy.statuses).toBe(shooter.statuses);
    expect(shot.enemy.timers.death).toBeNull();
  });

  it('should leave the given shooter alone when it fires', () => {
    const shooter = createShooter(0);

    createShooterShot(shooter, PLAYER);

    expect(shooter).toEqual(createShooter(0));
  });
});
