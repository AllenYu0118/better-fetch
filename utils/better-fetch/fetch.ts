export interface $Fetch {
  (request: string | Request, options?: FetchOptions): Promise<unknown>;
}

export type $FetchRaw = (
  request: RequestInfo,
  options?: FetchOptions
) => Promise<FetchResponse>;

interface FetchOptions extends RequestInit {
  retry?: number | false;
  timeout?: number;
  onRequest?(context: FetchContext): Promise<void> | void;
  onResponse?(context: FetchContext): Promise<void> | void;
}

interface FetchResponse extends Response {
  _data?: unknown;
}

interface FetchContext {
  request: RequestInfo;
  options: FetchOptions;
  response?: FetchResponse;
  error?: Error;
}
const context: FetchContext = {
  request: '',
  options: {},
  response: undefined,
};

const $fetchRaw: $FetchRaw = async (_request, _options = {}) => {
  context.request = _request;
  context.options = { ...context.options, ..._options };

  if (context.options?.onRequest) {
    await context.options?.onRequest(context);
  }

  // 超时取消请求
  if (!context.options.signal && context.options.timeout) {
    const abortController = new AbortController();

    setTimeout(() => abortController.abort(), context.options.timeout);

    context.options.signal = abortController.signal;
  }

  try {
    context.response = await fetch(context.request, context.options);
  } catch (error) {
    context.error = error as Error;

    return await onError(context);
  }

  if (context.options?.onResponse) {
    await context.options?.onResponse(context);
  }

  const response = context.response.clone();
  const responseType = context.response.headers.get('content-type');

  switch (responseType?.split(';').shift()) {
    case 'text/plain':
    case 'text/html':
      context.response._data = await response.text();
      break;

    case 'application/json':
      context.response._data = await response.json();
      break;

    default:
      context.response._data = await response.blob();
  }

  return context.response;
};

export function createFetch(globalOptions: FetchOptions = {}) {
  context.options = globalOptions;

  const $fetch: $Fetch = async function $fetch(request, _options) {
    const r = await $fetchRaw(request, _options);
    return r._data;
  };
  return $fetch;
}

async function onError(context: FetchContext): Promise<FetchResponse> {
  const isAbort =
    (context.error?.name === 'AbortError' && !context.options.timeout) || false;

  if (context.options.retry !== false && !isAbort) {
    let retries;

    if (typeof context.options.retry === 'number') {
      retries = context.options.retry;
    } else {
      retries = 1;
    }

    if (retries > 0) {
      return $fetchRaw(context.request, {
        ...context.options,
        retry: retries - 1,
      });
    }
  }

  throw context.error;
}
