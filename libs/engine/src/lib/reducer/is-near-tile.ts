import {
  type EntityBox,
  entityRect,
  type Player,
  type TilePosition,
} from '@mander/model';
import { match, P } from 'ts-pattern';

import { isIntersecting } from './is-intersecting';

export const isNearTile = (
  player: Player,
  tile: TilePosition | null,
  box: EntityBox,
  padding: number,
): boolean =>
  match(tile)
    .with(P.nullish, () => false)
    .otherwise((at) => isIntersecting(player, entityRect(at, box), padding));
