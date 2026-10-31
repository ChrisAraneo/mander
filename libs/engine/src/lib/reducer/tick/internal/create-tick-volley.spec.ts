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
import { head, map, size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { createInitialState } from '../../../state/create-initial-state';
import type { GameLevel } from '../../../types/game-level';
import type { Volley } from '../../bullet/types/volley';
import { computeTickHarm } from './compute-tick-harm';
import { computeTickHazards } from './compute-tick-hazards';
import { computeTickPlayer } from './compute-tick-player';
import { computeTickStomps } from './compute-tick-stomps';
import { createTickVolley } from './create-tick-volley';
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
  fastEnemyChance: 0,
  shooterEnemyChance: 0,
  freezingEnemyChance: 0,
});

const LEVEL = createLevel([
  '..c.......',
  '...v..f...',
  's...e...e.',
  '##########',
]);

const BASE_STATE = createInitialState(LEVEL, 0, []);

const HARM: TickHarm = computeTickHarm(
  computeTickStomps(
    computeTickHazards(
      computeTickPlayer({
        state: {
          ...BASE_STATE,
          input: { isLeft: false, isRight: true, isJump: false },
        },
        deltaSeconds: 0.02,
      }),
    ),
  ),
);

const VOLLEY: Volley = {
  bullets: [],
  enemies: [...HARM.afterStomps],
  fallingSpikes: [...HARM.fallingSpikes],
  level: { ...LEVEL },
};

describe('createTickVolley', () => {
  it('should give the bullets of the volley when the volley is made', () => {
    const tick = createTickVolley(HARM, VOLLEY);

    expect(tick.bullets).toBe(VOLLEY.bullets);
  });

  it('should give the enemies of the volley as the shot ones when the volley is made', () => {
    const tick = createTickVolley(HARM, VOLLEY);

    expect(tick.shot).toBe(VOLLEY.enemies);
  });

  it('should give the falling spikes of the volley as the unshot ones when the volley is made', () => {
    const tick = createTickVolley(HARM, VOLLEY);

    expect(tick.unshot).toBe(VOLLEY.fallingSpikes);
  });

  it('should give the level of the volley when the volley is made', () => {
    const tick = createTickVolley(HARM, VOLLEY);

    expect(tick.level).toBe(VOLLEY.level);
  });

  it('should give no shot enemies when the volley has no enemies', () => {
    const tick = createTickVolley(HARM, { ...VOLLEY, enemies: [] });

    expect(tick.shot).toEqual([]);
  });

  it('should pass the same game on when the volley is made', () => {
    const tick = createTickVolley(HARM, VOLLEY);

    expect(tick.state).toBe(HARM.state);
  });

  it('should pass the same elapsed time on when the volley is made', () => {
    const tick = createTickVolley(HARM, VOLLEY);

    expect(tick.deltaSeconds).toBe(HARM.deltaSeconds);
  });

  it('should pass the same cannons on when the volley is made', () => {
    const tick = createTickVolley(HARM, VOLLEY);

    expect(tick.cannons).toBe(HARM.cannons);
  });

  it('should pass the same flying cannonballs on when the volley is made', () => {
    const tick = createTickVolley(HARM, VOLLEY);

    expect(tick.flying).toBe(HARM.flying);
  });

  it('should pass the same fireballs on when the volley is made', () => {
    const tick = createTickVolley(HARM, VOLLEY);

    expect(tick.fireballs).toBe(HARM.fireballs);
  });

  it('should pass the same cannonball hits on when the volley is made', () => {
    const tick = createTickVolley(HARM, VOLLEY);

    expect(tick.hits).toBe(HARM.hits);
  });

  it('should pass the same player on when the volley is made', () => {
    const tick = createTickVolley(HARM, VOLLEY);

    expect(tick.player).toBe(HARM.player);
  });

  it('should pass the same deaths on when the volley is made', () => {
    const tick = createTickVolley(HARM, VOLLEY);

    expect(tick.deaths).toBe(HARM.deaths);
  });

  it('should pass the same game status on when the volley is made', () => {
    const tick = createTickVolley(HARM, VOLLEY);

    expect(tick.status).toBe(HARM.status);
  });
});
