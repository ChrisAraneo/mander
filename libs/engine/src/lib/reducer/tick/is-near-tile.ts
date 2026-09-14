import { type EntityBox, getEntityRectangle, type Player } from '@mander/model';
import type { Point } from '@mander/utils';
import { match, P } from 'ts-pattern';

import { isIntersecting } from './is-intersecting';

const { nullish } = P;

export const isNearTile = (
  player: Player,
  tile: Point | null,
  box: EntityBox,
  padding: number,
): boolean =>
  match(tile)
    .with(nullish, () => false)
    .otherwise((at) =>
      isIntersecting(player, getEntityRectangle(at, box), padding),
    );
