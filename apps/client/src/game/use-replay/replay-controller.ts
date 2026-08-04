import type { Ref } from 'vue';

export interface ReplayController {
  isActive: Ref<boolean>;
  isPaused: Ref<boolean>;
  isFinished: Ref<boolean>;
  speed: Ref<number>;
  progress: Ref<number>;
  elapsedSeconds: Ref<number>;
  durationSeconds: Ref<number>;
  play(): void;
  stop(): void;
  togglePause(): void;
  cycleSpeed(): void;
}
