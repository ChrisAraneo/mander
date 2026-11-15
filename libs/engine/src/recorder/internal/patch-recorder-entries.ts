import type { RecordableAction } from '../../state/types/recordable-action';
import type { RecorderState } from '../types/recorder-state';
import { createRecordedAction } from './create-recorded-action';

export const patchRecorderEntries = (
  recorder: RecorderState,
  action: RecordableAction,
): RecorderState => ({
  ...recorder,
  entries: [...recorder.entries, createRecordedAction(recorder, action)],
});
