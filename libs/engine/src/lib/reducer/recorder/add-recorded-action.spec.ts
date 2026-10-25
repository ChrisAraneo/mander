import { reduce, size, times } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import type { Action } from '../types/action';
import { addRecordedAction } from './add-recorded-action';
import { createRecorder } from './create-recorder';
import { finishRecording } from './finish-recording';
import type { RecorderState } from './types/recorder-state';

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

const addRecordedActions = (
  recorder: RecorderState,
  actions: Action[],
): RecorderState => reduce(actions, addRecordedAction, recorder);

describe('addRecordedAction', () => {
  it('should mark each input with the step the run had reached when it records one', () => {
    const recorder = addRecordedActions(createRecorder('TEST-WORLD'), [
      { type: 'TICK' },
      { type: 'TICK' },
      { type: 'MOVE_LEFT_START' },
      { type: 'TICK' },
      { type: 'MOVE_LEFT_STOP' },
    ]);

    expect(recorder.step).toBe(3);
    expect(recorder.entries).toEqual([
      { atStep: 2, action: { type: 'MOVE_LEFT_START' } },
      { atStep: 3, action: { type: 'MOVE_LEFT_STOP' } },
    ]);
  });

  it('should count the steps rather than store them when the run is long', () => {
    const recorder = addRecordedActions(createRecorder('TEST-WORLD'), SCRIPT);

    expect(recorder.step).toBe(260);
    expect(size(recorder.entries)).toBe(4);
  });

  it('should start an input on step zero when nothing has stepped yet', () => {
    const recorder = addRecordedAction(createRecorder('TEST-WORLD'), {
      type: 'JUMP_START',
    });

    expect(recorder.entries).toEqual([
      { atStep: 0, action: { type: 'JUMP_START' } },
    ]);
  });

  it('should give back the same recorder when the recording has finished', () => {
    const finished = finishRecording(
      addRecordedAction(createRecorder('TEST-WORLD'), { type: 'JUMP_START' }),
    );

    expect(addRecordedAction(finished, { type: 'JUMP_STOP' })).toBe(finished);
    expect(addRecordedAction(finished, { type: 'TICK' })).toBe(finished);
  });

  it('should keep the world name when it records an input', () => {
    const recorder = addRecordedAction(createRecorder('TEST-WORLD'), {
      type: 'INTERACT',
    });

    expect(recorder.worldName).toBe('TEST-WORLD');
  });

  it('should not change the old recorder when it records an input', () => {
    const recorder = createRecorder('TEST-WORLD');

    addRecordedAction(recorder, { type: 'JUMP_START' });
    addRecordedAction(recorder, { type: 'TICK' });

    expect(recorder).toEqual(createRecorder('TEST-WORLD'));
  });
});
