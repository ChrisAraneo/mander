import { type Player } from '@mander/model';
import type { GameState } from '../../../types/game-state';
import { nextShooters } from '../../enemy/next-shooters';
import type { Salvo } from '../../enemy/types/salvo';
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
