import { match } from 'ts-pattern';
import type { Action } from '../../state/types/action';
import type { RecorderState } from '../types/recorder-state';
import { patchRecorderEntries } from './patch-recorder-entries';
import { patchRecorderStep } from './patch-recorder-step';

export const patchRecordedAction = (
  recorder: RecorderState,
  action: Action,
): RecorderState =>
  match(action)
    .with({ type: 'TICK' }, () => patchRecorderStep(recorder))
    .otherwise((recordableAction) =>
      patchRecorderEntries(recorder, recordableAction),
    );
