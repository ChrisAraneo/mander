import type { Level, Player } from '@mander/model';
import type { InputState } from '../../../../types/input-state';

export interface PlayerStepDelta {
  level: Level;
  player: Player;
  input: InputState;
  deltaSeconds: number;
}
