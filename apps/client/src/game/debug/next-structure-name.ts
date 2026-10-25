import { STRUCTURE_CHOICES } from '@mander/generator';
import { findIndex, size } from 'lodash-es';
import { pipe } from 'remeda';

export const nextStructureName = (
  structureName: string,
  offset: number,
): string =>
  pipe(
    findIndex(STRUCTURE_CHOICES, (choice) => choice.name === structureName),
    (index) => index + offset,
    (moved) => (moved + size(STRUCTURE_CHOICES)) % size(STRUCTURE_CHOICES),
    (index) => STRUCTURE_CHOICES[index]?.name ?? structureName,
  );
