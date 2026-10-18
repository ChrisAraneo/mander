import { TILE_SIZE, chain } from '@mander/model';
import { STRUCTURE_END } from '@mander/structures';
import { assign, tap } from 'lodash-es';
import { match } from 'ts-pattern';

const START_COLOUR = '#7ea653';
const END_COLOUR = '#e0b83a';

interface Marker {
  colour: string;
  glyph: string;
  pixelX: number;
  pixelY: number;
}

export const drawMarker = (
  context: CanvasRenderingContext2D,
  cell: number,
  row: number,
  column: number,
): void =>
  chain(
    match(cell)
      .with(STRUCTURE_END, () => ({ colour: END_COLOUR, glyph: 'E' }))
      .otherwise(() => ({ colour: START_COLOUR, glyph: 'S' })),
  )
    .thru(({ colour, glyph }): Marker => ({
      colour,
      glyph,
      pixelX: column * TILE_SIZE,
      pixelY: row * TILE_SIZE,
    }))
    .thru((marker) => tap(marker, () => context.save()))
    .thru((marker) =>
      tap(marker, () =>
        assign(context, {
          globalAlpha: 0.22,
          fillStyle: marker.colour,
        }),
      ),
    )
    .thru((marker) =>
      tap(marker, () =>
        context.fillRect(marker.pixelX, marker.pixelY, TILE_SIZE, TILE_SIZE),
      ),
    )
    .thru((marker) =>
      tap(marker, () =>
        assign(context, {
          globalAlpha: 1,
          strokeStyle: marker.colour,
          lineWidth: 2,
        }),
      ),
    )
    .thru((marker) =>
      tap(marker, () =>
        context.strokeRect(
          marker.pixelX + 1,
          marker.pixelY + 1,
          TILE_SIZE - 2,
          TILE_SIZE - 2,
        ),
      ),
    )
    .thru((marker) =>
      tap(marker, () =>
        assign(context, {
          fillStyle: marker.colour,
          font: `bold ${TILE_SIZE / 2}px 'Cascadia Mono', Consolas, monospace`,
          textAlign: 'center',
          textBaseline: 'middle',
        }),
      ),
    )
    .thru((marker) =>
      tap(marker, () =>
        context.fillText(
          marker.glyph,
          marker.pixelX + TILE_SIZE / 2,
          marker.pixelY + TILE_SIZE / 2 + 1,
        ),
      ),
    )
    .thru(() => context.restore())
    .value();
