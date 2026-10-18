import { MOON_MAGNET, type Player, type Tile, TILE_AIR, TILE_CANNON, TILE_DIRT, TILE_ENEMY, TILE_FIREBALL, TILE_SPAWN, TILE_SPIKE_FALLING, chain } from '@mander/model';
import { head, map, size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { createInitialState } from '../../../state/create-initial-state';
import type { GameLevel } from '../../../types/game-level';
import type { GameState } from '../../../types/game-state';
import { createCannons } from '../../cannon/create-cannons';
import { createEnemies } from '../../enemy/create-enemies';
import { createFallingSpikes } from '../../falling-spike/create-falling-spikes';
import { createFireballs } from '../../fireball/create-fireballs';
import { createPlayerFireballs } from '../../fireball/create-player-fireballs';
import { createPlayer } from '../../player/create-player';
import { patchRespawnedState } from './patch-respawned-state';

const LEGEND: Record<string, Tile> = {
  '.': TILE_AIR,
  '#': TILE_DIRT,
  S: TILE_SPAWN,
  E: TILE_ENEMY,
  c: TILE_CANNON,
  v: TILE_SPIKE_FALLING,
  f: TILE_FIREBALL,
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
  '..........',
  '.v....f...',
  '.S..E...c.',
  '##########',
]);

const createState = (): GameState =>
  chain(createInitialState(LEVEL, 0, [MOON_MAGNET]))
    .thru((initial): GameState => ({
      ...initial,
      player: {
        ...initial.player,
        position: { x: 200, y: 10 },
        hearts: { value: 1 },
      },
      enemies: [],
      cannons: [],
      cannonballs: [
        {
          position: { x: 100, y: 64 },
          velocity: { x: { current: 5, max: 5 } },
        },
      ],
      fallingSpikes: [],
      fireballs: [],
      playerFireballs: [],
      bullets: [
        {
          position: { x: 120, y: 64 },
          velocity: { x: { current: 8, max: 8 } },
        },
      ],
    }))
    .value();

const createSpawnedPlayer = (): Player =>
  createPlayer(LEVEL, { hearts: { value: 1 } });

describe('patchRespawnedState', () => {
  it('should put the player back at the spawn and rebuild the level dangers when the player respawns', () => {
    const respawned = patchRespawnedState(createState());

    expect(respawned.player).toEqual(createSpawnedPlayer());
    expect(respawned.enemies).toEqual(createEnemies(LEVEL));
    expect(respawned.cannons).toEqual(createCannons(LEVEL));
    expect(respawned.fallingSpikes).toEqual(createFallingSpikes(LEVEL));
    expect(respawned.fireballs).toEqual(createFireballs(LEVEL));
  });

  it('should clear every bullet and cannonball when the player respawns', () => {
    const respawned = patchRespawnedState(createState());

    expect(respawned.cannonballs).toEqual([]);
    expect(respawned.bullets).toEqual([]);
  });

  it('should bring the moons back around the respawned player when the player carries the magnet', () => {
    const respawned = patchRespawnedState(createState());

    expect(respawned.playerFireballs).toEqual(
      createPlayerFireballs([MOON_MAGNET], createSpawnedPlayer(), true),
    );
    expect(respawned.playerFireballs).toHaveLength(2);
  });

  it('should leave the given state unchanged when the player respawns', () => {
    const state = createState();

    patchRespawnedState(state);

    expect(state).toEqual(createState());
  });
});
