import {
  type Enemy,
  type Player,
  type Tile,
  TILE_AIR,
  TILE_DIRT,
  TILE_SIZE,
} from '@mander/model';
import { head, map, size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { BASE_HEARTS } from '../../player/consts';
import { createPlayer } from '../../player/create-player';
import type { GameLevel } from '../../state/types/game-level';
import { SHOOTER_RELOAD_SECONDS } from '../consts';
import { createShooterShot } from './create-shooter-shot';
import { createShotCannonball } from './create-shot-cannonball';

const ENEMY_LEFT = 10 * TILE_SIZE;
const ENEMY_TOP = 2 * TILE_SIZE;
const ENEMY_TOP_MOVE_SPEED = 39;
const ENEMY_TOP_FALL_SPEED = 301;
const PLAYER_TOP = 56;

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
  position: { x: 600, y: PLAYER_TOP },
};

const createShooter = (reload: number): Enemy => ({
  kind: 'SHOOTER',
  position: { x: ENEMY_LEFT, y: ENEMY_TOP },
  velocity: {
    x: { current: 0, max: ENEMY_TOP_MOVE_SPEED },
    y: { current: 0, max: ENEMY_TOP_FALL_SPEED },
  },
  timers: { death: null, reload },
  spawn: { x: ENEMY_LEFT, y: ENEMY_TOP },
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
