import { getWorldMeta, type World } from '@mander/model';
import { noop } from 'lodash-es';
import { match } from 'ts-pattern';

import { WORLD_META_LABEL } from './consts';
import { isDebug } from './is-debug';

export const logWorldMeta = (world: World): void =>
  match(isDebug())
    .with(true, () => console.log(WORLD_META_LABEL, getWorldMeta(world)))
    .otherwise(noop);
