import {
  type Level,
  findPortalTile,
  PORTAL_ENTITY_BOX,
  type Rectangle,
} from '@mander/model';
import { toEntityRectangle } from '../entity/to-entity-rectangle';

export const findPortalRectangle = (level: Level): Rectangle | undefined =>
  toEntityRectangle(findPortalTile(level), PORTAL_ENTITY_BOX);
