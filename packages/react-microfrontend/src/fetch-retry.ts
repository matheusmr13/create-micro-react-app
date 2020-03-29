const LIMIT = 1;

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
const fetchRetry = async (url, { limit = LIMIT, delay, ...opts } = {}) => {
  let error;
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
