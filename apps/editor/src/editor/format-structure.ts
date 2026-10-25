import type { Layers } from '@mander/model';
import { formatLayer } from './internal/format-layer';

export const formatStructure = ({ tiles, backTiles }: Layers): string =>
  `[\n  ${formatLayer(tiles)},\n  ${formatLayer(backTiles)},\n]`;
