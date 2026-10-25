import type { GameState, RecorderState } from '@mander/engine';
import type { ShallowRef } from 'vue';

export interface GameReplayOrigin {
  kind: 'GAME';
  recorder: ShallowRef<RecorderState>;
  state: ShallowRef<GameState>;
}
