import { times } from 'lodash-es';
import { match, P } from 'ts-pattern';
import type { PaddingRows } from './types/padding-rows';
import type { PaddingSky } from './types/padding-sky';

const { nullish } = P;

export const createPaddingBedrockRows = ({
  tiles,
  padding,
  floor,
  sky,
}: PaddingSky): PaddingRows => ({
  tiles,
  sky,
  bedrock: match(floor)
    .with(nullish, () => [])
    .otherwise((row) => times(padding.depth, () => [...row])),
});
