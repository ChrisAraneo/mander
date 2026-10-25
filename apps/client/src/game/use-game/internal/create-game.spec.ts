import { createRecorder, type GameLevel } from '@mander/engine';
import { type Tile, TILE_AIR } from '@mander/model';
import type { RenderedWorld } from '@mander/render';
import { constant, map, times } from 'lodash-es';
import { describe, expect, it } from 'vitest';
import { ref } from 'vue';

import { STORAGE_KEY } from '../../storage/consts';
import { createGame } from './create-game';

const LEVEL: GameLevel = {
  seed: 'RUN',
  width: 4,
  height: 4,
  tiles: times(4, (): Tile[] => times(4, constant(TILE_AIR))),
  chestItems: [],
  hornedEnemyChance: 0,
};

const WORLD = {
  name: 'ABC',
  levels: [LEVEL, LEVEL],
  score: 70,
  palette: {},
} as unknown as RenderedWorld;

const RIVAL = {
  id: 'R1',
  name: 'ABC',
  day: '2026-09-03',
  playedAt: '2026-09-03T10:00:00Z',
  outcome: 'COMPLETE',
  score: 50,
  seconds: 20,
  levelIndex: 1,
  replay: { worldName: 'ABC', steps: 1, entries: [] },
};

const createStorage = (store: Map<string, string>): Storage =>
  ({
    getItem: (key: string): string | null => store.get(key) ?? null,
    setItem: (key: string, value: string): Map<string, string> =>
      store.set(key, value),
  }) as unknown as Storage;

describe('createGame', () => {
  it('should start on the first level with the score of the world', () => {
    const game = createGame(WORLD, '2026-09-04', ref(null), undefined);

    expect(game.state.value.levelIndex).toBe(0);
    expect(game.state.value.score).toBe(70);
  });

  it('should show the start state on both sides of the frame', () => {
    const game = createGame(WORLD, '2026-09-04', ref(null), undefined);

    expect(game.frame.value.previous).toBe(game.state.value);
    expect(game.frame.value.current).toBe(game.state.value);
  });

  it('should start a fresh recording of the world', () => {
    expect(
      createGame(WORLD, '2026-09-04', ref(null), undefined).recorder.value,
    ).toEqual(createRecorder('ABC'));
  });

  it('should keep the world, the day and the storage it was given', () => {
    const storage = createStorage(new Map());

    const game = createGame(WORLD, '2026-09-04', ref(null), storage);

    expect(game.world).toBe(WORLD);
    expect(game.day).toBe('2026-09-04');
    expect(game.storage).toBe(storage);
  });

  it('should start with nothing saved, no keyboard and nothing playing', () => {
    const game = createGame(WORLD, '2026-09-04', ref(null), undefined);

    expect(game.isRunSaved.value).toBe(false);
    expect(game.keyboard.value).toBeNull();
    expect(game.subscription.value).toBeNull();
    expect(game.replay.isActive.value).toBe(false);
  });

  it('should let the replay show the game that is being played', () => {
    const game = createGame(WORLD, '2026-09-04', ref(null), undefined);

    expect(game.replay.origin).toEqual({
      kind: 'GAME',
      recorder: game.recorder,
      state: game.state,
    });
  });

  it('should race against the runs of the world kept in the save', () => {
    const storage = createStorage(
      new Map([[STORAGE_KEY, JSON.stringify({ runs: [RIVAL] })]]),
    );

    const game = createGame(WORLD, '2026-09-04', ref(null), storage);

    expect(map(game.replay.stage.rivals, (run) => run.id)).toEqual(['R1']);
  });

  it('should race against nobody when there is no storage', () => {
    expect(
      createGame(WORLD, '2026-09-04', ref(null), undefined).replay.stage.rivals,
    ).toEqual([]);
  });
});
