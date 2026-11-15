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
import { FREEZING_RELOAD_SECONDS } from '../consts';
import { createFreezingShot } from './create-freezing-shot';
import { createShotSnowball } from './create-shot-snowball';

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

const createFreezer = (reload: number): Enemy => ({
  kind: 'FREEZING',
  position: { x: ENEMY_LEFT, y: ENEMY_TOP },
  velocity: {
    x: { current: 0, max: ENEMY_TOP_MOVE_SPEED },
    y: { current: 0, max: ENEMY_TOP_FALL_SPEED },
  },
  timers: { death: null, reload },
  spawn: { x: ENEMY_LEFT, y: ENEMY_TOP },
  statuses: { isFacingRight: true, isGrounded: true },
});

describe('createFreezingShot', () => {
  it('should hold the throw when the freezing enemy is still loading', () => {
    const freezer = createFreezer(1.5);

    const shot = createFreezingShot(freezer, PLAYER);

    expect(shot.enemy).toBe(freezer);
    expect(shot.snowball).toBeUndefined();
  });

  it('should throw a snowball when the reload has run out', () => {
    const freezer = createFreezer(0);

    const shot = createFreezingShot(freezer, PLAYER);

    expect(shot.snowball).toEqual(createShotSnowball(freezer, PLAYER));
  });

  it('should start a fresh reload when the reload has run out', () => {
    const shot = createFreezingShot(createFreezer(0), PLAYER);

    expect(shot.enemy.timers.reload).toBe(FREEZING_RELOAD_SECONDS);
  });

  it('should carry the overshoot into the fresh reload when the reload went past zero', () => {
    const shot = createFreezingShot(createFreezer(-0.02), PLAYER);

    expect(shot.enemy.timers.reload).toBeCloseTo(
      FREEZING_RELOAD_SECONDS - 0.02,
      6,
    );
  });

  it('should keep the walk and the death clock when it throws', () => {
    const freezer = createFreezer(0);

    const shot = createFreezingShot(freezer, PLAYER);

    expect(shot.enemy.position).toBe(freezer.position);
    expect(shot.enemy.velocity).toBe(freezer.velocity);
    expect(shot.enemy.statuses).toBe(freezer.statuses);
    expect(shot.enemy.timers.death).toBeNull();
  });

  it('should leave the given freezing enemy alone when it throws', () => {
    const freezer = createFreezer(0);

    createFreezingShot(freezer, PLAYER);

    expect(freezer).toEqual(createFreezer(0));
  });
});
