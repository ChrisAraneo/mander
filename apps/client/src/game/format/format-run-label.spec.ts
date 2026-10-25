import { describe, expect, it } from 'vitest';

import type { RunRecord } from '../storage';
import { formatRunLabel } from './format-run-label';

const createRun = (patch: Partial<RunRecord>): RunRecord => ({
  id: 'RUN-1',
  name: 'ABC',
  day: '2026-09-04',
  playedAt: '2026-09-04T10:00:00Z',
  outcome: 'COMPLETE',
  score: 0,
  seconds: 0,
  levelIndex: 2,
  replay: { worldName: 'ABC', steps: 1, entries: [[0, 0]] },
  ...patch,
});

describe('formatRunLabel', () => {
  it('should call the run finished when it was completed', () => {
    expect(formatRunLabel(createRun({ outcome: 'COMPLETE' }))).toBe('Finished');
  });

  it('should name the level counted from one when the run ended in death', () => {
    expect(formatRunLabel(createRun({ outcome: 'GAME_OVER' }))).toBe(
      'Died on level 3',
    );
  });

  it('should name the level counted from one when the run was left unfinished', () => {
    expect(formatRunLabel(createRun({ outcome: 'ABANDONED' }))).toBe(
      'Left on level 3',
    );
  });
});
