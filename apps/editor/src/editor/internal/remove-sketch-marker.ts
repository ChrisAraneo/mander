import type { Layers } from '@mander/model';
import { STRUCTURE_END, STRUCTURE_START } from '@mander/structures';
import { includes } from 'lodash-es';
import { match } from 'ts-pattern';
import { removeMarker } from './remove-marker';

const MARKERS = [STRUCTURE_START, STRUCTURE_END];

export const removeSketchMarker = (sketch: Layers, value: number): Layers =>
  match(includes(MARKERS, value))
    .with(true, (): Layers => ({
      ...sketch,
      tiles: removeMarker(sketch.tiles, value),
    }))
    .otherwise(() => sketch);
