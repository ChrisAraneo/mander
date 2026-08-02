import {
  type Palette,
  SOLID_TILES,
  type Tile,
  TILE_DIRT,
  TILE_WOOD,
} from '@mander/engine';
import { type Hsl, hslCss, parseHsl, shiftHsl } from '@mander/utils';
import { map } from 'lodash-es';
import { match, P } from 'ts-pattern';

import type { MaterialStyle } from './material-style';
import { materialStyle } from './material-styles';
import { CAP_LIGHTNESS_GAIN, materialTint } from './material-tint';

/**
 * A level's own set of block colours: the palette it rolled, read as the five
 * materials the player actually sees. Every solid tile has an entry.
 */
export type MaterialPalette = (tile: Tile) => MaterialStyle;

type Cap = Pick<MaterialStyle, 'cap' | 'capHighlight'>;

// Recessed and raised detail is left colourless on purpose: black and white at
// low alpha darken and lift whatever hue the level rolled, where a fixed brown
// or grey would fight it. Plank seams cut deeper than mortar joints.
const JOINT = 'RGBA(0, 0, 0, 0.26)';
const WOOD_JOINT = 'RGBA(0, 0, 0, 0.55)';
const HIGHLIGHT = 'RGBA(255, 255, 255, 0.16)';

const jointOf = (tile: Tile): string =>
  match(tile)
    .with(TILE_WOOD, () => WOOD_JOINT)
    .otherwise(() => JOINT);

/**
 * Dirt wears the cap the palette rolled — that is the grass, and it is picked
 * to stand clear of the player's colour. Every other material caps itself with
 * a lighter shade of its own body.
 */
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

/**
 * The blocks of one level, coloured from its palette. Built once per frame
 * rather than once per tile: the colours only move when the palette does.
 *
 * A level with no ground colour to work from — a structure preview in the
 * editor, a test fixture — falls back to the hand-picked styles.
 */
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
