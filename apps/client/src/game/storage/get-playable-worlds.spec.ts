import type { PackedReplay } from '@mander/engine';
import { map, padStart } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { getPlayableWorlds } from './get-playable-worlds';
import type { CompletedWorld } from './types/completed-world';
import type { PlayedWorld } from './types/played-world';
import type { RunRecord } from './types/run-record';
import type { SaveData } from './types/save-data';

const formatPlayedAt = (minute: number): string =>
  `2026-09-04T10:${padStart(String(minute), 2, '0')}:00Z`;

const createReplay = (name: string): PackedReplay => ({
  worldName: name,
  steps: 1,
  entries: [[0, 1]],
});

const createPlayedWorld = (patch: Partial<PlayedWorld> = {}): PlayedWorld => ({
  name: 'ABC',
  day: '2026-09-04',
  playedAt: formatPlayedAt(0),
  runs: 1,
  ...patch,
});

const createCompletedWorld = (
  patch: Partial<CompletedWorld> = {},
): CompletedWorld => ({
  name: 'ABC',
  day: '2026-09-04',
  score: 100,
  seconds: 42,
  runId: '',
  replay: createReplay(patch.name ?? 'ABC'),
  ...patch,
});

const createRun = (patch: Partial<RunRecord> = {}): RunRecord => ({
  id: 'RUN-1',
  name: 'ABC',
  day: '2026-09-04',
  playedAt: formatPlayedAt(0),
  outcome: 'GAME_OVER',
  score: 120,
  seconds: 45,
  levelIndex: 2,
  replay: createReplay(patch.name ?? 'ABC'),
  ...patch,
});

const createSave = (patch: Partial<SaveData> = {}): SaveData => ({
  score: 0,
  completedWorlds: [],
  playedWorlds: [],
  runs: [],
  ...patch,
});

describe('getPlayableWorlds', () => {
  it('should put the world at the top of the list when it was played most recently', () => {
    const save = createSave({
      playedWorlds: [
        createPlayedWorld({ name: 'OLD', playedAt: formatPlayedAt(0) }),
        createPlayedWorld({ name: 'NEW', playedAt: formatPlayedAt(5) }),
      ],
    });

    expect(map(getPlayableWorlds(save), (world) => world.name)).toEqual([
      'NEW',
      'OLD',
    ]);
  });

  it('should show the world once with its score alongside when it has been finished', () => {
    const save = createSave({
      completedWorlds: [createCompletedWorld()],
      playedWorlds: [createPlayedWorld()],
    });

    const worlds = getPlayableWorlds(save);

    expect(worlds).toHaveLength(1);
    expect(worlds[0].completed?.score).toBe(100);
  });

  it('should take the world as played too when it was finished before records were kept', () => {
    const save = createSave({
      completedWorlds: [
        createCompletedWorld({ name: 'OLD', day: '2026-01-01' }),
      ],
    });

    const [world] = getPlayableWorlds(save);

    expect(world.name).toBe('OLD');
    expect(world.day, 'an old save can still be replayed').toBe('2026-01-01');
    expect(world.completed).not.toBeNull();
  });

  it('should offer the runs newest first when a world is listed', () => {
    const save = createSave({
      runs: [
        createRun({ id: 'A', playedAt: formatPlayedAt(0) }),
        createRun({ id: 'B', playedAt: formatPlayedAt(2) }),
        createRun({ id: 'C', playedAt: formatPlayedAt(1) }),
      ],
    });

    const [world] = getPlayableWorlds(save);

    expect(map(world.replays, (run) => run.id)).toEqual(['B', 'C', 'A']);
  });

  it('should list the finished run once when the world record points at it', () => {
    const save = createSave({
      completedWorlds: [createCompletedWorld({ runId: 'RUN-1' })],
      runs: [createRun({ id: 'RUN-1', outcome: 'COMPLETE' })],
    });

    const [world] = getPlayableWorlds(save);

    expect(map(world.replays, (run) => run.id)).toEqual(['RUN-1']);
  });

  it('should still offer the best run when it has scrolled off the list', () => {
    const save = createSave({
      completedWorlds: [createCompletedWorld({ runId: 'GONE', score: 900 })],
    });

    const [world] = getPlayableWorlds(save);

    expect(map(world.replays, (run) => run.id)).toEqual(['ABC:best']);
    expect(world.replays[0].score).toBe(900);
  });

  it('should offer no best run when the world record kept no replay', () => {
    const save = createSave({
      completedWorlds: [createCompletedWorld({ replay: null })],
    });

    expect(getPlayableWorlds(save)[0].replays).toEqual([]);
  });

  it('should list the run when its world has fallen out of the played worlds', () => {
    const save = createSave({
      runs: [createRun({ name: 'LOST', day: '2026-01-01' })],
    });

    const [world] = getPlayableWorlds(save);

    expect(world.name).toBe('LOST');
    expect(world.day, 'the day is all it takes to rebuild it').toBe(
      '2026-01-01',
    );
    expect(world.replays).toHaveLength(1);
  });

  it('should list no worlds when nothing has been played', () => {
    expect(getPlayableWorlds(createSave())).toEqual([]);
  });
});
