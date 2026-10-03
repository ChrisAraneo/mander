import { map } from 'lodash-es';
import type { createBedrockRows } from './create-bedrock-rows';

export const stackPaddingRows = ({
  tiles,
  sky,
  bedrock,
}: ReturnType<typeof createBedrockRows>) => [
  ...sky,
  ...map(tiles, (row) => [...row]),
  ...bedrock,
];
