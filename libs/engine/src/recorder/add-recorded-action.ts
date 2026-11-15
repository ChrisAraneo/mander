import { match } from 'ts-pattern';
import type { Action } from '../state/types/action';
import { patchRecordedAction } from './internal/patch-recorded-action';
import type { RecorderState } from './types/recorder-state';

export const addRecordedAction = (
  recorder: RecorderState,
  action: Action,
): RecorderState =>
  match(recorder.isRecording)
    .with(false, () => recorder)
    .otherwise(() => patchRecordedAction(recorder, action));
