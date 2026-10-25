import { describe, expect, it } from 'vitest';

import { addRecordedAction } from './add-recorded-action';
import { createRecorder } from './create-recorder';
import { finishRecording } from './finish-recording';

describe('finishRecording', () => {
  it('should stop the recording when it finishes one', () => {
    const finished = finishRecording(createRecorder('TEST-WORLD'));

    expect(finished.isRecording).toBe(false);
  });

  it('should keep the recorded inputs and steps when it finishes the recording', () => {
    const recorder = addRecordedAction(
      addRecordedAction(createRecorder('TEST-WORLD'), { type: 'TICK' }),
      { type: 'JUMP_START' },
    );

    const finished = finishRecording(recorder);

    expect(finished.entries).toBe(recorder.entries);
    expect(finished.step).toBe(1);
    expect(finished.worldName).toBe('TEST-WORLD');
  });

  it('should not change the old recorder when it finishes the recording', () => {
    const recorder = createRecorder('TEST-WORLD');

    finishRecording(recorder);

    expect(recorder.isRecording).toBe(true);
  });
});
