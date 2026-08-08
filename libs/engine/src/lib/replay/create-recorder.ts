import { match } from 'ts-pattern';

import type { Action } from '../actions/types/actions';
import type { RecordedAction } from './types/recorded-action';
import type { Recorder } from './types/recorder';

export const createRecorder = (worldName: string): Recorder => {
  let entries: RecordedAction[] = [];
  let startedAtMs = 0;
  let isRecording = true;

  const append = (action: Action, timestampMs: number): void => {
    match(entries.length)
      .with(0, () => {
        startedAtMs = timestampMs;
      })
      .otherwise(() => undefined);
    entries.push({ atMs: timestampMs - startedAtMs, action });
  };

  return {
    record: (action, timestampMs) =>
      match(isRecording)
        .with(true, () => append(action, timestampMs))
        .otherwise(() => undefined),
    stop: () => {
      isRecording = false;
    },
    reset: () => {
      entries = [];
      startedAtMs = 0;
      isRecording = true;
    },
    snapshot: () => ({ worldName, startedAtMs, entries: [...entries] }),
  };
};
