import { type Player } from '@mander/model';
import { pipe } from 'remeda';
import type { GameState } from '../../../types/game-state';
import { nextBullets } from '../../bullet/next-bullets';
import { nextFreezers } from '../../enemy/next-freezers';
import { nextFallingSpikes } from '../../falling-spike/next-falling-spikes';
import { nextFireballs } from '../../fireball/next-fireballs';
import { nextSnowballs } from '../../snowball/next-snowballs';
import { addBlizzardSnowballs } from './add-blizzard-snowballs';
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
    pipe(nextFreezers(salvo.enemies, player, deltaSeconds), (blizzard) =>
      createTickHazardSet(
        blizzard.enemies,
        addSalvoCannonballs(
          patchMovedBarrage(state, player, deltaSeconds),
          salvo,
        ),
        addBlizzardSnowballs(
          nextSnowballs(state.level, state.snowballs, deltaSeconds),
          blizzard,
        ),
        nextFallingSpikes(
          state.level,
          state.fallingSpikes,
          player,
          deltaSeconds,
        ),
        nextFireballs(state.fireballs, deltaSeconds),
        nextBullets(state.level, state.bullets, deltaSeconds),
      ),
    ),
  );
