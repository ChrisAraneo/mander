import {
  HEART,
  MOON_MAGNET,
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
import { createPlayerFireballs } from './create-player-fireballs';

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

describe('createPlayerFireballs', () => {
  it('should hang two fireballs on opposite sides of the player centre when the player carries a magnet', () => {
    const player = createPlayerAt(64, 96);

    const fireballs = createPlayerFireballs([MOON_MAGNET], player, true);

    expect(fireballs).toEqual([
      { spin: 'CLOCKWISE', origin: { x: 75, y: 120 }, angle: 0 },
      { spin: 'CLOCKWISE', origin: { x: 75, y: 120 }, angle: Math.PI },
    ]);
  });

  it('should spread the fireballs evenly round the player when the player carries two magnets', () => {
    const player = createPlayerAt(64, 96);

    const fireballs = createPlayerFireballs(
      [MOON_MAGNET, HEART, MOON_MAGNET],
      player,
      true,
    );

    expect(map(fireballs, (fireball) => fireball.spin)).toEqual([
      'CLOCKWISE',
      'CLOCKWISE',
      'CLOCKWISE',
      'CLOCKWISE',
    ]);
    expect(fireballs[0].angle).toBeCloseTo(0, 6);
    expect(fireballs[1].angle).toBeCloseTo(Math.PI / 2, 6);
    expect(fireballs[2].angle).toBeCloseTo(Math.PI, 6);
    expect(fireballs[3].angle).toBeCloseTo((3 * Math.PI) / 2, 6);
  });

  it('should light no fireballs when the magnet is switched off', () => {
    const player = createPlayerAt(64, 96);

    const fireballs = createPlayerFireballs([MOON_MAGNET], player, false);

    expect(fireballs).toEqual([]);
  });

  it('should light the fireballs when it is not told whether the magnet is on', () => {
    const player = createPlayerAt(64, 96);

    const fireballs = createPlayerFireballs([MOON_MAGNET], player);

    expect(fireballs).toEqual(
      createPlayerFireballs([MOON_MAGNET], player, true),
    );
    expect(size(fireballs)).toBe(2);
  });

  it('should light no fireballs when the player carries no magnet', () => {
    const player = createPlayerAt(64, 96);

    const fireballs = createPlayerFireballs([HEART], player);

    expect(fireballs).toEqual([]);
  });

  it('should leave the given items and player unchanged when it lights the fireballs', () => {
    const inventory = [MOON_MAGNET];
    const player = createPlayerAt(64, 96);

    createPlayerFireballs(inventory, player);

    expect(inventory).toEqual([MOON_MAGNET]);
    expect(player).toEqual(createPlayerAt(64, 96));
  });
});
