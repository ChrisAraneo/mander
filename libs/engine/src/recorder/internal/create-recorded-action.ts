import type { RecordableAction } from '../../state/types/recordable-action';
import type { RecordedAction } from '../types/recorded-action';
import type { RecorderState } from '../types/recorder-state';

export const createRecordedAction = (
  recorder: RecorderState,
  action: RecordableAction,
): RecordedAction => ({ atStep: recorder.step, action });
