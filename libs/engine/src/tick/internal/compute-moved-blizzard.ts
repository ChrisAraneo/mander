import { nextFreezers } from '../../enemy/next-freezers';
import type { MovedBlizzard } from './types/moved-blizzard';
import type { MovedSalvo } from './types/moved-salvo';

export const computeMovedBlizzard = ({
  state,
  player,
  deltaSeconds,
  salvo,
}: MovedSalvo): MovedBlizzard => ({
  state,
  player,
  deltaSeconds,
  salvo,
  blizzard: nextFreezers(salvo.enemies, player, deltaSeconds),
});
