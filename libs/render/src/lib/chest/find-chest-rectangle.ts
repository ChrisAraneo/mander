import { type Level, findChestTile, CHEST_ENTITY_BOX, type Rectangle } from '@mander/model';
import { findEntityRectangle } from '../entity/find-entity-rectangle';

export const findChestRectangle = (level: Level): Rectangle | undefined =>
  findEntityRectangle(findChestTile(level), CHEST_ENTITY_BOX);
