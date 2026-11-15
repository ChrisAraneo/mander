import type { Player } from '@mander/model';
import { pipe } from 'remeda';
import type { GameState } from '../../state/types/game-state';
import { computeMovedBlizzard } from './compute-moved-blizzard';
import { computeMovedSalvo } from './compute-moved-salvo';
import { createMovedTickHazardSet } from './create-moved-tick-hazard-set';
import type { TickHazardSet } from './types/tick-hazard-set';

export const patchMovedTickHazards = (
  state: GameState,
  player: Player,
  deltaSeconds: number,
): TickHazardSet =>
  pipe(
    { state, player, deltaSeconds },
    computeMovedSalvo,
    computeMovedBlizzard,
    createMovedTickHazardSet,
  );
