import {
  createEmptyReplay,
  createPlayback,
  getReplayDuration,
  getReplayProgress,
  isReplayFinished,
  type Replay,
} from '@mander/engine';
import { FIXED_STEP_SECONDS } from '@mander/model';
import { interpolateState } from '@mander/render';
import { chain, tapEffect } from '@mander/utils';
import { assign, indexOf, noop, size } from 'lodash-es';
import type { Subscription } from 'rxjs';
import { match, P } from 'ts-pattern';
import { onUnmounted, ref, type Ref } from 'vue';

import { setRef } from '../canvas';
import { createFixedPulses, type Pulse } from '../tick';
import { REPLAY_SPEEDS } from './consts';
import {
  advanceGhosts,
  createGhosts,
  getGhostStates,
  type GhostPlayback,
} from './ghost-playback';
import {
  advanceFrames,
  createStartFrame,
  type PlaybackFrame,
} from './playback-frame';
import type { ReplayController } from './replay-controller';
import type { ReplaySource } from './replay-source';

const { nonNullable } = P;

interface ReplayCell {
  recording: Replay;
  frame: PlaybackFrame | null;
  ghosts: GhostPlayback[];
  subscription: Subscription | null;
}

interface ReplayStep {
  frame: PlaybackFrame;
  ghosts: GhostPlayback[];
  alpha: number;
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
  recording: createEmptyReplay(''),
  frame: null,
  ghosts: [],
  subscription: null,
});

const createPublisher =
  (cell: ReplayCell, refs: ReplayRefs, source: ReplaySource) =>
  (next: ReplayStep): void =>
    chain(assign(cell, { frame: next.frame, ghosts: next.ghosts }))
      .thru((current) =>
        setRef(
          refs.progress,
          getReplayProgress(current.recording, next.frame.playback),
        ),
      )
      .thru(() =>
        setRef(
          refs.elapsedSeconds,
          next.frame.playback.step * FIXED_STEP_SECONDS,
        ),
      )
      .thru(() =>
        setRef(
          refs.isFinished,
          isReplayFinished(cell.recording, next.frame.playback),
        ),
      )
      .thru(() =>
        source.render(
          interpolateState(
            next.frame.previous,
            next.frame.playback.state,
            next.alpha,
          ),
          getGhostStates(next.ghosts, next.alpha),
        ),
      )
      .value();

/**
 * Speed is a whole multiplier, so running it faster is running more steps, not
 * bigger ones - the run stays the run it was recorded as at every speed.
 */
const createFramer =
  (cell: ReplayCell, refs: ReplayRefs, publish: (next: ReplayStep) => void) =>
  (pulse: Pulse): void =>
    match({
      frame: cell.frame,
      isPaused: refs.isPaused.value,
      isFinished: refs.isFinished.value,
    })
      .with(
        { frame: nonNullable, isPaused: false, isFinished: false },
        ({ frame: current }) =>
          chain(pulse.steps * refs.speed.value)
            .thru((steps) => ({
              frame: advanceFrames(cell.recording, current, steps),
              ghosts: advanceGhosts(cell.ghosts, steps),
              alpha: pulse.alpha,
            }))
            .thru(publish)
            .value(),
      )
      .otherwise(noop);

const createPlay =
  (
    cell: ReplayCell,
    refs: ReplayRefs,
    source: ReplaySource,
    publish: (next: ReplayStep) => void,
    onPulse: (pulse: Pulse) => void,
  ) =>
  (): void =>
    chain(tapEffect(cell, (current) => current.subscription?.unsubscribe()))
      .thru((current) => assign(current, { recording: source.getReplay() }))
      .thru((current) =>
        setRef(
          refs.durationSeconds,
          getReplayDuration(current.recording) / 1000,
        ),
      )
      .thru(() => setRef(refs.speed, REPLAY_SPEEDS[0]))
      .thru(() => setRef(refs.isPaused, false))
      .thru(() => setRef(refs.isActive, true))
      .thru(() =>
        publish({
          frame: createStartFrame(createPlayback(source.getInitialState())),
          ghosts: createGhosts(source.getGhosts(), source.getInitialState),
          alpha: 0,
        }),
      )
      .thru(() =>
        assign(cell, {
          subscription: createFixedPulses().subscribe(onPulse),
        }),
      )
      .thru(noop)
      .value();

const createStop =
  (cell: ReplayCell, refs: ReplayRefs, source: ReplaySource) => (): void =>
    chain(tapEffect(cell, (current) => current.subscription?.unsubscribe()))
      .thru((current) =>
        assign(current, { subscription: null, frame: null, ghosts: [] }),
      )
      .thru(() => setRef(refs.isActive, false))
      .thru(() => source.handleStop())
      .value();

const createController = (
  refs: ReplayRefs,
  play: () => void,
  stop: () => void,
): ReplayController => ({
  ...refs,
  play,
  stop,
  togglePause: (): void =>
    void match(refs.isFinished.value)
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
      publish: createPublisher(ctx.cell, ctx.refs, source),
    }))
    .thru((ctx) => ({
      ...ctx,
      onPulse: createFramer(ctx.cell, ctx.refs, ctx.publish),
    }))
    .thru((ctx) => ({
      ...ctx,
      play: createPlay(ctx.cell, ctx.refs, source, ctx.publish, ctx.onPulse),
      stop: createStop(ctx.cell, ctx.refs, source),
    }))
    .thru((ctx) =>
      tapEffect(ctx, () =>
        onUnmounted(() => ctx.cell.subscription?.unsubscribe()),
      ),
    )
    .thru((ctx) => createController(ctx.refs, ctx.play, ctx.stop))
    .value();
