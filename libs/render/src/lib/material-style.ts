export interface MaterialStyle {
  /** Fill for the body of the tile. */
  base: string;
  /** Band along the top of a tile whose surface is exposed — grass on dirt. */
  cap: string;
  /** Brighter sliver at the very top of the cap. */
  capHighlight: string;
  /** Recessed detail: mortar joints, plank seams, stone pits. */
  joint: string;
  /** Raised detail, catching the light. */
  highlight: string;
}
