import type { Player } from '@mander/model';
import type { GameState } from '../../state/types/game-state';
import { patchMovedSalvo } from './patch-moved-salvo';
import type { MovedSalvo } from './types/moved-salvo';

export const computeMovedSalvo = ({
  state,
  player,
  deltaSeconds,
}: {
  state: GameState;
  player: Player;
  deltaSeconds: number;
}): MovedSalvo => ({
  state,
  player,
  deltaSeconds,
  salvo: patchMovedSalvo(state, player, deltaSeconds),
});
