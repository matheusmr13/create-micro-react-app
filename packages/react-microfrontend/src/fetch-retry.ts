const LIMIT = 1;

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

interface FetchRetryOptions {
  limit?: number,
  delay?: number | undefined,
  [x: string]: any
}

const fetchRetry = async (url: string, { limit = LIMIT, delay = undefined, ...opts }: FetchRetryOptions = {}) => {
  let error: Error;
  try {
    const response = await fetch(url, opts);
    const { status, statusText } = response;

    if (status >= 200 && status < 300) {
      return response.json();
    }

    error = new Error(statusText);
  } catch (_err) {
    error = _err;
  }

  const shouldRetry = limit > 0;
  if (!shouldRetry) throw error;

  if (delay) await sleep(delay);

  return await fetchRetry(url, { limit: limit - 1, delay, ...opts });
}

export default fetchRetry
