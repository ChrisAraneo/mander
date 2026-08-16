import { chain } from '@mander/utils';
import { SOLID_TILES, type Tile, TILE_DIRT, TILE_WOOD } from '@mander/model';
import { type Hsl, hslCss, parseHsl, shiftHsl } from '@mander/utils';
import { assign, map } from 'lodash-es';
import { match, P } from 'ts-pattern';

import type { Palette } from '../palette';
import { CAP_LIGHTNESS_GAIN, HIGHLIGHT, JOINT, WOOD_JOINT } from './consts';
import type { MaterialPalette } from './material-palette';
import type { MaterialStyle } from './material-style';
import { materialStyle } from './material-styles';
import { materialTint } from './material-tints';

type Cap = Pick<MaterialStyle, 'cap' | 'capHighlight'>;

const { nullish } = P;

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

const styleFor = (tile: Tile, palette: Palette, ground: Hsl): MaterialStyle =>
  chain(shiftHsl(ground, materialTint(tile)))
    .thru((base): MaterialStyle =>
      assign({ base: hslCss(base) }, capOf(tile, palette, base), {
        joint: jointOf(tile),
        highlight: HIGHLIGHT,
      }),
    )
    .value();

const groundedPalette = (palette: Palette, ground: Hsl): MaterialPalette =>
  chain(SOLID_TILES)
    .thru((tiles) =>
      map(tiles, (tile): [Tile, MaterialStyle] => [
        tile,
        styleFor(tile, palette, ground),
      ]),
    )
    .thru((entries) => new Map<Tile, MaterialStyle>(entries))
    .thru(
      (styles): MaterialPalette =>
        (tile) =>
          styles.get(tile) ?? materialStyle(tile),
    )
    .value();

export const materialPalette = (palette: Palette): MaterialPalette =>
  match(parseHsl(palette.block))
    .with(nullish, (): MaterialPalette => materialStyle)
    .otherwise((ground): MaterialPalette => groundedPalette(palette, ground));
