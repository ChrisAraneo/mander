import type { Layers } from '@mander/model';
import { noop, size } from 'lodash-es';
import { match } from 'ts-pattern';
import { createSketch } from '../create-sketch';
import { getHeight } from '../get-height';
import { patchEditorSketch } from '../patch-editor-sketch';
import type { Editor } from '../types/editor';
import type { Pool } from '../types/pool';

export const patchPoolSketch = (editor: Editor, pool: Pool): Layers | void =>
  match(size(editor.sketch.value.tiles) === getHeight(pool))
    .with(true, noop)
    .otherwise(() => patchEditorSketch(editor, createSketch(pool)));
