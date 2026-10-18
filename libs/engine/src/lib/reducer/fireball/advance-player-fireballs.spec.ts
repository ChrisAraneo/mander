import {
  type Fireball,
  MAX_TICK_SECONDS,
  type Player,
  type Tile,
  TILE_AIR,
  TILE_DIRT,
  TILE_SPAWN,
} from '@mander/model';
import { head, map, size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import type { GameLevel } from '../../types/game-level';
import { createPlayer } from '../player/create-player';
import { advancePlayerFireballs } from './advance-player-fireballs';
import { PLAYER_FIREBALL_ANGULAR_SPEED } from './consts';

const LEGEND: Record<string, Tile> = {
  '.': TILE_AIR,
  '#': TILE_DIRT,
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

const LEVEL = createLevel(['.....', '.....', 's....', '#####']);

const createPlayerAt = (left: number, top: number): Player => ({
  ...createPlayer(LEVEL, { hearts: { value: 3 } }),
  position: { x: left, y: top },
});

const createFireballs = (): Fireball[] => [
  { spin: 'CLOCKWISE', origin: { x: 0, y: 0 }, angle: 0.5 },
  { spin: 'ANTICLOCKWISE', origin: { x: 0, y: 0 }, angle: 3 },
];

describe('advancePlayerFireballs', () => {
  it('should turn every fireball its own way at the player speed when a short time passes', () => {
    const fireballs = createFireballs();
    const player = createPlayerAt(64, 96);

    const advanced = advancePlayerFireballs(fireballs, player, 0.01);

    expect(advanced[0].angle).toBeCloseTo(
      0.5 + PLAYER_FIREBALL_ANGULAR_SPEED * 0.01,
      6,
    );
    expect(advanced[1].angle).toBeCloseTo(
      3 - PLAYER_FIREBALL_ANGULAR_SPEED * 0.01,
      6,
    );
  });

  it('should hang every fireball off the centre of the player when time passes', () => {
    const fireballs = createFireballs();
    const player = createPlayerAt(64, 96);

    const advanced = advancePlayerFireballs(fireballs, player, 0.01);

    expect(advanced[0].origin).toEqual({ x: 75, y: 120 });
    expect(advanced[1].origin).toEqual({ x: 75, y: 120 });
  });

  it('should keep the spin of every fireball when time passes', () => {
    const fireballs = createFireballs();
    const player = createPlayerAt(64, 96);

    const advanced = advancePlayerFireballs(fireballs, player, 0.01);

    expect(advanced[0].spin).toBe('CLOCKWISE');
    expect(advanced[1].spin).toBe('ANTICLOCKWISE');
  });

  it('should turn every fireball only as far as one longest tick when a long time passes', () => {
    const fireballs = createFireballs();
    const player = createPlayerAt(64, 96);

    const advanced = advancePlayerFireballs(fireballs, player, 1);

    expect(advanced[0].angle).toBeCloseTo(
      0.5 + PLAYER_FIREBALL_ANGULAR_SPEED * MAX_TICK_SECONDS,
      6,
    );
    expect(advanced[1].angle).toBeCloseTo(
      3 - PLAYER_FIREBALL_ANGULAR_SPEED * MAX_TICK_SECONDS,
      6,
    );
  });

  it('should give no fireballs when the player has none', () => {
    const player = createPlayerAt(64, 96);

    const advanced = advancePlayerFireballs([], player, 0.01);

    expect(advanced).toEqual([]);
  });

  it('should leave the given fireballs and player unchanged when time passes', () => {
    const fireballs = createFireballs();
    const player = createPlayerAt(64, 96);

    advancePlayerFireballs(fireballs, player, 0.01);

    expect(fireballs).toEqual(createFireballs());
    expect(player).toEqual(createPlayerAt(64, 96));
  });
});
