import { describe, expect, it } from 'vitest';

import type { Action } from '../../actions/types/actions';
import { createRecorder } from './create-recorder';

const DELTA_SECONDS = 1 / 60;
const FRAME_MS = 1000 / 60;

const tickAction: Action = { type: 'TICK', deltaSeconds: DELTA_SECONDS };

const script: Action[] = [
  ...Array.from({ length: 60 }, () => tickAction),
  { type: 'MOVE_RIGHT_START' },
  ...Array.from({ length: 30 }, () => tickAction),
  { type: 'JUMP_START' },
  ...Array.from({ length: 20 }, () => tickAction),
  { type: 'JUMP_STOP' },
  ...Array.from({ length: 90 }, () => tickAction),
  { type: 'MOVE_RIGHT_STOP' },
  ...Array.from({ length: 60 }, () => tickAction),
];

describe('createRecorder', () => {
  it('timestamps entries relative to the first recorded action', () => {
    const recorder = createRecorder('TEST-WORLD');
    recorder.record({ type: 'MOVE_LEFT_START' }, 1_200);
    recorder.record({ type: 'MOVE_LEFT_STOP' }, 1_700);

    const { worldName, startedAtMs, entries } = recorder.snapshot();
    expect(worldName).toBe('TEST-WORLD');
    expect(startedAtMs).toBe(1_200);
    expect(entries).toEqual([
      { atMs: 0, action: { type: 'MOVE_LEFT_START' } },
      { atMs: 500, action: { type: 'MOVE_LEFT_STOP' } },
    ]);
  });

  it('records every action, ticks included', () => {
    const recorder = createRecorder('TEST-WORLD');
    script.forEach((action, index) =>
      recorder.record(action, 5_000 + index * FRAME_MS),
    );

    const { entries } = recorder.snapshot();
    expect(entries).toHaveLength(264);
    expect(entries.filter(({ action }) => action.type === 'TICK')).toHaveLength(
      260,
    );
  });

  it('ignores actions once stopped', () => {
    const recorder = createRecorder('TEST-WORLD');
    recorder.record({ type: 'JUMP_START' }, 0);
    recorder.stop();
    recorder.record({ type: 'JUMP_STOP' }, 100);

    expect(recorder.snapshot().entries).toHaveLength(1);
  });

  it('starts a fresh recording after reset', () => {
    const recorder = createRecorder('TEST-WORLD');
    recorder.record({ type: 'JUMP_START' }, 400);
    recorder.stop();
    recorder.reset();
    recorder.record({ type: 'INTERACT' }, 900);

    const { startedAtMs, entries } = recorder.snapshot();
    expect(startedAtMs).toBe(900);
    expect(entries).toEqual([{ atMs: 0, action: { type: 'INTERACT' } }]);
  });

  it('returns a snapshot detached from later recording', () => {
    const recorder = createRecorder('TEST-WORLD');
    recorder.record({ type: 'JUMP_START' }, 0);
    const snapshot = recorder.snapshot();
    recorder.record({ type: 'JUMP_STOP' }, 100);

    expect(snapshot.entries).toHaveLength(1);
  });
});
