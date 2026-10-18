import {
  type Level,
  findPortalTile,
  getEntityRectangle,
  PORTAL_ENTITY_BOX,
} from '@mander/model';
import type { Rectangle } from '@mander/utils';
import { constant } from 'lodash-es';
import { match, P } from 'ts-pattern';

const { nullish } = P;

export const findPortalRectangle = (level: Level): Rectangle | undefined =>
  match(findPortalTile(level))
    .with(nullish, constant(undefined))
    .otherwise((tile) => getEntityRectangle(tile, PORTAL_ENTITY_BOX));
