import { type EntityBox, entityRectangle, type Player } from '@mander/model';
import type { Point } from '@mander/utils';
import { match, P } from 'ts-pattern';

import { isIntersecting } from './is-intersecting';

export const isNearTile = (
  player: Player,
  tile: Point | null,
  box: EntityBox,
  padding: number,
): boolean =>
  match(tile)
    .with(P.nullish, () => false)
    .otherwise((at) =>
      isIntersecting(player, entityRectangle(at, box), padding),
    );
