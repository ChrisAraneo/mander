import { TILE_SIZE } from '../../tile/consts';
import { PRONG_PITCH, PRONG_WIDTH } from '../consts';

export const computeFirstProngLeft = (pixelX: number, prongs: number): number =>
  pixelX + (TILE_SIZE - ((prongs - 1) * PRONG_PITCH + PRONG_WIDTH)) / 2;
