import React from 'react';

import { useLoggedApiRequest } from 'base/hooks/request';
import { useParams } from 'react-router-dom';

import MicrofrontendForm from './form';

function MicrofrontendDetails() {
  let { microfrontendId } = useParams();
  const [{ data: microfrontend, loading, error }, refetch] = useLoggedApiRequest(`/microfrontends/${microfrontendId}`);

  if (loading) return <div>loading</div>;

  return <MicrofrontendForm microfrontend={microfrontend} />;
}

export default MicrofrontendDetails;
