export type $Fetch = (
  request: string | Request,
  options?: FetchOptions
) => Promise<Response>;

interface FetchOptions extends RequestInit {
  onRequest?(context: FetchContext): Promise<void> | void;
  onResponse?(context: FetchContext): Promise<void> | void;
}

interface FetchContext {
  request?: RequestInfo;
  options: FetchOptions;
  response?: Response;
}
const context: FetchContext = {
  request: undefined,
  options: {},
  response: undefined,
};

const $fetch: $Fetch = async (_request, _options = {}) => {
  context.request = _request;
  context.options = { ...context.options, ..._options };

  if (context.options?.onRequest) {
    await context.options?.onRequest(context);
  }
  context.response = await fetch(context.request, context.options);

  if (context.options?.onResponse) {
    await context.options?.onResponse(context);
  }

  return context.response;
};

export function createFetch(globalOptions: FetchOptions = {}) {
  context.options = globalOptions;
  return $fetch;
}
