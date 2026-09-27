import type { Tile } from '@mander/model';
import { head } from 'lodash-es';
import type { Spot } from '../../find-standing-spots';

export const pickPortalCandidate = ({
  tiles,
  candidates,
}: {
  tiles: Tile[][];
  candidates: Spot[];
}) => ({
  tiles,
  candidate: head(candidates),
});
