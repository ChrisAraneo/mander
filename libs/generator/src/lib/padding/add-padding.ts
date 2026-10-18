import type { Tile } from '@mander/model';
import { flow } from 'lodash-es';
import { addPaddingRows } from './internal/add-padding-rows';
import { computePaddingMissingDepth } from './internal/compute-padding-missing-depth';
import { createPadding } from './internal/create-padding';
import { createPaddingBedrockRows } from './internal/create-padding-bedrock-rows';
import { createPaddingSkyRows } from './internal/create-padding-sky-rows';
import { findPaddingLowestFilledRow } from './internal/find-padding-lowest-filled-row';
import { getPaddingFloorRow } from './internal/get-padding-floor-row';

export const addPadding = (
  tiles: Tile[][],
  front: Tile[][] = tiles,
): Tile[][] =>
  flow(
    findPaddingLowestFilledRow,
    computePaddingMissingDepth,
    createPadding,
    getPaddingFloorRow,
    createPaddingSkyRows,
    createPaddingBedrockRows,
    addPaddingRows,
  )({ tiles, front });
