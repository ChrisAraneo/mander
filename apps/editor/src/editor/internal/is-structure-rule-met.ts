import type { Layers } from '@mander/model';
import { STRUCTURE_END, STRUCTURE_START } from '@mander/structures';
import { every } from 'lodash-es';
import { match } from 'ts-pattern';
import type { Pool } from '../types/pool';
import type { StructureRule } from '../types/structure-rule';
import { canBeBehind } from './can-be-behind';
import { countTile } from './count-tile';
import { hasAllHazardsAnchored } from './has-all-hazards-anchored';
import { isKnown } from './is-known';
import { isSketchCut } from './is-sketch-cut';

export const isStructureRuleMet = (
  sketch: Layers,
  pool: Pool,
  rule: StructureRule,
): boolean =>
  match(rule)
    .with('SIZE', () => isSketchCut(sketch, pool))
    .with('KNOWN_TILES', () =>
      every(sketch.tiles, (row) => every(row, isKnown)),
    )
    .with('BACK_LAYER', () =>
      every(sketch.backTiles, (row) => every(row, canBeBehind)),
    )
    .with('ONE_START', () => countTile(sketch.tiles, STRUCTURE_START) === 1)
    .with('ONE_END', () => countTile(sketch.tiles, STRUCTURE_END) === 1)
    .with('ANCHORED_HAZARDS', () => hasAllHazardsAnchored(sketch.tiles))
    .exhaustive();
