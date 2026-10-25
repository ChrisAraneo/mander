import type { GhostPlayback } from '../../types/ghost-playback';
import type { PlaybackFrame } from '../../types/playback-frame';

export interface ReplayStep {
  frame: PlaybackFrame;
  ghosts: GhostPlayback[];
  alpha: number;
}
