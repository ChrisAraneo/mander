import { toNumber } from 'lodash-es';

export const toFlag = (isOn: boolean): number => toNumber(isOn);
