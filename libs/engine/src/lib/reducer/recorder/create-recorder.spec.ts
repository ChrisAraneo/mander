import { size, times } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import type { Action } from '../types/action';
import { createRecorder } from './create-recorder';

const TICK_ACTION: Action = { type: 'TICK' };

const SCRIPT: Action[] = [
  ...times(60, () => TICK_ACTION),
  { type: 'MOVE_RIGHT_START' },
  ...times(30, () => TICK_ACTION),
  { type: 'JUMP_START' },
  ...times(20, () => TICK_ACTION),
  { type: 'JUMP_STOP' },
  ...times(90, () => TICK_ACTION),
  { type: 'MOVE_RIGHT_STOP' },
  ...times(60, () => TICK_ACTION),
];

describe('createRecorder', () => {
  it('should mark each input with the step the run had reached when it records one', () => {
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

  it('should count the steps rather than store them when the run is long', () => {
    const recorder = createRecorder('TEST-WORLD');
    times(size(SCRIPT), (actionIndex) => recorder.record(SCRIPT[actionIndex]));

    const { steps, entries } = recorder.snapshot();

    expect(steps).toBe(260);
    expect(entries).toHaveLength(4);
  });

  it('should start an input on step zero when nothing has stepped yet', () => {
    const recorder = createRecorder('TEST-WORLD');
    recorder.record({ type: 'JUMP_START' });

    expect(recorder.snapshot().entries).toEqual([
      { atStep: 0, action: { type: 'JUMP_START' } },
    ]);
  });

  it('should ignore the action when the recorder has stopped', () => {
    const recorder = createRecorder('TEST-WORLD');
    recorder.record({ type: 'JUMP_START' });
    recorder.stop();
    recorder.record({ type: 'JUMP_STOP' });

    expect(recorder.snapshot().entries).toHaveLength(1);
  });

  it('should stop counting steps when the recorder has stopped', () => {
    const recorder = createRecorder('TEST-WORLD');
    recorder.record({ type: 'TICK' });
    recorder.stop();
    recorder.record({ type: 'TICK' });

    expect(recorder.snapshot().steps).toBe(1);
  });

  it('should start a fresh recording when the recorder is reset', () => {
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

  it('should hand back a snapshot of its own when recording goes on afterwards', () => {
    const recorder = createRecorder('TEST-WORLD');
    recorder.record({ type: 'JUMP_START' });
    const snapshot = recorder.snapshot();
    recorder.record({ type: 'JUMP_STOP' });

    expect(snapshot.entries).toHaveLength(1);
  });
});
