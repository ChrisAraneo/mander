import { getWorldMeta, type World, type WorldMeta } from '@mander/model';
import { noop } from 'lodash-es';
import { match } from 'ts-pattern';
import { WORLD_META_LABEL } from './consts';
import { isDebug } from './is-debug';

export const logWorldMeta = (
  world: World,
  search: string,
  log: (label: string, meta: WorldMeta) => void,
): void =>
  match(isDebug(search))
    .with(true, () => log(WORLD_META_LABEL, getWorldMeta(world)))
    .otherwise(noop);
