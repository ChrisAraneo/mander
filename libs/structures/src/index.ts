export { getAlias } from './lib/aliases/get-alias';
export { parseAlias } from './lib/aliases/parse-alias';
export {
  STRUCTURE_END,
  STRUCTURE_HEIGHT,
  STRUCTURE_START,
  STRUCTURE_WIDTH,
} from './lib/consts';
export { getBack } from './lib/get-back';
export { getFront } from './lib/get-front';
export { getStructureName } from './lib/get-structure-name';
export {
  HARD_LIBRARY,
  HARD_STRUCTURES,
  NORMAL_LIBRARY,
  NORMAL_STRUCTURES,
  VERTICAL_LIBRARY,
  VERTICAL_STRUCTURES,
} from './lib/library';
export type { Layer } from './lib/types/layer';
export type { Sector } from './lib/types/sector';
export type { Structure } from './lib/types/structure';
export type { VerticalStructure } from './lib/types/vertical-structure';
export {
  VERTICAL_ARRIVAL_ROWS,
  VERTICAL_BAND_HEIGHT,
  VERTICAL_END_ROW,
  VERTICAL_HEIGHT,
  VERTICAL_IGNORED_ROWS,
  VERTICAL_LAUNCH_ROW,
  VERTICAL_MARKER_COLUMN,
  VERTICAL_PLATFORM_COLUMNS,
  VERTICAL_START_ROW,
} from './lib/vertical-shape/consts';
export { validateVerticalShape } from './lib/vertical-shape/validate-vertical-shape';
