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

import type { GameLevel } from '../../../types/game-level';
import { createEnemies } from '../../enemy/create-enemies';
import { createPlayer } from '../../player/create-player';
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
  shooterEnemyChance: 0,
});

const LEVEL = createLevel(['.....', '.....', 's.e..', '#####']);

const createPlayerWith = (invincibility: number): Player => ({
  ...createPlayer(LEVEL, { hearts: { value: 3 } }),
  position: { x: 100, y: 100 },
  timers: { death: null, invincibility, star: 0, hurt: 0 },
});

const createEnemyAt = (
  kind: EnemyKind,
  left: number,
  death: number | null,
): Enemy => ({
  ...createEnemies(LEVEL)[0],
  kind,
  position: { x: left, y: 110 },
  timers: { death, reload: 0 },
});

describe('filterHornedVictims', () => {
  it('should give the horned enemy when a vulnerable player touches a living horned enemy', () => {
    const player = createPlayerWith(0);
    const horned = createEnemyAt('HORNED', 100, null);
    const far = createEnemyAt('HORNED', 300, null);

    const victims = filterHornedVictims(player, [horned, far]);

    expect(victims).toEqual([horned]);
  });

  it('should give the shooter when a vulnerable player touches a living shooter', () => {
    const player = createPlayerWith(0);
    const shooter = createEnemyAt('SHOOTER', 100, null);
    const far = createEnemyAt('SHOOTER', 300, null);

    const victims = filterHornedVictims(player, [shooter, far]);

    expect(victims).toEqual([shooter]);
  });

  it('should give no enemies when the shooter the player touches is dying', () => {
    const player = createPlayerWith(0);
    const dying = createEnemyAt('SHOOTER', 100, 0.1);

    const victims = filterHornedVictims(player, [dying]);

    expect(victims).toEqual([]);
  });

  it('should give no enemies when the player touches enemies of other kinds', () => {
    const player = createPlayerWith(0);
    const enemies = [
      createEnemyAt('HOPPING', 100, null),
      createEnemyAt('FAST', 100, null),
      createEnemyAt('FLYING', 100, null),
      createEnemyAt('BEARTRAP', 100, null),
    ];

    const victims = filterHornedVictims(player, enemies);

    expect(victims).toEqual([]);
  });

  it('should give no enemies when the horned enemy the player touches is dying', () => {
    const player = createPlayerWith(0);
    const dying = createEnemyAt('HORNED', 100, 0.1);

    const victims = filterHornedVictims(player, [dying]);

    expect(victims).toEqual([]);
  });

  it('should give no enemies when the player touching a horned enemy is invincible', () => {
    const player = createPlayerWith(1);
    const horned = createEnemyAt('HORNED', 100, null);

    const victims = filterHornedVictims(player, [horned]);

    expect(victims).toEqual([]);
  });

  it('should give no enemies when there are no enemies', () => {
    const player = createPlayerWith(0);

    const victims = filterHornedVictims(player, []);

    expect(victims).toEqual([]);
  });
});
