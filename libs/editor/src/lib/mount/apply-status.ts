import type { ReachMap } from '@mander/engine';
import { type Structure, structureIssues } from '@mander/generator';
import { match } from 'ts-pattern';

import { createIssuesStatus } from '../html/create-issues-status';
import { createValidStatus } from '../html/create-valid-status';

export const applyStatus = (
  status: HTMLElement,
  grid: Structure,
  reach: ReachMap,
): void =>
  match(structureIssues(grid))
    .with([], () => {
      status.className = 'status ok';
      status.replaceChildren(...createValidStatus(grid, reach));
    })
    .otherwise((issues) => {
      status.className = 'status bad';
      status.replaceChildren(...createIssuesStatus(issues));
    });
