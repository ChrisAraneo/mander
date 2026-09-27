import { TILE_KEY } from '@mander/model';
import { match, P } from 'ts-pattern';
import { KEY_HEIGHT } from '../../../consts';
import { standTiles } from '../../stand-tiles';
import type { pickKeyCandidate } from './pick-key-candidate';

const { nullish } = P;

export const createKeyPatches = ({
  tiles,
  candidate,
}: ReturnType<typeof pickKeyCandidate>) => ({
  tiles,
  patches: match(candidate)
    .with(nullish, () => [])
    .otherwise((found) => standTiles(found, TILE_KEY, KEY_HEIGHT)),
});
