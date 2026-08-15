import type { Tile } from '@mander/model';

import type { MaterialStyle } from './material-style';

export type MaterialPalette = (tile: Tile) => MaterialStyle;
