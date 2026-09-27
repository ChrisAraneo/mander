import type { Tile } from '@mander/model';
import { flow } from 'lodash-es';
import { createBedrockRows } from './internal/create-bedrock-rows';
import { createPadding } from './internal/create-padding';
import { createSkyRows } from './internal/create-sky-rows';
import { findFloorRow } from './internal/find-floor-row';
import { findLowestFilledRow } from './internal/find-lowest-filled-row';
import { getMissingDepth } from './internal/get-missing-depth';
import { stackPaddingRows } from './internal/stack-padding-rows';

export const addPadding = (tiles: Tile[][], front = tiles) =>
  flow(
    findLowestFilledRow,
    getMissingDepth,
    createPadding,
    findFloorRow,
    createSkyRows,
    createBedrockRows,
    stackPaddingRows,
  )({ tiles, front });
