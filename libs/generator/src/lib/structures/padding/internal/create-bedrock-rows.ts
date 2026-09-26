import { times } from 'lodash-es';
import { match, P } from 'ts-pattern';
import type { createSkyRows } from './create-sky-rows';

const { nullish } = P;

export const createBedrockRows = ({
  tiles,
  padding,
  floor,
  sky,
}: ReturnType<typeof createSkyRows>) => ({
  tiles,
  sky,
  bedrock: match(floor)
    .with(nullish, () => [])
    .otherwise((row) => times(padding.depth, () => [...row])),
});
