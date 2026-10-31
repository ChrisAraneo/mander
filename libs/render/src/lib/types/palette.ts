import type { PaletteMaterials } from './palette-materials';

export interface Palette {
  sky: readonly [string, string, string];
  hills: readonly [string, string];
  block: string;
  blockCap: string;
  blockCapHighlight: string;
  materials?: PaletteMaterials;
}
