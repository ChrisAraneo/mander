import { chain } from '@mander/utils';
import { assign, noop, size } from 'lodash-es';
import { match } from 'ts-pattern';

import type { Action } from '../../actions/actions';
import type { RecordedAction } from './types/recorded-action';
import type { Recorder } from './types/recorder';

interface RecorderState {
  entries: RecordedAction[];
  startedAtMs: number;
  isRecording: boolean;
}

const emptyState = (): RecorderState => ({
  entries: [],
  startedAtMs: 0,
  isRecording: true,
});

const mutate = (state: RecorderState, patch: Partial<RecorderState>): void =>
  void assign(state, patch);

/**
 * The first recorded action fixes the clock every later entry is measured
 * against, so it also carries the start timestamp.
 */
const append = (
  state: RecorderState,
  action: Action,
  timestampMs: number,
): void =>
  chain(
    match(size(state.entries))
      .with(0, () => timestampMs)
      .otherwise(() => state.startedAtMs),
  )
    .thru((startedAtMs) => ({
      startedAtMs,
      entry: { atMs: timestampMs - startedAtMs, action },
    }))
    .thru(({ startedAtMs, entry }) =>
      mutate(state, {
        startedAtMs,
        entries: [...state.entries, entry],
      }),
    )
    .value();

export const createRecorder = (worldName: string): Recorder =>
  chain(emptyState())
    .thru((state): Recorder => ({
      record: (action, timestampMs) =>
        match(state.isRecording)
          .with(true, () => append(state, action, timestampMs))
          .otherwise(noop),
      stop: () => mutate(state, { isRecording: false }),
      reset: () => mutate(state, emptyState()),
      snapshot: () => ({
        worldName,
        startedAtMs: state.startedAtMs,
        entries: [...state.entries],
      }),
    }))
    .value();
