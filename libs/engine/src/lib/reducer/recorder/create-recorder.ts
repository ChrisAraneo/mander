import { chain } from '@mander/model';
import { assign, noop } from 'lodash-es';
import { match } from 'ts-pattern';
import type { Action } from '../types/action';
import { createEmptyRecorderState } from './internal/create-empty-recorder-state';
import type { RecorderState } from './internal/types/recorder-state';
import type { Recorder } from './types/recorder';

const patchRecorderState = (
  state: RecorderState,
  patch: Partial<RecorderState>,
): void => void assign(state, patch);

const addRecordedAction = (state: RecorderState, action: Action): void =>
  match(action)
    .with({ type: 'TICK' }, () =>
      patchRecorderState(state, { step: state.step + 1 }),
    )
    .otherwise((input) =>
      patchRecorderState(state, {
        entries: [...state.entries, { atStep: state.step, action: input }],
      }),
    );

export const createRecorder = (worldName: string): Recorder =>
  chain(createEmptyRecorderState())
    .thru((state): Recorder => ({
      record: (action) =>
        match(state.isRecording)
          .with(true, () => addRecordedAction(state, action))
          .otherwise(noop),
      stop: () => patchRecorderState(state, { isRecording: false }),
      reset: () => patchRecorderState(state, createEmptyRecorderState()),
      snapshot: () => ({
        worldName,
        steps: state.step,
        entries: [...state.entries],
      }),
    }))
    .value();
