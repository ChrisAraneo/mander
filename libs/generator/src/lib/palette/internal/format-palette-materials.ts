import { formatHslCss, type PaletteMaterials } from '@mander/render';
import type { PaletteMaterialTones } from './types/palette-material-tones';

export const formatPaletteMaterials = ({
  brick,
  wood,
  ceramic,
}: PaletteMaterialTones): PaletteMaterials => ({
  brick: formatHslCss(brick),
  wood: formatHslCss(wood),
  ceramic: formatHslCss(ceramic),
});
