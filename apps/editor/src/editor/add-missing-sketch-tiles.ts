import type { Layers } from '@mander/model';
import { head, size } from 'lodash-es';
import { pipe } from 'remeda';
import { addMissingGridTiles } from './internal/add-missing-grid-tiles';

export const addMissingSketchTiles = (sketch: Layers): Layers =>
  pipe(
    sketch,
    (layers) => ({
      layers,
      height: size(layers.tiles),
      width: size(head(layers.tiles)),
    }),
    ({ layers, height, width }): Layers => ({
      tiles: addMissingGridTiles(layers.tiles, height, width),
      backTiles: addMissingGridTiles(layers.backTiles, height, width),
    }),
  );
