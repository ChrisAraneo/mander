import {
  type Enemy,
  type EnemyKind,
  type Player,
  type Tile,
  TILE_AIR,
  TILE_DIRT,
  TILE_ENEMY,
  TILE_SPAWN,
} from '@mander/model';
import { head, map, size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { createEnemies } from '../../enemy/create-enemies';
import { createPlayer } from '../../player/create-player';
import type { GameLevel } from '../../state/types/game-level';
import { filterHornedVictims } from './filter-horned-victims';

const LEGEND: Record<string, Tile> = {
  '.': TILE_AIR,
  '#': TILE_DIRT,
  e: TILE_ENEMY,
  s: TILE_SPAWN,
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

const LEVEL = createLevel(['.....', '.....', 's.e..', '#####']);

const HEARTS = 3;

const PLAYER_X = 100;

const PLAYER_Y = 100;

const TOUCHING_X = PLAYER_X;

const OUT_OF_REACH_X = 300;

const TOUCHING_Y = 110;

const NO_INVINCIBILITY = 0;

const INVINCIBILITY_SECONDS = 1;

const DYING_SECONDS = 0.1;

const createPlayerWith = (invincibility: number): Player => ({
  ...createPlayer(LEVEL, { hearts: { value: HEARTS } }),
  position: { x: PLAYER_X, y: PLAYER_Y },
  timers: { death: null, invincibility, star: 0, hurt: 0, cold: 0 },
});

const FIRST_ENEMY = 0;

const createEnemyAt = (
  kind: EnemyKind,
  left: number,
  death: number | null,
): Enemy => ({
  ...createEnemies(LEVEL)[FIRST_ENEMY],
  kind,
  position: { x: left, y: TOUCHING_Y },
  timers: { death, reload: 0 },
});

describe('filterHornedVictims', () => {
  it('should give the horned enemy when a vulnerable player touches a living horned enemy', () => {
    const player = createPlayerWith(NO_INVINCIBILITY);
    const horned = createEnemyAt('HORNED', TOUCHING_X, null);
    const far = createEnemyAt('HORNED', OUT_OF_REACH_X, null);

    const victims = filterHornedVictims(player, [horned, far]);

    expect(victims).toEqual([horned]);
  });

  it('should give the shooter when a vulnerable player touches a living shooter', () => {
    const player = createPlayerWith(NO_INVINCIBILITY);
    const shooter = createEnemyAt('SHOOTER', TOUCHING_X, null);
    const far = createEnemyAt('SHOOTER', OUT_OF_REACH_X, null);

    const victims = filterHornedVictims(player, [shooter, far]);

    expect(victims).toEqual([shooter]);
  });

  it('should give no enemies when the shooter the player touches is dying', () => {
    const player = createPlayerWith(NO_INVINCIBILITY);
    const dying = createEnemyAt('SHOOTER', TOUCHING_X, DYING_SECONDS);

    const victims = filterHornedVictims(player, [dying]);

    expect(victims).toEqual([]);
  });

  it('should give no enemies when the player touches enemies of other kinds', () => {
    const player = createPlayerWith(NO_INVINCIBILITY);
    const enemies = [
      createEnemyAt('HOPPING', TOUCHING_X, null),
      createEnemyAt('FAST', TOUCHING_X, null),
      createEnemyAt('FLYING', TOUCHING_X, null),
      createEnemyAt('BEARTRAP', TOUCHING_X, null),
    ];

    const victims = filterHornedVictims(player, enemies);

    expect(victims).toEqual([]);
  });

  it('should give no enemies when the horned enemy the player touches is dying', () => {
    const player = createPlayerWith(NO_INVINCIBILITY);
    const dying = createEnemyAt('HORNED', TOUCHING_X, DYING_SECONDS);

    const victims = filterHornedVictims(player, [dying]);

    expect(victims).toEqual([]);
  });

  it('should give no enemies when the player touching a horned enemy is invincible', () => {
    const player = createPlayerWith(INVINCIBILITY_SECONDS);
    const horned = createEnemyAt('HORNED', TOUCHING_X, null);

    const victims = filterHornedVictims(player, [horned]);

    expect(victims).toEqual([]);
  });

  it('should give no enemies when there are no enemies', () => {
    const player = createPlayerWith(NO_INVINCIBILITY);

    const victims = filterHornedVictims(player, []);

    expect(victims).toEqual([]);
  });

  it('should give no enemies when the player touches a freezing enemy', () => {
    const player = createPlayerWith(NO_INVINCIBILITY);
    const freezing = createEnemyAt('FREEZING', TOUCHING_X, null);

    const victims = filterHornedVictims(player, [freezing]);

    expect(victims).toEqual([]);
  });
});
