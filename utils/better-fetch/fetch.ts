export type $Fetch = (
  request: string | Request,
  options?: RequestInit
) => Promise<Response>;

interface Context {
  request: RequestInfo | undefined;
  options: RequestInit;
}
const context: Context = {
  request: undefined,
  options: {},
};

const $fetch: $Fetch = async (_request, _options = {}) => {
  context.request = _request;
  context.options = { ...context.options, ..._options };
  return await fetch(context.request, context.options);
};

export function createFetch(globalOptions: RequestInit = {}) {
  context.options = globalOptions;
  return $fetch;
}
