import { type Player } from '@mander/model';
import { pipe } from 'remeda';
import type { GameState } from '../../../types/game-state';
import { nextBullets } from '../../bullet/next-bullets';
import { nextFallingSpikes } from '../../falling-spike/next-falling-spikes';
import { nextFireballs } from '../../fireball/next-fireballs';
import { addSalvoCannonballs } from './add-salvo-cannonballs';
import { createTickHazardSet } from './create-tick-hazard-set';
import { patchMovedBarrage } from './patch-moved-barrage';
import { patchMovedSalvo } from './patch-moved-salvo';
import type { TickHazardSet } from './types/tick-hazard-set';

export const patchMovedTickHazards = (
  state: GameState,
  player: Player,
  deltaSeconds: number,
): TickHazardSet =>
  pipe(patchMovedSalvo(state, player, deltaSeconds), (salvo) =>
    createTickHazardSet(
      salvo.enemies,
      addSalvoCannonballs(
        patchMovedBarrage(state, player, deltaSeconds),
        salvo,
      ),
      nextFallingSpikes(state.level, state.fallingSpikes, player, deltaSeconds),
      nextFireballs(state.fireballs, deltaSeconds),
      nextBullets(state.level, state.bullets, deltaSeconds),
    ),
  );
