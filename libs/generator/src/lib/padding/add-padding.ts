import type { Tile } from '@mander/model';
import { flow } from 'lodash-es';
import { addPaddingRows } from './internal/add-padding-rows';
import { computeMissingDepth } from './internal/compute-missing-depth';
import { createBedrockRows } from './internal/create-bedrock-rows';
import { createPadding } from './internal/create-padding';
import { createSkyRows } from './internal/create-sky-rows';
import { findLowestFilledRow } from './internal/find-lowest-filled-row';
import { getFloorRow } from './internal/get-floor-row';

export const addPadding = (tiles: Tile[][], front = tiles) =>
  flow(
    findLowestFilledRow,
    computeMissingDepth,
    createPadding,
    getFloorRow,
    createSkyRows,
    createBedrockRows,
    addPaddingRows,
  )({ tiles, front });
