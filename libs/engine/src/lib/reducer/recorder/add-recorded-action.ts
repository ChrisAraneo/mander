import { match } from 'ts-pattern';
import type { Action } from '../types/action';
import type { RecorderState } from './types/recorder-state';

export const addRecordedAction = (
  recorder: RecorderState,
  action: Action,
): RecorderState =>
  match(recorder.isRecording)
    .with(false, () => recorder)
    .otherwise(() =>
      match(action)
        .with({ type: 'TICK' }, (): RecorderState => ({
          ...recorder,
          step: recorder.step + 1,
        }))
        .otherwise((input): RecorderState => ({
          ...recorder,
          entries: [
            ...recorder.entries,
            { atStep: recorder.step, action: input },
          ],
        })),
    );
