import type { BrushLayer } from './brush-layer';

export interface Brush {
  value: number;
  label: string;
  shortcut: string;
  group: string;
  layer: BrushLayer;
}
