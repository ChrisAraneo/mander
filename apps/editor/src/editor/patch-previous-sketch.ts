import type { Layers } from '@mander/model';
import { last, noop, slice } from 'lodash-es';
import { pipe } from 'remeda';
import { match, P } from 'ts-pattern';
import { patchRef } from './patch-ref';
import type { Editor } from './types/editor';

const { nullish } = P;

export const patchPreviousSketch = (editor: Editor): Layers[] | void =>
  match(last(editor.history.value))
    .with(nullish, noop)
    .otherwise((previous) =>
      pipe(
        previous,
        (sketch) => patchRef(editor.sketch, sketch),
        () => patchRef(editor.history, slice(editor.history.value, 0, -1)),
      ),
    );
