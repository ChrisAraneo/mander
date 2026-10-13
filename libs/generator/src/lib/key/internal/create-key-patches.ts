import { TILE_KEY } from '@mander/model';
import { match, P } from 'ts-pattern';
import { KEY_HEIGHT } from '../../consts';
import { createStandingPatches } from '../../structures/create-standing-patches';
import type { getTopKeyCandidate } from './get-top-key-candidate';

const { nullish } = P;

export const createKeyPatches = ({
  tiles,
  candidate,
}: ReturnType<typeof getTopKeyCandidate>) => ({
  tiles,
  patches: match(candidate)
    .with(nullish, () => [])
    .otherwise((found) => createStandingPatches(found, TILE_KEY, KEY_HEIGHT)),
});
