import {
  createStructureWorld,
  createWorld,
  STRUCTURE_CHOICES,
} from '@mander/generator';
import type { RenderedWorld } from '@mander/render';
import { find } from 'lodash-es';
import { match, P } from 'ts-pattern';

const { nullish } = P;

export const createRunWorld = (
  day: string,
  structureName: string | null,
): RenderedWorld =>
  match(find(STRUCTURE_CHOICES, (choice) => choice.name === structureName))
    .with(nullish, () => createWorld(new Date(day)))
    .otherwise(createStructureWorld);
