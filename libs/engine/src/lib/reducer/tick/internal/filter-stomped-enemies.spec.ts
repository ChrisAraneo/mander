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
import { PLAYER_HEIGHT } from '../../player/consts';
import { createPlayer } from '../../player/create-player';
import { filterStompedEnemies } from './filter-stomped-enemies';

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
});

const LEVEL = createLevel(['.....', '.....', 's.e..', '#####']);

const BASE_PLAYER = createPlayer(LEVEL, { hearts: { value: 3 } });

const DELTA_SECONDS = 1 / 60;

const ENEMY_X = 100;

const ENEMY_Y = 200;

const ENEMY_HEAD = 203;

const createPlayerWithFeetAt = (feet: number, fallSpeed: number): Player => ({
  ...BASE_PLAYER,
  position: { x: ENEMY_X, y: feet - PLAYER_HEIGHT },
  velocity: {
    ...BASE_PLAYER.velocity,
    y: { ...BASE_PLAYER.velocity.y, current: fallSpeed },
  },
});

const createEnemyOf = (kind: EnemyKind, death: number | null): Enemy => ({
  ...createEnemies(LEVEL)[0],
  kind,
  position: { x: ENEMY_X, y: ENEMY_Y },
  timers: { death },
});

const PREVIOUS_PLAYER = createPlayerWithFeetAt(ENEMY_HEAD - 10, 400);

const FALLING_PLAYER = createPlayerWithFeetAt(ENEMY_HEAD + 4, 400);

describe('filterStompedEnemies', () => {
  it('should give the hopping and flying enemies when the falling player lands on them', () => {
    const hopping = createEnemyOf('HOPPING', null);
    const flying = createEnemyOf('FLYING', null);

    const stomped = filterStompedEnemies(
      PREVIOUS_PLAYER,
      FALLING_PLAYER,
      [hopping, flying],
      DELTA_SECONDS,
    );

    expect(stomped).toEqual([hopping, flying]);
  });

  it('should give the fast enemy when the falling player lands on it', () => {
    const fast = createEnemyOf('FAST', null);

    const stomped = filterStompedEnemies(
      PREVIOUS_PLAYER,
      FALLING_PLAYER,
      [fast],
      DELTA_SECONDS,
    );

    expect(stomped).toEqual([fast]);
  });

  it('should give no enemies when the falling player lands on a horned enemy and a beartrap', () => {
    const enemies = [
      createEnemyOf('HORNED', null),
      createEnemyOf('BEARTRAP', null),
    ];

    const stomped = filterStompedEnemies(
      PREVIOUS_PLAYER,
      FALLING_PLAYER,
      enemies,
      DELTA_SECONDS,
    );

    expect(stomped).toEqual([]);
  });

  it('should give no enemies when the enemy the player lands on is dying', () => {
    const dying = createEnemyOf('HOPPING', 0.1);

    const stomped = filterStompedEnemies(
      PREVIOUS_PLAYER,
      FALLING_PLAYER,
      [dying],
      DELTA_SECONDS,
    );

    expect(stomped).toEqual([]);
  });

  it('should give no enemies when the player is rising', () => {
    const rising = createPlayerWithFeetAt(ENEMY_HEAD + 4, -400);
    const hopping = createEnemyOf('HOPPING', null);

    const stomped = filterStompedEnemies(
      PREVIOUS_PLAYER,
      rising,
      [hopping],
      DELTA_SECONDS,
    );

    expect(stomped).toEqual([]);
  });

  it('should give no enemies when there are no enemies', () => {
    const stomped = filterStompedEnemies(
      PREVIOUS_PLAYER,
      FALLING_PLAYER,
      [],
      DELTA_SECONDS,
    );

    expect(stomped).toEqual([]);
  });
});
