import {
  type Bullet,
  type Cannonball,
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

import { createEnemies } from '../../enemy/create-enemies';
import { createFallingSpikes } from '../../falling-spike/create-falling-spikes';
import { createFireballs } from '../../fireball/create-fireballs';
import { FIRST_LEVEL_INDEX } from '../../load-level/consts';
import { createInitialState } from '../../start/create-initial-state';
import type { GameLevel } from '../../state/types/game-level';
import type { GameState } from '../../state/types/game-state';
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
  fastEnemyChance: 0,
  shooterEnemyChance: 0,
  freezingEnemyChance: 0,
});

const LEVEL = createLevel(['..c.....', '...v..f.', 's...e...', '########']);

const BARE_LEVEL = createLevel([
  '........',
  '........',
  's.......',
  '########',
]);

const CANNONBALL: Cannonball = {
  position: { x: 100, y: 10 },
  velocity: { x: { current: 200, max: 200 }, y: { current: 0, max: 200 } },
};

const BULLET: Bullet = {
  position: { x: 50, y: 60 },
  velocity: { x: { current: 300, max: 300 } },
};

const createState = (): GameState => ({
  ...createInitialState(LEVEL, FIRST_LEVEL_INDEX, []),
  enemies: [],
  cannons: [],
  cannonballs: [CANNONBALL],
  fallingSpikes: [],
  fireballs: [],
  bullets: [BULLET],
});

describe('createRespawnedTickHazards', () => {
  it('should rebuild the enemies, cannons, cannonballs, falling spikes and fireballs from the level when the hazards respawn', () => {
    const state = createState();

    const hazards = createRespawnedTickHazards(state);

    expect(hazards.steppedEnemies).toEqual(createEnemies(LEVEL));
    expect(hazards.cannons).toEqual(createReloadedBarrage(LEVEL).cannons);
    expect(hazards.cannonballs).toEqual(
      createReloadedBarrage(LEVEL).cannonballs,
    );
    expect(hazards.fallingSpikes).toEqual(createFallingSpikes(LEVEL));
    expect(hazards.fireballs).toEqual(createFireballs(LEVEL));
  });

  it('should give no flying bullets when the hazards respawn', () => {
    const hazards = createRespawnedTickHazards(createState());

    expect(hazards.flyingBullets).toEqual([]);
  });

  it('should give no hazards at all when the level holds none', () => {
    const hazards = createRespawnedTickHazards(
      createInitialState(BARE_LEVEL, FIRST_LEVEL_INDEX, []),
    );

    expect(hazards).toEqual({
      steppedEnemies: [],
      cannons: [],
      cannonballs: [],
      snowballs: [],
      fallingSpikes: [],
      fireballs: [],
      flyingBullets: [],
    });
  });
});
