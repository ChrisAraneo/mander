export type FetchResponse = (
  input: string,
  init?: RequestInit,
) => Promise<Response>;
