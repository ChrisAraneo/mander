import { SECTOR_WIDTH, STRUCTURE_HEIGHT } from '@mander/generator';

import { CELL } from '../../constants';
import type { EditorView } from '../types/editor-view';

export const createEditorView = (): EditorView => ({
  pixelRatio: window.devicePixelRatio || 1,
  cssWidth: SECTOR_WIDTH * CELL,
  cssHeight: STRUCTURE_HEIGHT * CELL,
});
