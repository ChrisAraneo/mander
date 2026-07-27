export const writeClipboard = (output: HTMLTextAreaElement): Promise<void> =>
  Promise.resolve()
    .then(() => navigator.clipboard.writeText(output.value))
    .catch(() => {
      output.select();
      document.execCommand('copy');
    });
