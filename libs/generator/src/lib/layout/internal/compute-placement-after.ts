import {
  type Sector,
  STRUCTURE_END,
  STRUCTURE_HEIGHT,
  STRUCTURE_START,
  STRUCTURE_WIDTH,
} from '@mander/structures';
import type { Cell } from '../../types/cell';
import { createPlacement } from './create-placement';
import { findMarker } from './find-marker';
import type { StructurePlacement } from './types/structure-placement';

const DEFAULT_START: Cell = { row: STRUCTURE_HEIGHT - 1, column: 0 };

const DEFAULT_END: Cell = {
  row: STRUCTURE_HEIGHT - 1,
  column: STRUCTURE_WIDTH - 1,
};

export const computePlacementAfter = (
  previous: StructurePlacement,
  structure: Sector,
): StructurePlacement =>
  createPlacement(
    previous,
    structure,
    findMarker(previous.structure, STRUCTURE_END) ?? DEFAULT_END,
    findMarker(structure, STRUCTURE_START) ?? DEFAULT_START,
  );
