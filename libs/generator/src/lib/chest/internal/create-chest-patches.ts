import { TILE_CHEST } from '@mander/model';
import { match, P } from 'ts-pattern';
import { CHEST_HEIGHT } from '../../consts';
import { createStandingPatches } from '../../structures/create-standing-patches';
import type { getTopChestCandidate } from './get-top-chest-candidate';

const { nullish } = P;

export const createChestPatches = ({
  tiles,
  candidate,
}: ReturnType<typeof getTopChestCandidate>) => ({
  tiles,
  patches: match(candidate)
    .with(nullish, () => [])
    .otherwise((found) =>
      createStandingPatches(found, TILE_CHEST, CHEST_HEIGHT),
    ),
});
