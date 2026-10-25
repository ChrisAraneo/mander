import { filter, map } from 'lodash-es';
import { pipe } from 'remeda';
import type { Layer } from '../types/layer';
import { VERTICAL_RULES } from './internal/consts';
import { isVerticalRuleMet } from './internal/is-vertical-rule-met';

export const findVerticalIssues = (structure: Layer): string[] =>
  pipe(
    VERTICAL_RULES,
    (rules) =>
      filter(rules, (rule) => !isVerticalRuleMet(structure, rule.kind)),
    (rules) => map(rules, (rule) => rule.message),
  );
