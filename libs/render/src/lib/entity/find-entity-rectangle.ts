import { type EntityBox, getEntityRectangle, type Point, type Rectangle } from '@mander/model';
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
