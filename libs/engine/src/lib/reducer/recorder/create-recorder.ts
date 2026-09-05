import { chain } from '@mander/utils';
import { assign, noop } from 'lodash-es';
import { match } from 'ts-pattern';

import type { Action } from '../../actions/actions';
import type { RecordedAction } from './types/recorded-action';
import type { Recorder } from './types/recorder';

interface RecorderState {
  entries: RecordedAction[];
  step: number;
  isRecording: boolean;
}

const emptyState = (): RecorderState => ({
  entries: [],
  step: 0,
  isRecording: true,
});

const mutate = (state: RecorderState, patch: Partial<RecorderState>): void =>
  void assign(state, patch);

/**
 * A tick moves the run's clock on; every other action is an input, and where it
 * landed is the step it was seen on.
 */
const append = (state: RecorderState, action: Action): void =>
  match(action)
    .with({ type: 'TICK' }, () => mutate(state, { step: state.step + 1 }))
    .otherwise((input) =>
      mutate(state, {
        entries: [...state.entries, { atStep: state.step, action: input }],
      }),
    );

export const createRecorder = (worldName: string): Recorder =>
  chain(emptyState())
    .thru((state): Recorder => ({
      record: (action) =>
        match(state.isRecording)
          .with(true, () => append(state, action))
          .otherwise(noop),
      stop: () => mutate(state, { isRecording: false }),
      reset: () => mutate(state, emptyState()),
      snapshot: () => ({
        worldName,
        steps: state.step,
        entries: [...state.entries],
      }),
    }))
    .value();
