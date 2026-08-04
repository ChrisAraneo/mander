import {
  advancePlayback,
  createPlayback,
  emptyReplay,
  isReplayFinished,
  type Replay,
  replayDuration,
  type ReplayPlayback,
  replayProgress,
} from '@mander/engine';
import { indexOf } from 'lodash-es';
import { animationFrames, map, type Observable, pairwise } from 'rxjs';
import type { Subscription } from 'rxjs';
import { match, P } from 'ts-pattern';
import { onUnmounted, ref } from 'vue';

import { REPLAY_SPEEDS } from './consts';
import type { ReplayController } from './replay-controller';
import type { ReplaySource } from './replay-source';

const frameDeltas = (): Observable<number> =>
  animationFrames().pipe(
    pairwise(),
    map(([previous, current]) => current.timestamp - previous.timestamp),
  );

export const useReplay = (source: ReplaySource): ReplayController => {
  const isActive = ref(false);
  const isPaused = ref(false);
  const isFinished = ref(false);
  const speed = ref(REPLAY_SPEEDS[0]);
  const progress = ref(0);
  const elapsedSeconds = ref(0);
  const durationSeconds = ref(0);

  let recording: Replay = emptyReplay('');
  let playback: ReplayPlayback | null = null;
  let subscription: Subscription | null = null;

  const publish = (next: ReplayPlayback): void => {
    playback = next;
    progress.value = replayProgress(recording, next);
    elapsedSeconds.value = next.elapsedMs / 1000;
    isFinished.value = isReplayFinished(recording, next);
    source.render(next.state);
  };

  const onFrame = (deltaMs: number): void =>
    match({
      playback,
      paused: isPaused.value,
      finished: isFinished.value,
    })
      .with(
        { playback: P.nonNullable, paused: false, finished: false },
        ({ playback: current }) =>
          publish(advancePlayback(recording, current, deltaMs * speed.value)),
      )
      .otherwise(() => undefined);

  const play = (): void => {
    subscription?.unsubscribe();
    recording = source.replay();
    durationSeconds.value = replayDuration(recording) / 1000;
    speed.value = REPLAY_SPEEDS[0];
    isPaused.value = false;
    isActive.value = true;
    publish(createPlayback(source.initialState()));
    subscription = frameDeltas().subscribe(onFrame);
  };

  const stop = (): void => {
    subscription?.unsubscribe();
    subscription = null;
    playback = null;
    isActive.value = false;
    source.onStop();
  };

  onUnmounted(() => subscription?.unsubscribe());

  return {
    isActive,
    isPaused,
    isFinished,
    speed,
    progress,
    elapsedSeconds,
    durationSeconds,
    play,
    stop,
    togglePause: () =>
      match(isFinished.value)
        .with(true, () => play())
        .otherwise(() => {
          isPaused.value = !isPaused.value;
        }),
    cycleSpeed: () => {
      speed.value =
        REPLAY_SPEEDS[
          (indexOf(REPLAY_SPEEDS, speed.value) + 1) % REPLAY_SPEEDS.length
        ];
    },
  };
};
