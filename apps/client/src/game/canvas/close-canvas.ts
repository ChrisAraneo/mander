import { closeLightingPass } from '@mander/render';
import { noop, tap } from 'lodash-es';
import { pipe } from 'remeda';
import { match, P } from 'ts-pattern';
import { patchRef } from './patch-ref';
import type { CanvasCell } from './types/canvas-cell';

const { nonNullable } = P;

export const closeCanvas = (
  cell: CanvasCell,
): CanvasRenderingContext2D | null =>
  pipe(
    cell,
    (current) =>
      tap(current, ({ lighting }) =>
        match(lighting.value)
          .with(nonNullable, closeLightingPass)
          .otherwise(noop),
      ),
    (current) => tap(current, ({ lighting }) => patchRef(lighting, undefined)),
    (current) => patchRef(current.context, null),
  );
