import type { Tile } from '@mander/model';
import { map } from 'lodash-es';
import type { PaddingRows } from './types/padding-rows';

export const addPaddingRows = ({
  tiles,
  sky,
  bedrock,
}: PaddingRows): Tile[][] => [
  ...sky,
  ...map(tiles, (row) => [...row]),
  ...bedrock,
];
