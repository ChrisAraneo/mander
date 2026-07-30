import { cellMaterial, isBlockCell } from '@mander/generator';
import { materialStyle } from '@mander/model';

/**
 * Inline style for a block cell, read from the same material colours the game
 * renders with, so the editor and the client cannot drift apart.
 */
export const cellStyle = (value: number): Record<string, string> => {
  if (!isBlockCell(value)) return {};

  const style = materialStyle(cellMaterial(value));
  return {
    background: style.base,
    boxShadow: `inset 0 3px 0 ${style.cap}, inset 0 1px 0 ${style.capHighlight}`,
  };
};
