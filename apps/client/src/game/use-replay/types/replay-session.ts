import type { Replay } from '@mander/engine';
import type { Subscription } from 'rxjs';
import type { Ref, ShallowRef } from 'vue';
import type { GhostPlayback } from './ghost-playback';
import type { PlaybackFrame } from './playback-frame';
import type { ReplayOrigin } from './replay-origin';
import type { ReplayStage } from './replay-stage';

export interface ReplaySession {
  origin: ReplayOrigin;
  stage: ReplayStage;
  isActive: Ref<boolean>;
  isPaused: Ref<boolean>;
  isFinished: Ref<boolean>;
  speed: Ref<number>;
  progress: Ref<number>;
  elapsedSeconds: Ref<number>;
  durationSeconds: Ref<number>;
  recording: ShallowRef<Replay>;
  frame: ShallowRef<PlaybackFrame | null>;
  ghosts: ShallowRef<GhostPlayback[]>;
  subscription: ShallowRef<Subscription | null>;
}
