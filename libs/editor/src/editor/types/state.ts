import type { Structure } from '@mander/generator';

import type { EditorView } from './editor-view';

export interface State {
  grid: Structure;
  tool: number;
  isPainting: boolean;
  paintValue: number;
  view: EditorView;
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
  status: HTMLDivElement;
  output: HTMLTextAreaElement;
  loader: HTMLTextAreaElement;
  toast: HTMLDivElement;
}
