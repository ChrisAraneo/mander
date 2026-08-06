import type { Tile } from '@mander/engine';

import type { MaterialStyle } from './material-style';

export type MaterialPalette = (tile: Tile) => MaterialStyle;
