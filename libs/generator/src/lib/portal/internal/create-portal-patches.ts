import { PORTAL_HEIGHT, TILE_PORTAL } from '@mander/model';
import { match, P } from 'ts-pattern';
import { standTiles } from '../../structures/stand-tiles';
import type { pickPortalCandidate } from './pick-portal-candidate';

const { nullish } = P;

export const createPortalPatches = ({
  tiles,
  candidate,
}: ReturnType<typeof pickPortalCandidate>) => ({
  tiles,
  patches: match(candidate)
    .with(nullish, () => [])
    .otherwise((found) => standTiles(found, TILE_PORTAL, PORTAL_HEIGHT)),
});
