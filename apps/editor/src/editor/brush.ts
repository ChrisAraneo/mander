// which of a sector's two layers a brush paints into
export type BrushLayer = 'front' | 'back';

export interface Brush {
  value: number;
  label: string;
  shortcut: string;
  group: string;
  layer: BrushLayer;
}
