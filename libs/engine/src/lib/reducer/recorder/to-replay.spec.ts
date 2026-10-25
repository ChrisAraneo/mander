import { describe, expect, it } from 'vitest';

import { addRecordedAction } from './add-recorded-action';
import { createRecorder } from './create-recorder';
import { toReplay } from './to-replay';

describe('toReplay', () => {
  it('should give the world name, the steps and the inputs when it turns a recorder into a replay', () => {
    const recorder = addRecordedAction(
      addRecordedAction(createRecorder('TEST-WORLD'), { type: 'TICK' }),
      { type: 'JUMP_START' },
    );

    expect(toReplay(recorder)).toEqual({
      worldName: 'TEST-WORLD',
      steps: 1,
      entries: [{ atStep: 1, action: { type: 'JUMP_START' } }],
    });
  });

  it('should give an empty replay when nothing was recorded', () => {
    expect(toReplay(createRecorder('TEST-WORLD'))).toEqual({
      worldName: 'TEST-WORLD',
      steps: 0,
      entries: [],
    });
  });

  it('should keep the replay as it was when recording goes on afterwards', () => {
    const recorder = addRecordedAction(createRecorder('TEST-WORLD'), {
      type: 'JUMP_START',
    });
    const replay = toReplay(recorder);

    addRecordedAction(recorder, { type: 'JUMP_STOP' });

    expect(replay.entries).toEqual([
      { atStep: 0, action: { type: 'JUMP_START' } },
    ]);
  });
});
