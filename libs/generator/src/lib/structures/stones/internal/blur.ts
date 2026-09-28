import { blurColumns } from './blur-columns';
import { blurRows } from './blur-rows';
import type { Field } from './field';

export const blur = (field: Field): Field => blurColumns(blurRows(field));
