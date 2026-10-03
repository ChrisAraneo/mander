import { TILE_CHEST } from '@mander/model';
import { match, P } from 'ts-pattern';
import { CHEST_HEIGHT } from '../../consts';
import { standTiles } from '../../structures/stand-tiles';
import type { pickChestCandidate } from './pick-chest-candidate';

const { nullish } = P;

export const createChestPatches = ({
  tiles,
  candidate,
}: ReturnType<typeof pickChestCandidate>) => ({
  tiles,
  patches: match(candidate)
    .with(nullish, () => [])
    .otherwise((found) => standTiles(found, TILE_CHEST, CHEST_HEIGHT)),
});
