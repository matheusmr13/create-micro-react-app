import React from 'react';

import { useLoggedApiRequest } from 'base/hooks/request';
import { useParams } from 'react-router-dom';

import VersionForm from './form';

function VersionDetails() {
  let { versionId } = useParams();
  const [{ data: version, loading, error }, refetch] = useLoggedApiRequest(`/versions/${versionId}`);

  if (loading) return <div>loading</div>;

  return <VersionForm version={version} />;
}

export default VersionDetails;
