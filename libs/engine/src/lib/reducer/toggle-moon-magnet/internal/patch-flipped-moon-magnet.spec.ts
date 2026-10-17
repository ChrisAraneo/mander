import {
  MOON_MAGNET,
  type Tile,
  TILE_AIR,
  TILE_DIRT,
  TILE_SPAWN,
} from '@mander/model';
import { head, map, size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { createInitialState } from '../../../state/create-initial-state';
import type { GameLevel } from '../../../types/game-level';
import type { GameState } from '../../../types/game-state';
import { createPlayerFireballs } from '../../fireball/create-player-fireballs';
import { patchFlippedMoonMagnet } from './patch-flipped-moon-magnet';

const LEGEND: Record<string, Tile> = {
  '.': TILE_AIR,
  '#': TILE_DIRT,
  S: TILE_SPAWN,
};

const createLevel = (rows: string[]): GameLevel => ({
  seed: 'SEED',
  width: size(head(rows)),
  height: size(rows),
  tiles: map(rows, (row) => map(row, (symbol) => LEGEND[symbol])),
  chestItems: [],
  hornedEnemyChance: 0,
});

const LEVEL = createLevel(['.....', '.S...', '#####']);

const createState = (): GameState =>
  createInitialState(LEVEL, 0, [MOON_MAGNET]);

const createDarkState = (): GameState => ({
  ...createState(),
  isMoonMagnetOn: false,
  playerFireballs: [],
});

describe('patchFlippedMoonMagnet', () => {
  it('should turn the magnet off when it was on', () => {
    const flipped = patchFlippedMoonMagnet(createState());

    expect(flipped.isMoonMagnetOn).toBe(false);
  });

  it('should send the moons away when the magnet turns off', () => {
    const flipped = patchFlippedMoonMagnet(createState());

    expect(flipped.playerFireballs).toEqual([]);
  });

  it('should turn the magnet on when it was off', () => {
    const flipped = patchFlippedMoonMagnet(createDarkState());

    expect(flipped.isMoonMagnetOn).toBe(true);
  });

  it('should bring the moons back around the player when the magnet turns on', () => {
    const state = createDarkState();

    const flipped = patchFlippedMoonMagnet(state);

    expect(flipped.playerFireballs).toEqual(
      createPlayerFireballs([MOON_MAGNET], state.player, true),
    );
    expect(flipped.playerFireballs).toHaveLength(2);
  });

  it('should leave the rest of the game alone when the magnet flips', () => {
    const state = createState();

    const flipped = patchFlippedMoonMagnet(state);

    expect(flipped).toEqual({
      ...state,
      isMoonMagnetOn: false,
      playerFireballs: [],
    });
  });

  it('should leave the given state unchanged when the magnet flips', () => {
    const state = createState();

    patchFlippedMoonMagnet(state);

    expect(state).toEqual(createState());
  });
});
