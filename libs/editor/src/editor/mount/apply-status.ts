import { type Structure, structureIssues } from '@mander/generator';
import { match } from 'ts-pattern';

import { createIssuesStatus } from '../html/create-issues-status';
import { createValidStatus } from '../html/create-valid-status';

export const applyStatus = (status: HTMLElement, grid: Structure): void =>
  match(structureIssues(grid))
    .with([], () => {
      status.className = 'status ok';
      status.replaceChildren(...createValidStatus(grid));
    })
    .otherwise((issues) => {
      status.className = 'status bad';
      status.replaceChildren(...createIssuesStatus(issues));
    });
