import { TILE_SIZE } from '@mander/model';
import { STRUCTURE_END } from '@mander/structures';
import { assign, tap } from 'lodash-es';
import { pipe } from 'remeda';
import { match } from 'ts-pattern';
import type { Marker } from './types/marker';

const START_COLOUR = '#7ea653';
const END_COLOUR = '#e0b83a';

export const drawMarker = (
  context: CanvasRenderingContext2D,
  cell: number,
  row: number,
  column: number,
): void =>
  pipe(
    match(cell)
      .with(STRUCTURE_END, () => ({ colour: END_COLOUR, glyph: 'E' }))
      .otherwise(() => ({ colour: START_COLOUR, glyph: 'S' })),
    ({ colour, glyph }): Marker => ({
      colour,
      glyph,
      pixelX: column * TILE_SIZE,
      pixelY: row * TILE_SIZE,
    }),
    (marker) => tap(marker, () => context.save()),
    (marker) =>
      tap(marker, () =>
        assign(context, {
          globalAlpha: 0.22,
          fillStyle: marker.colour,
        }),
      ),
    (marker) =>
      tap(marker, () =>
        context.fillRect(marker.pixelX, marker.pixelY, TILE_SIZE, TILE_SIZE),
      ),
    (marker) =>
      tap(marker, () =>
        assign(context, {
          globalAlpha: 1,
          strokeStyle: marker.colour,
          lineWidth: 2,
        }),
      ),
    (marker) =>
      tap(marker, () =>
        context.strokeRect(
          marker.pixelX + 1,
          marker.pixelY + 1,
          TILE_SIZE - 2,
          TILE_SIZE - 2,
        ),
      ),
    (marker) =>
      tap(marker, () =>
        assign(context, {
          fillStyle: marker.colour,
          font: `bold ${TILE_SIZE / 2}px 'Cascadia Mono', Consolas, monospace`,
          textAlign: 'center',
          textBaseline: 'middle',
        }),
      ),
    (marker) =>
      tap(marker, () =>
        context.fillText(
          marker.glyph,
          marker.pixelX + TILE_SIZE / 2,
          marker.pixelY + TILE_SIZE / 2 + 1,
        ),
      ),
    () => context.restore(),
  );
