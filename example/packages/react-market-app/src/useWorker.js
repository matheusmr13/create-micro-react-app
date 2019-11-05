import { useState, useEffect } from 'react';

function useMessageWorker(worker, callback) {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const handleError= (error) => {
      console.log({ error })
    }
    
    const handleMessage = (messy) => {
      console.log({ messy })

      setMessage(messy);
    }

    worker.onMessage(handleMessage, handleError);

    return () => {
      if (worker) {
        worker.terminate();
      }
    }
  }, [worker]);

  return {
    message
  };
};

export default useMessageWorker;