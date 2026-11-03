import type { GameState } from '@mander/engine';
import type { Viewport } from '../../types/viewport';

export interface LightingScene {
  state: GameState;
  viewport: Viewport;
  cameraX: number;
  cameraY: number;
}
