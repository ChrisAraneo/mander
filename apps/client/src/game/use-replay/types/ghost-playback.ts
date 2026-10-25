import type { Replay } from '@mander/engine';
import type { PlaybackFrame } from './playback-frame';

export interface GhostPlayback extends PlaybackFrame {
  recording: Replay;
}
