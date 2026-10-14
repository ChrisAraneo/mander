import type { Tile } from '@mander/model';
import { patchTiles } from '../../structures/patch-tiles';
import type { PortalPatch } from './types/portal-patch';

export const patchPortalTiles = ({ tiles, patches }: PortalPatch): Tile[][] =>
  patchTiles(tiles, patches);
