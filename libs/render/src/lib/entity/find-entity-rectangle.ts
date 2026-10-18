import { type EntityBox, getEntityRectangle } from '@mander/model';
import type { Point, Rectangle } from '@mander/utils';
import { constant } from 'lodash-es';
import { match, P } from 'ts-pattern';

const { nullish } = P;

export const findEntityRectangle = (
  tile: Point | null,
  box: EntityBox,
): Rectangle | undefined =>
  match(tile)
    .with(nullish, constant(undefined))
    .otherwise((found) => getEntityRectangle(found, box));
