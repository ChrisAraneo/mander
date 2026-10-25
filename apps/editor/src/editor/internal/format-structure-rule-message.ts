import { STRUCTURE_WIDTH } from '@mander/structures';
import { match } from 'ts-pattern';
import { getHeight } from '../get-height';
import type { Pool } from '../types/pool';
import type { StructureRule } from '../types/structure-rule';

export const formatStructureRuleMessage = (
  rule: StructureRule,
  pool: Pool,
): string =>
  match(rule)
    .with(
      'SIZE',
      () => `both layers must be ${STRUCTURE_WIDTH} × ${getHeight(pool)} cells`,
    )
    .with(
      'KNOWN_TILES',
      () =>
        'every cell must be a tile the game knows, a start (98) or an end (99)',
    )
    .with(
      'BACK_LAYER',
      () =>
        'the back layer takes blocks alone — a hazard or a marker has nothing to do behind the level',
    )
    .with(
      'ONE_START',
      () => 'mark where the player enters with exactly one start (98)',
    )
    .with(
      'ONE_END',
      () => 'mark where the player leaves with exactly one end (99)',
    )
    .with(
      'ANCHORED_HAZARDS',
      () =>
        'a spike or beartrap needs a block below it, a ceiling or falling spike one above — a background block is not something to stand on',
    )
    .exhaustive();
