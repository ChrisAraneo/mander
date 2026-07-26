import type { reachableFromEntry } from '../reachable-from-entry';

export type Surfaces = ReturnType<typeof reachableFromEntry>['surfaces'];
