import {
  type Enemy,
  GRAVITY,
  type Player,
  type Tile,
  TILE_AIR,
  TILE_DIRT,
  TILE_ENEMY,
  TILE_SPIKE,
} from '@mander/model';
import { head, map, size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import type { GameLevel } from '../../types/game-level';
import { createPlayer } from '../player/create-player';
import { ENEMY_MOVE_SPEED } from './consts';
import { createEnemies } from './create-enemies';
import { patchEnemy } from './patch-enemy';

const DELTA_SECONDS = 1 / 60;

const LEGEND: Record<string, Tile> = {
  '.': TILE_AIR,
  '#': TILE_DIRT,
  e: TILE_ENEMY,
  '^': TILE_SPIKE,
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

const FLAT_LEVEL = createLevel([
  '..........',
  '..........',
  '....e.....',
  '##########',
]);

const SPIKE_LEVEL = createLevel(['.....', '.....', '..^..', '#####']);

const SPIKE_SPAWN_LEVEL = createLevel(['.....', '.....', '..e..', '#####']);

const FAR_PLAYER: Player = {
  ...createPlayer(FLAT_LEVEL, { hearts: { value: 3 } }),
  position: { x: 600, y: 0 },
};

const createGroundedEnemy = (): Enemy => ({
  ...createEnemies(FLAT_LEVEL)[0],
  statuses: { isFacingRight: true, isGrounded: true },
});

const createDyingEnemy = (): Enemy => ({
  ...createEnemies(FLAT_LEVEL)[0],
  position: { x: 133, y: 20 },
  timers: { death: 0.1, reload: 0 },
});

describe('patchEnemy', () => {
  it('should let a dying enemy fall when it is in the air', () => {
    const enemy = createDyingEnemy();

    const patched = patchEnemy(FLAT_LEVEL, enemy, FAR_PLAYER, DELTA_SECONDS);

    expect(patched.position.x).toBe(133);
    expect(patched.position.y).toBeCloseTo(
      20 + GRAVITY * DELTA_SECONDS * DELTA_SECONDS,
      6,
    );
    expect(patched.velocity.y.current).toBeCloseTo(GRAVITY * DELTA_SECONDS, 6);
  });

  it('should run the death clock on by the time passed when the enemy is dying', () => {
    const enemy = createDyingEnemy();

    const patched = patchEnemy(FLAT_LEVEL, enemy, FAR_PLAYER, DELTA_SECONDS);

    expect(patched.timers.death).toBeCloseTo(0.1 + DELTA_SECONDS, 6);
  });

  it('should walk a living hopping enemy along when it stands on flat ground', () => {
    const enemy = createGroundedEnemy();

    const patched = patchEnemy(FLAT_LEVEL, enemy, FAR_PLAYER, DELTA_SECONDS);

    expect(enemy.kind).toBe('HOPPING');
    expect(patched.position.x).toBeCloseTo(
      enemy.position.x + ENEMY_MOVE_SPEED * DELTA_SECONDS,
      6,
    );
    expect(patched.timers.death).toBeNull();
  });

  it('should start the death of a living enemy when it ends up on a spike', () => {
    const enemy = createEnemies(SPIKE_SPAWN_LEVEL)[0];

    const patched = patchEnemy(SPIKE_LEVEL, enemy, FAR_PLAYER, DELTA_SECONDS);

    expect(patched.timers.death).toBe(0);
    expect(patched.velocity.x.current).toBe(0);
  });

  it('should leave the given enemy unchanged when it is alive', () => {
    const enemy = createGroundedEnemy();

    patchEnemy(FLAT_LEVEL, enemy, FAR_PLAYER, DELTA_SECONDS);

    expect(enemy).toEqual(createGroundedEnemy());
  });

  it('should leave the given enemy unchanged when it is dying', () => {
    const enemy = createDyingEnemy();

    patchEnemy(FLAT_LEVEL, enemy, FAR_PLAYER, DELTA_SECONDS);

    expect(enemy).toEqual(createDyingEnemy());
  });
});
