import {
  type Tile,
  TILE_AIR,
  TILE_CANNON,
  TILE_DIRT,
  TILE_ENEMY,
  TILE_FIREBALL,
  TILE_SPAWN,
  TILE_SPIKE_FALLING,
} from '@mander/model';
import { head, map, nth, size, take } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { createInitialState } from '../../../state/create-initial-state';
import type { GameLevel } from '../../../types/game-level';
import type { GameState } from '../../../types/game-state';
import { computeVolley } from '../../bullet/compute-volley';
import { createFiredBullet } from '../../bullet/create-fired-bullet';
import { computeHarmVolley } from './compute-harm-volley';
import { computeTickHarm } from './compute-tick-harm';
import { computeTickHazards } from './compute-tick-hazards';
import { computeTickPlayer } from './compute-tick-player';
import { computeTickStomps } from './compute-tick-stomps';
import { patchStruckEnemies } from './patch-struck-enemies';
import type { TickHarm } from './types/tick-harm';

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

const LEVEL = createLevel([
  '..c.......',
  '...v..f...',
  's...e...e.',
  '##########',
]);

const BASE_STATE = createInitialState(LEVEL, 0, []);

const STATE: GameState = {
  ...BASE_STATE,
  input: { isLeft: false, isRight: true, isJump: false },
  bullets: [createFiredBullet(BASE_STATE.player)],
};

const HARM: TickHarm = computeTickHarm(
  computeTickStomps(
    computeTickHazards(computeTickPlayer({ state: STATE, deltaSeconds: 0.02 })),
  ),
);

describe('computeHarmVolley', () => {
  it('should fly the bullets at the enemies left after the stomps and the gore when the player shoots', () => {
    const volley = computeHarmVolley(HARM);

    expect(volley).toEqual(
      computeVolley(
        HARM.flyingBullets,
        patchStruckEnemies(HARM.afterStomps, HARM.gored),
        HARM.fallingSpikes,
        HARM.state.level,
      ),
    );
  });

  it('should start the death of a gored enemy before the bullets fly when the player is gored', () => {
    const harm: TickHarm = {
      ...HARM,
      flyingBullets: [],
      gored: take(HARM.afterStomps, 1),
    };

    const volley = computeHarmVolley(harm);

    expect(head(volley.enemies)?.timers.death).toBe(0);
    expect(nth(volley.enemies, 1)).toBe(nth(HARM.afterStomps, 1));
  });

  it('should leave the enemies, the falling spikes and the level alone when no bullet flies', () => {
    const harm: TickHarm = { ...HARM, flyingBullets: [], gored: [] };

    const volley = computeHarmVolley(harm);

    expect(volley.bullets).toEqual([]);
    expect(volley.enemies).toEqual(HARM.afterStomps);
    expect(volley.fallingSpikes).toBe(HARM.fallingSpikes);
    expect(volley.level).toBe(HARM.state.level);
  });
});
