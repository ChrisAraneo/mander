import { createLightingPass } from '@mander/render';
import { tap } from 'lodash-es';
import { pipe } from 'remeda';
import { match, P } from 'ts-pattern';
import { patchRef } from './patch-ref';
import type { CanvasCell } from './types/canvas-cell';

const { nonNullable } = P;

export const initializeCanvas = (
  cell: CanvasCell,
): CanvasRenderingContext2D | null =>
  pipe(
    cell,
    (current) =>
      tap(current, ({ canvas, lighting }) =>
        patchRef(
          lighting,
          match(canvas.value)
            .with(nonNullable, (mounted) =>
              createLightingPass(mounted.ownerDocument.createElement('canvas')),
            )
            .otherwise(() => undefined),
        ),
      ),
    (current) =>
      patchRef(
        current.context,
        match(current.canvas.value)
          .with(nonNullable, (mounted) =>
            mounted.getContext('2d', { alpha: false }),
          )
          .otherwise(() => null),
      ),
  );
