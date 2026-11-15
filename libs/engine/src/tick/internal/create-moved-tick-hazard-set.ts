import { nextBullets } from '../../bullet/next-bullets';
import { nextFallingSpikes } from '../../falling-spike/next-falling-spikes';
import { nextFireballs } from '../../fireball/next-fireballs';
import { nextSnowballs } from '../../snowball/next-snowballs';
import { addBlizzardSnowballs } from './add-blizzard-snowballs';
import { addSalvoCannonballs } from './add-salvo-cannonballs';
import { createTickHazardSet } from './create-tick-hazard-set';
import { patchMovedBarrage } from './patch-moved-barrage';
import type { MovedBlizzard } from './types/moved-blizzard';
import type { TickHazardSet } from './types/tick-hazard-set';

export const createMovedTickHazardSet = ({
  state,
  player,
  deltaSeconds,
  salvo,
  blizzard,
}: MovedBlizzard): TickHazardSet =>
  createTickHazardSet(
    blizzard.enemies,
    addSalvoCannonballs(patchMovedBarrage(state, player, deltaSeconds), salvo),
    addBlizzardSnowballs(
      nextSnowballs(state.snowballs, state.level, deltaSeconds),
      blizzard,
    ),
    nextFallingSpikes(state.level, state.fallingSpikes, player, deltaSeconds),
    nextFireballs(state.fireballs, deltaSeconds),
    nextBullets(state.bullets, state.level, deltaSeconds),
  );
