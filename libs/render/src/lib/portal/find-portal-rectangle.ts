import { type Level, findPortalTile, PORTAL_ENTITY_BOX, type Rectangle } from '@mander/model';
import { findEntityRectangle } from '../entity/find-entity-rectangle';

export const findPortalRectangle = (level: Level): Rectangle | undefined =>
  findEntityRectangle(findPortalTile(level), PORTAL_ENTITY_BOX);
