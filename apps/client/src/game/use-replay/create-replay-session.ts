import { createEmptyReplay } from '@mander/engine';
import type { Subscription } from 'rxjs';
import { ref, shallowRef } from 'vue';
import { REPLAY_SPEEDS } from './consts';
import type { GhostPlayback } from './types/ghost-playback';
import type { PlaybackFrame } from './types/playback-frame';
import type { ReplayOrigin } from './types/replay-origin';
import type { ReplaySession } from './types/replay-session';
import type { ReplayStage } from './types/replay-stage';

export const createReplaySession = (
  origin: ReplayOrigin,
  stage: ReplayStage,
): ReplaySession => ({
  origin,
  stage,
  isActive: ref(false),
  isPaused: ref(false),
  isFinished: ref(false),
  speed: ref(REPLAY_SPEEDS[0]),
  progress: ref(0),
  elapsedSeconds: ref(0),
  durationSeconds: ref(0),
  recording: shallowRef(createEmptyReplay('')),
  frame: shallowRef<PlaybackFrame | null>(null),
  ghosts: shallowRef<GhostPlayback[]>([]),
  subscription: shallowRef<Subscription | null>(null),
});
