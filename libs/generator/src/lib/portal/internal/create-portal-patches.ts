import { PORTAL_HEIGHT, TILE_PORTAL } from '@mander/model';
import { match, P } from 'ts-pattern';
import { createStandingPatches } from '../../structures/create-standing-patches';
import type { PortalPatch } from './types/portal-patch';
import type { TopPortalCandidate } from './types/top-portal-candidate';

const { nullish } = P;

export const createPortalPatches = ({
  tiles,
  candidate,
}: TopPortalCandidate): PortalPatch => ({
  tiles,
  patches: match(candidate)
    .with(nullish, () => [])
    .otherwise((found) =>
      createStandingPatches(found, TILE_PORTAL, PORTAL_HEIGHT),
    ),
});
