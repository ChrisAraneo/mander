import { STRUCTURE_CHOICES } from '@mander/generator';
import { find, head } from 'lodash-es';

const NO_STRUCTURE = '';

export const findStructureName = (structureName: string | null): string =>
  find(STRUCTURE_CHOICES, (choice) => choice.name === structureName)?.name ??
  head(STRUCTURE_CHOICES)?.name ??
  NO_STRUCTURE;
