import { TOAST_DURATION } from '../config/constants';

export const showToast = (toast: HTMLElement, message: string): void => {
  toast.textContent = message;
  window.setTimeout(() => (toast.textContent = ''), TOAST_DURATION);
};
