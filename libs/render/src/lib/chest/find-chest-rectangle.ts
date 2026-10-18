import { type Level, findChestTile, CHEST_ENTITY_BOX } from '@mander/model';
import type { Rectangle } from '@mander/utils';
import { findEntityRectangle } from '../entity/find-entity-rectangle';

export const findChestRectangle = (level: Level): Rectangle | undefined =>
  findEntityRectangle(findChestTile(level), CHEST_ENTITY_BOX);
