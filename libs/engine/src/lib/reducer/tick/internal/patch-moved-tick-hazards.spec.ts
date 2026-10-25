import {
  type Bullet,
  type Cannonball,
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
import { nextBullets } from '../../bullet/next-bullets';
import { nextFallingSpikes } from '../../falling-spike/next-falling-spikes';
import { nextFireballs } from '../../fireball/next-fireballs';
import { patchMovedBarrage } from './patch-moved-barrage';
import { patchMovedEnemies } from './patch-moved-enemies';
import { patchMovedTickHazards } from './patch-moved-tick-hazards';

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

const DELTA_SECONDS = 0.02;

const createCannonball = (): Cannonball => ({
  position: { x: 100, y: 10 },
  velocity: { x: { current: 200, max: 200 } },
});

const createBullet = (): Bullet => ({
  position: { x: 50, y: 60 },
  velocity: { x: { current: 300, max: 300 } },
});

const createState = (): GameState => ({
  ...createInitialState(LEVEL, 0, []),
  cannonballs: [createCannonball()],
  bullets: [createBullet()],
});

const createMovedPlayer = (): Player => ({
  ...createInitialState(LEVEL, 0, []).player,
  position: { x: 120, y: 32 },
});

describe('patchMovedTickHazards', () => {
  it('should give the hazards their own advance steps give when the hazards move for a tick', () => {
    const state = createState();
    const player = createMovedPlayer();

    const hazards = patchMovedTickHazards(state, player, DELTA_SECONDS);

    expect(hazards).toEqual({
      steppedEnemies: patchMovedEnemies(state, player, DELTA_SECONDS),
      cannons: patchMovedBarrage(state, player, DELTA_SECONDS).cannons,
      flying: patchMovedBarrage(state, player, DELTA_SECONDS).cannonballs,
      fallingSpikes: nextFallingSpikes(
        LEVEL,
        state.fallingSpikes,
        player,
        DELTA_SECONDS,
      ),
      fireballs: nextFireballs(state.fireballs, DELTA_SECONDS),
      flyingBullets: nextBullets(LEVEL, state.bullets, DELTA_SECONDS),
    });
  });

  it('should leave the given game alone when the hazards move for a tick', () => {
    const state = createState();

    patchMovedTickHazards(state, createMovedPlayer(), DELTA_SECONDS);

    expect(state).toEqual(createState());
  });
});
