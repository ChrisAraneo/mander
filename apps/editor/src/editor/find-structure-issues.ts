import type { Layers } from '@mander/model';
import { concat, filter, map } from 'lodash-es';
import { pipe } from 'remeda';
import { findPoolIssues } from './internal/find-pool-issues';
import { formatStructureRuleMessage } from './internal/format-structure-rule-message';
import { isStructureRuleMet } from './internal/is-structure-rule-met';
import type { Pool } from './types/pool';
import type { StructureRule } from './types/structure-rule';

const RULES: readonly StructureRule[] = [
  'SIZE',
  'KNOWN_TILES',
  'BACK_LAYER',
  'ONE_START',
  'ONE_END',
  'ANCHORED_HAZARDS',
];

export const findStructureIssues = (sketch: Layers, pool: Pool): string[] =>
  pipe(
    RULES,
    (rules) => filter(rules, (rule) => !isStructureRuleMet(sketch, pool, rule)),
    (broken) => map(broken, (rule) => formatStructureRuleMessage(rule, pool)),
    (messages) => concat(messages, findPoolIssues(sketch, pool)),
  );
