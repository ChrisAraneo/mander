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
import { createFiredFreezingShot } from './create-fired-freezing-shot';
import { createShotSnowball } from './create-shot-snowball';

const ENEMY_LEFT = 10 * TILE_SIZE;
const ENEMY_TOP = 2 * TILE_SIZE;
const ENEMY_TOP_MOVE_SPEED = 39;
const ENEMY_TOP_FALL_SPEED = 301;
const PLAYER_LEFT = 600;
const PLAYER_TOP = 56;
const LOADED_RELOAD = 0;
const OVERSHOOT_RELOAD = -0.02;
const PRECISION = 6;

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
  position: { x: PLAYER_LEFT, y: PLAYER_TOP },
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

describe('createFiredFreezingShot', () => {
  it('should throw a snowball at the player when the freezing enemy fires', () => {
    const freezer = createFreezer(LOADED_RELOAD);

    const shot = createFiredFreezingShot(freezer, PLAYER);

    expect(shot.snowball).toEqual(createShotSnowball(freezer, PLAYER));
  });

  it('should start a fresh reload when the freezing enemy fires', () => {
    const shot = createFiredFreezingShot(createFreezer(LOADED_RELOAD), PLAYER);

    expect(shot.enemy.timers.reload).toBe(FREEZING_RELOAD_SECONDS);
  });

  it('should carry the overshoot into the fresh reload when the reload went past zero', () => {
    const shot = createFiredFreezingShot(
      createFreezer(OVERSHOOT_RELOAD),
      PLAYER,
    );

    expect(shot.enemy.timers.reload).toBeCloseTo(
      FREEZING_RELOAD_SECONDS + OVERSHOOT_RELOAD,
      PRECISION,
    );
  });

  it('should keep the walk and the death clock when the freezing enemy fires', () => {
    const freezer = createFreezer(LOADED_RELOAD);

    const shot = createFiredFreezingShot(freezer, PLAYER);

    expect(shot.enemy.position).toBe(freezer.position);
    expect(shot.enemy.velocity).toBe(freezer.velocity);
    expect(shot.enemy.statuses).toBe(freezer.statuses);
    expect(shot.enemy.timers.death).toBeNull();
  });

  it('should leave the given freezing enemy alone when it fires', () => {
    const freezer = createFreezer(LOADED_RELOAD);

    createFiredFreezingShot(freezer, PLAYER);

    expect(freezer).toEqual(createFreezer(LOADED_RELOAD));
  });
});
