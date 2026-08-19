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
import { chain, withEffect } from '@mander/utils';
import { assign, indexOf, noop, size } from 'lodash-es';
import { animationFrames, map, type Observable, pairwise } from 'rxjs';
import type { Subscription } from 'rxjs';
import { match, P } from 'ts-pattern';
import { onUnmounted, ref, type Ref } from 'vue';

import { setRef } from '../canvas';
import { REPLAY_SPEEDS } from './consts';
import type { ReplayController } from './replay-controller';
import type { ReplaySource } from './replay-source';

const { nonNullable } = P;

interface ReplayCell {
  recording: Replay;
  playback: ReplayPlayback | null;
  subscription: Subscription | null;
}

interface ReplayRefs {
  isActive: Ref<boolean>;
  isPaused: Ref<boolean>;
  isFinished: Ref<boolean>;
  speed: Ref<number>;
  progress: Ref<number>;
  elapsedSeconds: Ref<number>;
  durationSeconds: Ref<number>;
}

const frameDeltas = (): Observable<number> =>
  animationFrames().pipe(
    pairwise(),
    map(([previous, current]) => current.timestamp - previous.timestamp),
  );

const createRefs = (): ReplayRefs => ({
  isActive: ref(false),
  isPaused: ref(false),
  isFinished: ref(false),
  speed: ref(REPLAY_SPEEDS[0]),
  progress: ref(0),
  elapsedSeconds: ref(0),
  durationSeconds: ref(0),
});

const createCell = (): ReplayCell => ({
  recording: emptyReplay(''),
  playback: null,
  subscription: null,
});

const publisher =
  (cell: ReplayCell, refs: ReplayRefs, source: ReplaySource) =>
  (next: ReplayPlayback): void =>
    chain(assign(cell, { playback: next }))
      .thru((current) =>
        setRef(refs.progress, replayProgress(current.recording, next)),
      )
      .thru(() => setRef(refs.elapsedSeconds, next.elapsedMs / 1000))
      .thru(() =>
        setRef(refs.isFinished, isReplayFinished(cell.recording, next)),
      )
      .thru(() => source.render(next.state))
      .value();

const framer =
  (
    cell: ReplayCell,
    refs: ReplayRefs,
    publish: (next: ReplayPlayback) => void,
  ) =>
  (deltaMs: number): void =>
    match({
      playback: cell.playback,
      paused: refs.isPaused.value,
      finished: refs.isFinished.value,
    })
      .with(
        { playback: nonNullable, paused: false, finished: false },
        ({ playback: current }) =>
          publish(
            advancePlayback(
              cell.recording,
              current,
              deltaMs * refs.speed.value,
            ),
          ),
      )
      .otherwise(noop);

const player =
  (
    cell: ReplayCell,
    refs: ReplayRefs,
    source: ReplaySource,
    publish: (next: ReplayPlayback) => void,
    onFrame: (deltaMs: number) => void,
  ) =>
  (): void =>
    chain(withEffect(cell, (current) => current.subscription?.unsubscribe()))
      .thru((current) => assign(current, { recording: source.replay() }))
      .thru((current) =>
        setRef(refs.durationSeconds, replayDuration(current.recording) / 1000),
      )
      .thru(() => setRef(refs.speed, REPLAY_SPEEDS[0]))
      .thru(() => setRef(refs.isPaused, false))
      .thru(() => setRef(refs.isActive, true))
      .thru(() => publish(createPlayback(source.initialState())))
      .thru(() =>
        assign(cell, {
          subscription: frameDeltas().subscribe(onFrame),
        }),
      )
      .thru(noop)
      .value();

const stopper =
  (cell: ReplayCell, refs: ReplayRefs, source: ReplaySource) => (): void =>
    chain(withEffect(cell, (current) => current.subscription?.unsubscribe()))
      .thru((current) =>
        assign(current, { subscription: null, playback: null }),
      )
      .thru(() => setRef(refs.isActive, false))
      .thru(() => source.onStop())
      .value();

const toController = (
  refs: ReplayRefs,
  play: () => void,
  stop: () => void,
): ReplayController => ({
  ...refs,
  play,
  stop,
  togglePause: () =>
    match(refs.isFinished.value)
      .with(true, () => play())
      .otherwise(() => setRef(refs.isPaused, !refs.isPaused.value)),
  cycleSpeed: () =>
    setRef(
      refs.speed,
      REPLAY_SPEEDS[
        (indexOf(REPLAY_SPEEDS, refs.speed.value) + 1) % size(REPLAY_SPEEDS)
      ],
    ),
});

export const useReplay = (source: ReplaySource): ReplayController =>
  chain({ refs: createRefs(), cell: createCell() })
    .thru((ctx) => ({
      ...ctx,
      publish: publisher(ctx.cell, ctx.refs, source),
    }))
    .thru((ctx) => ({
      ...ctx,
      onFrame: framer(ctx.cell, ctx.refs, ctx.publish),
    }))
    .thru((ctx) => ({
      ...ctx,
      play: player(ctx.cell, ctx.refs, source, ctx.publish, ctx.onFrame),
      stop: stopper(ctx.cell, ctx.refs, source),
    }))
    .thru((ctx) =>
      withEffect(ctx, () =>
        onUnmounted(() => ctx.cell.subscription?.unsubscribe()),
      ),
    )
    .thru((ctx) => toController(ctx.refs, ctx.play, ctx.stop))
    .value();
