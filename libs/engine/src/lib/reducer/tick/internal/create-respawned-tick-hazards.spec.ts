import {
  type Bullet,
  type Cannonball,
  MOON_MAGNET,
  type Player,
  type Tile,
  TILE_AIR,
  TILE_CANNON,
  TILE_DIRT,
  TILE_ENEMY,
  TILE_FIREBALL,
  TILE_SPAWN,
  TILE_SPIKE_FALLING,
} from '@mander/model';
import { head, map, size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { createInitialState } from '../../../state/create-initial-state';
import type { GameLevel } from '../../../types/game-level';
import type { GameState } from '../../../types/game-state';
import { createEnemies } from '../../enemy/create-enemies';
import { createFallingSpikes } from '../../falling-spike/create-falling-spikes';
import { createFireballs } from '../../fireball/create-fireballs';
import { createPlayerFireballs } from '../../fireball/create-player-fireballs';
import { createReloadedBarrage } from './create-reloaded-barrage';
import { createRespawnedTickHazards } from './create-respawned-tick-hazards';

const LEGEND: Record<string, Tile> = {
  '.': TILE_AIR,
  '#': TILE_DIRT,
  c: TILE_CANNON,
  e: TILE_ENEMY,
  f: TILE_FIREBALL,
  s: TILE_SPAWN,
  v: TILE_SPIKE_FALLING,
};

const createLevel = (rows: string[]): GameLevel => ({
  seed: 'SEED',
  width: size(head(rows)),
  height: size(rows),
  tiles: map(rows, (row) => map(row, (symbol) => LEGEND[symbol])),
  chestItems: [],
  hornedEnemyChance: 0,
});

const LEVEL = createLevel(['..c.....', '...v..f.', 's...e...', '########']);

const CANNONBALL: Cannonball = {
  position: { x: 100, y: 10 },
  velocity: { x: { current: 200, max: 200 } },
};

const BULLET: Bullet = {
  position: { x: 50, y: 60 },
  velocity: { x: { current: 300, max: 300 } },
};

const createState = (): GameState => ({
  ...createInitialState(LEVEL, 0, [MOON_MAGNET]),
  enemies: [],
  cannons: [],
  cannonballs: [CANNONBALL],
  fallingSpikes: [],
  fireballs: [],
  playerFireballs: [],
  bullets: [BULLET],
});

const createMovedPlayer = (): Player => ({
  ...createInitialState(LEVEL, 0, [MOON_MAGNET]).player,
  position: { x: 200, y: 32 },
});

describe('createRespawnedTickHazards', () => {
  it('should rebuild the enemies, cannons, cannonballs, falling spikes and fireballs from the level when the hazards respawn', () => {
    const state = createState();

    const hazards = createRespawnedTickHazards(state, createMovedPlayer());

    expect(hazards.steppedEnemies).toEqual(createEnemies(LEVEL));
    expect(hazards.cannons).toEqual(createReloadedBarrage(LEVEL).cannons);
    expect(hazards.flying).toEqual(createReloadedBarrage(LEVEL).cannonballs);
    expect(hazards.fallingSpikes).toEqual(createFallingSpikes(LEVEL));
    expect(hazards.fireballs).toEqual(createFireballs(LEVEL));
  });

  it('should ring the given player with the moons of the inventory and give no flying bullets when the hazards respawn', () => {
    const state = createState();
    const player = createMovedPlayer();

    const hazards = createRespawnedTickHazards(state, player);

    expect(hazards.playerFireballs).toEqual(
      createPlayerFireballs([MOON_MAGNET], player, true),
    );
    expect(size(hazards.playerFireballs)).toBe(2);
    expect(hazards.flyingBullets).toEqual([]);
  });
});
