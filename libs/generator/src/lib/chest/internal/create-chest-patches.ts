import { TILE_CHEST } from '@mander/model';
import { match, P } from 'ts-pattern';
import { CHEST_HEIGHT } from '../../consts';
import { createStandingPatches } from '../../structures/create-standing-patches';
import type { ChestPatch } from './types/chest-patch';
import type { TopChestCandidate } from './types/top-chest-candidate';

const { nullish } = P;

export const createChestPatches = ({
  tiles,
  candidate,
}: TopChestCandidate): ChestPatch => ({
  tiles,
  patches: match(candidate)
    .with(nullish, () => [])
    .otherwise((found) =>
      createStandingPatches(found, TILE_CHEST, CHEST_HEIGHT),
    ),
});
