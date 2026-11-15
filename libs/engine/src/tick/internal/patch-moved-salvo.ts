import type { Player } from '@mander/model';
import { nextShooters } from '../../enemy/next-shooters';
import type { Salvo } from '../../enemy/types/salvo';
import type { GameState } from '../../state/types/game-state';
import { patchMovedEnemies } from './patch-moved-enemies';

export const patchMovedSalvo = (
  state: GameState,
  player: Player,
  deltaSeconds: number,
): Salvo =>
  nextShooters(
    patchMovedEnemies(state, player, deltaSeconds),
    player,
    deltaSeconds,
  );
