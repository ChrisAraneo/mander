import {
  type Level,
  findChestTile,
  getEntityRectangle,
  CHEST_ENTITY_BOX,
} from '@mander/model';
import type { Rectangle } from '@mander/utils';
import { constant } from 'lodash-es';
import { match, P } from 'ts-pattern';

const { nullish } = P;

export const findChestRectangle = (level: Level): Rectangle | undefined =>
  match(findChestTile(level))
    .with(nullish, constant(undefined))
    .otherwise((tile) => getEntityRectangle(tile, CHEST_ENTITY_BOX));
