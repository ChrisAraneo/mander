export type BrushLayer = 'front' | 'back';

export interface Brush {
  value: number;
  label: string;
  shortcut: string;
  group: string;
  layer: BrushLayer;
}
