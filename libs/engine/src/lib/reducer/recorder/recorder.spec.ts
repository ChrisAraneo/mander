import { describe, expect, it } from 'vitest';

import type { Action } from '../../actions/actions';
import { createRecorder } from './create-recorder';

const tickAction: Action = { type: 'TICK' };

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
  it('marks each input with the step the run had reached', () => {
    const recorder = createRecorder('TEST-WORLD');
    recorder.record({ type: 'TICK' });
    recorder.record({ type: 'TICK' });
    recorder.record({ type: 'MOVE_LEFT_START' });
    recorder.record({ type: 'TICK' });
    recorder.record({ type: 'MOVE_LEFT_STOP' });

    const { worldName, steps, entries } = recorder.snapshot();
    expect(worldName).toBe('TEST-WORLD');
    expect(steps).toBe(3);
    expect(entries).toEqual([
      { atStep: 2, action: { type: 'MOVE_LEFT_START' } },
      { atStep: 3, action: { type: 'MOVE_LEFT_STOP' } },
    ]);
  });

  it('keeps the inputs and counts the steps rather than storing them', () => {
    const recorder = createRecorder('TEST-WORLD');
    script.forEach((action) => recorder.record(action));

    const { steps, entries } = recorder.snapshot();
    expect(steps).toBe(260);
    expect(entries).toHaveLength(4);
  });

  it('starts an input on step zero when nothing has stepped yet', () => {
    const recorder = createRecorder('TEST-WORLD');
    recorder.record({ type: 'JUMP_START' });

    expect(recorder.snapshot().entries).toEqual([
      { atStep: 0, action: { type: 'JUMP_START' } },
    ]);
  });

  it('ignores actions once stopped', () => {
    const recorder = createRecorder('TEST-WORLD');
    recorder.record({ type: 'JUMP_START' });
    recorder.stop();
    recorder.record({ type: 'JUMP_STOP' });

    expect(recorder.snapshot().entries).toHaveLength(1);
  });

  it('stops counting steps once stopped', () => {
    const recorder = createRecorder('TEST-WORLD');
    recorder.record({ type: 'TICK' });
    recorder.stop();
    recorder.record({ type: 'TICK' });

    expect(recorder.snapshot().steps).toBe(1);
  });

  it('starts a fresh recording after reset', () => {
    const recorder = createRecorder('TEST-WORLD');
    recorder.record({ type: 'TICK' });
    recorder.record({ type: 'JUMP_START' });
    recorder.stop();
    recorder.reset();
    recorder.record({ type: 'INTERACT' });

    const { steps, entries } = recorder.snapshot();
    expect(steps).toBe(0);
    expect(entries).toEqual([{ atStep: 0, action: { type: 'INTERACT' } }]);
  });

  it('returns a snapshot detached from later recording', () => {
    const recorder = createRecorder('TEST-WORLD');
    recorder.record({ type: 'JUMP_START' });
    const snapshot = recorder.snapshot();
    recorder.record({ type: 'JUMP_STOP' });

    expect(snapshot.entries).toHaveLength(1);
  });
});
