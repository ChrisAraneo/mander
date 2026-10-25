import {
  type Level,
  findChestTile,
  CHEST_ENTITY_BOX,
  type Rectangle,
} from '@mander/model';
import { toEntityRectangle } from '../entity/to-entity-rectangle';

export const findChestRectangle = (level: Level): Rectangle | undefined =>
  toEntityRectangle(findChestTile(level), CHEST_ENTITY_BOX);
