import { type Level, findPortalTile, PORTAL_ENTITY_BOX } from '@mander/model';
import type { Rectangle } from '@mander/utils';
import { findEntityRectangle } from '../entity/find-entity-rectangle';

export const findPortalRectangle = (level: Level): Rectangle | undefined =>
  findEntityRectangle(findPortalTile(level), PORTAL_ENTITY_BOX);
