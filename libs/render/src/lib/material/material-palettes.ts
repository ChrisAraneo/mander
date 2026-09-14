import { chain } from '@mander/utils';
import { SOLID_TILES, type Tile, TILE_DIRT, TILE_WOOD } from '@mander/model';
import { formatHslCss, type Hsl, parseHsl, shiftHsl } from '@mander/utils';
import { assign, map } from 'lodash-es';
import { match, P } from 'ts-pattern';

import type { Palette } from '../palette';
import { CAP_LIGHTNESS_GAIN, HIGHLIGHT, JOINT, WOOD_JOINT } from './consts';
import type { MaterialPalette } from './material-palette';
import type { MaterialStyle } from './material-style';
import { getMaterialStyle } from './material-styles';
import { getMaterialTint } from './material-tints';

type Cap = Pick<MaterialStyle, 'cap' | 'capHighlight'>;

const { nullish } = P;

const getJoint = (tile: Tile): string =>
  match(tile)
    .with(TILE_WOOD, () => WOOD_JOINT)
    .otherwise(() => JOINT);

const getCap = (tile: Tile, palette: Palette, base: Hsl): Cap =>
  match(tile === TILE_DIRT)
    .with(true, (): Cap => ({
      cap: palette.blockCap,
      capHighlight: palette.blockCapHighlight,
    }))
    .otherwise((): Cap => ({
      cap: formatHslCss(shiftHsl(base, { lightness: CAP_LIGHTNESS_GAIN })),
      capHighlight: formatHslCss(
        shiftHsl(base, { lightness: CAP_LIGHTNESS_GAIN * 2 }),
      ),
    }));

const createStyle = (
  tile: Tile,
  palette: Palette,
  ground: Hsl,
): MaterialStyle =>
  chain(shiftHsl(ground, getMaterialTint(tile)))
    .thru((base): MaterialStyle =>
      assign({ base: formatHslCss(base) }, getCap(tile, palette, base), {
        joint: getJoint(tile),
        highlight: HIGHLIGHT,
      }),
    )
    .value();

const createGroundedPalette = (
  palette: Palette,
  ground: Hsl,
): MaterialPalette =>
  chain(SOLID_TILES)
    .thru((tiles) =>
      map(tiles, (tile): [Tile, MaterialStyle] => [
        tile,
        createStyle(tile, palette, ground),
      ]),
    )
    .thru((entries) => new Map<Tile, MaterialStyle>(entries))
    .thru(
      (styles): MaterialPalette =>
        (tile) =>
          styles.get(tile) ?? getMaterialStyle(tile),
    )
    .value();

export const createMaterialPalette = (palette: Palette): MaterialPalette =>
  match(parseHsl(palette.block))
    .with(nullish, (): MaterialPalette => getMaterialStyle)
    .otherwise((ground): MaterialPalette =>
      createGroundedPalette(palette, ground),
    );
