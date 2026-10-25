import type { Layers } from '@mander/model';
import { noop } from 'lodash-es';
import { match, P } from 'ts-pattern';
import { getSketchGrid } from './internal/get-sketch-grid';
import { patchSketchCell } from './internal/patch-sketch-cell';
import { patchRef } from './patch-ref';
import type { BrushLayer } from './types/brush-layer';
import type { Editor } from './types/editor';

const { nullish } = P;

export const patchEditorCell = (
  editor: Editor,
  row: number,
  column: number,
  value: number,
  layer: BrushLayer,
): Layers | void =>
  match(getSketchGrid(editor.sketch.value, layer)[row]?.[column])
    .with(nullish, noop)
    .with(value, noop)
    .otherwise(() =>
      patchRef(
        editor.sketch,
        patchSketchCell(editor.sketch.value, row, column, value, layer),
      ),
    );
