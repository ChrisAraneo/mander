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

import type { RecordableAction } from '../../actions/actions';
import type { GameLevel } from '../../types/game-level';
import { packReplay } from './pack-replay';
import type { Replay } from '../recorder/types/replay';
import { unpackReplay } from './unpack-replay';

const WIDTH = 20;
const HEIGHT = 12;
const GROUND_ROW = 9;

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

const script: RecordableAction[] = [
  { type: 'MOVE_RIGHT_START' },
  { type: 'JUMP_START' },
  { type: 'JUMP_STOP' },
  { type: 'MOVE_RIGHT_STOP' },
  { type: 'MOVE_LEFT_START' },
  { type: 'MOVE_LEFT_STOP' },
  { type: 'INTERACT' },
  { type: 'CHOOSE_ITEM', index: 1 },
  { type: 'USE_STAR' },
  { type: 'CLOSE' },
  { type: 'RESPAWN' },
  { type: 'LOAD_LEVEL', level: LEVELS[1], levelIndex: 1 },
  { type: 'RESTART', level: LEVELS[0] },
];

const recorded = (): Replay => ({
  worldName: 'PACK-WORLD',
  steps: size(script) * 4,
  entries: map(script, (action, index) => ({ atStep: index * 4, action })),
});

describe('packReplay', () => {
  it('brings every action back the way it went in', () => {
    const restored = unpackReplay(packReplay(recorded()), LEVELS);

    expect(restored.worldName).toBe('PACK-WORLD');
    expect(map(restored.entries, 'action')).toEqual(script);
    expect(map(restored.entries, 'atStep')).toEqual(
      map(script, (_, index) => index * 4),
    );
  });

  it('carries the step count, which is the whole of the run clock', () => {
    expect(unpackReplay(packReplay(recorded()), LEVELS).steps).toBe(
      size(script) * 4,
    );
  });

  it('leaves the level grids behind rather than writing them out again', () => {
    const written = JSON.stringify(packReplay(recorded()));

    expect(written).not.toContain('"tiles"');
    expect(written).not.toContain('"chestItems"');
  });

  it('costs nothing per step, however long the run ran', () => {
    const long: Replay = {
      worldName: 'W',
      steps: 36_000,
      entries: times(40, (index) => ({
        atStep: index * 900,
        action: { type: 'JUMP_START' } as RecordableAction,
      })),
    };

    expect(size(JSON.stringify(packReplay(long)))).toBeLessThan(600);
  });

  it('drops what it cannot seat rather than handing back a broken run', () => {
    const packed = packReplay({
      worldName: 'W',
      steps: 2,
      entries: [
        {
          atStep: 0,
          action: { type: 'LOAD_LEVEL', level: LEVELS[1], levelIndex: 9 },
        },
        { atStep: 1, action: { type: 'INTERACT' } },
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
        steps: 2,
        entries: [
          [0, 99],
          [1, 6],
        ],
      },
      LEVELS,
    );

    expect(size(filter(restored.entries))).toBe(1);
  });
});
