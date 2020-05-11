import { Method, AxiosRequestConfig } from 'axios';
import { useLoggedApiRequest } from './request';
import { message } from 'antd';

type MessageBuilder = (...args: any[]) => string;

const useApiAction = (
  url: string,
  options: {
    method?: Method;
    message?: {
      success?: MessageBuilder | string;
      loading?: MessageBuilder | string;
      error?: MessageBuilder | string;
    };
  }
): [any, Function] => {
  const key = Math.ceil(Math.random() * 10000).toString();
  const { method = 'POST' } = options;
  const [{ data, loading, error }, makeRequest] = useLoggedApiRequest({ url, method }, { manual: true });

  const showMessage = (type: 'loading' | 'success' | 'error', messageOptions?: { params: any[]; default: string }) => {
    if (options.message && options.message[type]) {
      const messageContructor = options.message[type];
      let content = '';
      if (typeof messageContructor === 'string') {
        content = messageContructor;
      } else if (typeof messageContructor === 'function') {
        content = messageContructor.apply(null, messageOptions?.params || []);
      }

      message[type]({ content, key });
    } else if (messageOptions?.default) {
      message[type]({ content: messageOptions.default, key });
    }
  };

  const execute = async (config?: AxiosRequestConfig) => {
    showMessage('loading');
    try {
      await makeRequest(config);
      showMessage('success');
    } catch ({ response }) {
      console.info(`Error on request ${method} to ${url}`, response);
      showMessage('error', {
        default: response.status >= 500 ? 'Server error. Try again later!' : 'Error processing your request.',
        params: [response],
      });
    }
  };

  return [{ data, loading, error }, execute];
};

export default useApiAction;
