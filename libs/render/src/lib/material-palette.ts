import { SOLID_TILES, type Tile, TILE_DIRT, TILE_WOOD } from '@mander/engine';
import { type Hsl, hslCss, parseHsl, shiftHsl } from '@mander/utils';
import { map } from 'lodash-es';
import { match, P } from 'ts-pattern';

import type { MaterialStyle } from './material-style';
import { materialStyle } from './material-styles';
import { CAP_LIGHTNESS_GAIN, materialTint } from './material-tint';
import type { Palette } from './palette';

export type MaterialPalette = (tile: Tile) => MaterialStyle;

type Cap = Pick<MaterialStyle, 'cap' | 'capHighlight'>;

const JOINT = 'RGBA(0, 0, 0, 0.26)';
const WOOD_JOINT = 'RGBA(0, 0, 0, 0.55)';
const HIGHLIGHT = 'RGBA(255, 255, 255, 0.16)';

const jointOf = (tile: Tile): string =>
  match(tile)
    .with(TILE_WOOD, () => WOOD_JOINT)
    .otherwise(() => JOINT);

const capOf = (tile: Tile, palette: Palette, base: Hsl): Cap =>
  match(tile === TILE_DIRT)
    .with(true, (): Cap => ({
      cap: palette.blockCap,
      capHighlight: palette.blockCapHighlight,
    }))
    .otherwise((): Cap => ({
      cap: hslCss(shiftHsl(base, { lightness: CAP_LIGHTNESS_GAIN })),
      capHighlight: hslCss(
        shiftHsl(base, { lightness: CAP_LIGHTNESS_GAIN * 2 }),
      ),
    }));

const styleFor = (tile: Tile, palette: Palette, ground: Hsl): MaterialStyle => {
  const base = shiftHsl(ground, materialTint(tile));
  return {
    base: hslCss(base),
    ...capOf(tile, palette, base),
    joint: jointOf(tile),
    highlight: HIGHLIGHT,
  };
};

export const materialPalette = (palette: Palette): MaterialPalette =>
  match(parseHsl(palette.block))
    .with(P.nullish, (): MaterialPalette => materialStyle)
    .otherwise((ground): MaterialPalette => {
      const styles = new Map<Tile, MaterialStyle>(
        map(SOLID_TILES, (tile): [Tile, MaterialStyle] => [
          tile,
          styleFor(tile, palette, ground),
        ]),
      );
      return (tile) => styles.get(tile) ?? materialStyle(tile);
    });
