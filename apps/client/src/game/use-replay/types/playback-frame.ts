import type { GameState, ReplayPlayback } from '@mander/engine';

export interface PlaybackFrame {
  previous: GameState;
  playback: ReplayPlayback;
}
