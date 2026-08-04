import {
  type Item,
  type Tile,
  TILE_AIR,
  TILE_DIRT,
  TILE_PORTAL,
  TILE_SPAWN,
} from '@mander/model';
import { filter, map, size, times } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import type { Action } from '../actions/actions';
import type { GameLevel } from '../game-level';
import { packReplay } from './pack-replay';
import type { Replay } from './replay';
import { unpackReplay } from './unpack-replay';

const WIDTH = 20;
const HEIGHT = 12;
const GROUND_ROW = 9;
const DELTA_SECONDS = 1 / 60;

const item = (id: string): Item => ({
  id,
  name: id,
  description: id,
  rarity: 'COMMON',
  effect: { kind: 'NONE' },
});

const testLevel = (seed: string): GameLevel => {
  const tiles: Tile[][] = times(HEIGHT, (row) =>
    times(WIDTH, (): Tile => (row >= GROUND_ROW ? TILE_DIRT : TILE_AIR)),
  );
  tiles[GROUND_ROW - 1][2] = TILE_SPAWN;
  tiles[GROUND_ROW - 1][15] = TILE_PORTAL;

  return {
    seed,
    width: WIDTH,
    height: HEIGHT,
    tiles,
    chestItems: [item('CARD-0')],
    hornedEnemyChance: 0,
  };
};

const LEVELS: GameLevel[] = [testLevel('ONE'), testLevel('TWO')];

const script: Action[] = [
  { type: 'TICK', deltaSeconds: DELTA_SECONDS },
  { type: 'MOVE_RIGHT_START' },
  { type: 'JUMP_START' },
  { type: 'JUMP_STOP' },
  { type: 'MOVE_RIGHT_STOP' },
  { type: 'MOVE_LEFT_START' },
  { type: 'MOVE_LEFT_STOP' },
  { type: 'INTERACT' },
  { type: 'CHOOSE_ITEM', index: 1 },
  { type: 'CLOSE' },
  { type: 'RESPAWN' },
  { type: 'LOAD_LEVEL', level: LEVELS[1], levelIndex: 1 },
  { type: 'RESTART', level: LEVELS[0] },
];

const recorded = (): Replay => ({
  worldName: 'PACK-WORLD',
  startedAtMs: 0,
  entries: map(script, (action, index) => ({ atMs: index * 16, action })),
});

describe('packReplay', () => {
  it('brings every action back the way it went in', () => {
    const restored = unpackReplay(packReplay(recorded()), LEVELS);

    expect(restored.worldName).toBe('PACK-WORLD');
    expect(map(restored.entries, 'action')).toEqual(script);
    expect(map(restored.entries, 'atMs')).toEqual(
      map(script, (_, index) => index * 16),
    );
  });

  it('keeps the tick deltas to the last bit, so physics lands the same', () => {
    const odd = 0.016_666_666_666_666_666;
    const packed = packReplay({
      worldName: 'W',
      startedAtMs: 0,
      entries: [{ atMs: 0, action: { type: 'TICK', deltaSeconds: odd } }],
    });

    expect(unpackReplay(packed, LEVELS).entries[0].action).toEqual({
      type: 'TICK',
      deltaSeconds: odd,
    });
  });

  it('leaves the level grids behind rather than writing them out again', () => {
    const written = JSON.stringify(packReplay(recorded()));

    expect(written).not.toContain('"tiles"');
    expect(written).not.toContain('"chestItems"');
  });

  it('packs a long run far smaller than the replay it came from', () => {
    const long: Replay = {
      worldName: 'W',
      startedAtMs: 0,
      entries: times(5000, (index) => ({
        atMs: index * 16,
        action: { type: 'TICK', deltaSeconds: DELTA_SECONDS },
      })),
    };

    const before = size(JSON.stringify(long));
    const after = size(JSON.stringify(packReplay(long)));

    expect(after).toBeLessThan(before / 2);
  });

  it('drops what it cannot seat rather than handing back a broken run', () => {
    const packed = packReplay({
      worldName: 'W',
      startedAtMs: 0,
      entries: [
        {
          atMs: 0,
          action: { type: 'LOAD_LEVEL', level: LEVELS[1], levelIndex: 9 },
        },
        { atMs: 1, action: { type: 'INTERACT' } },
      ],
    });

    const restored = unpackReplay(packed, LEVELS);

    expect(size(restored.entries)).toBe(1);
    expect(restored.entries[0].action).toEqual({ type: 'INTERACT' });
  });

  it('shrugs off an entry whose action it has never heard of', () => {
    const restored = unpackReplay(
      {
        worldName: 'W',
        entries: [
          [0, 99],
          [1, 7],
        ],
      },
      LEVELS,
    );

    expect(size(filter(restored.entries))).toBe(1);
  });
});
