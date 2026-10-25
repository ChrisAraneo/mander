import { map } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import type { CompletedWorld } from '../types/completed-world';
import type { PlayedWorld } from '../types/played-world';
import type { RunRecord } from '../types/run-record';
import type { SaveData } from '../types/save-data';
import { createPlayable } from './create-playable';

const REPLAY = { worldName: 'ABC', steps: 1, entries: [[0, 0]] };

const WORLD: PlayedWorld = {
  name: 'ABC',
  day: '2026-09-04',
  playedAt: '2026-09-04T10:00:00Z',
  runs: 3,
};

const COMPLETED: CompletedWorld = {
  name: 'ABC',
  day: '2026-09-04',
  score: 900,
  seconds: 61,
  runId: 'RUN-1',
  replay: REPLAY,
};

const RUN: RunRecord = {
  id: 'RUN-1',
  name: 'ABC',
  day: '2026-09-04',
  playedAt: '2026-09-04T10:00:00Z',
  outcome: 'COMPLETE',
  score: 900,
  seconds: 61,
  levelIndex: 0,
  replay: REPLAY,
};

const createSave = (runs: RunRecord[]): SaveData => ({
  score: 0,
  completedWorlds: [COMPLETED],
  playedWorlds: [WORLD],
  runs,
});

describe('createPlayable', () => {
  it('should keep the played world when it makes the world playable', () => {
    const playable = createPlayable(createSave([RUN]), WORLD, COMPLETED);

    expect(playable.name).toBe('ABC');
    expect(playable.day).toBe('2026-09-04');
    expect(playable.playedAt).toBe('2026-09-04T10:00:00Z');
    expect(playable.runs).toBe(3);
  });

  it('should pass on the finished world when it makes the world playable', () => {
    expect(createPlayable(createSave([RUN]), WORLD, COMPLETED).completed).toBe(
      COMPLETED,
    );
  });

  it('should list the replays of the world when it makes the world playable', () => {
    expect(
      map(
        createPlayable(createSave([RUN]), WORLD, COMPLETED).replays,
        (run) => run.id,
      ),
    ).toEqual(['RUN-1']);
  });

  it('should give no replays when the world has no runs and was never finished', () => {
    const playable = createPlayable(createSave([]), WORLD, null);

    expect(playable.completed).toBeNull();
    expect(playable.replays).toEqual([]);
  });
});
