import React from 'react';

import { useLoggedApiRequest } from 'base/hooks/request';
import { useParams } from 'react-router-dom';
import Page from 'base/components/page';

function FetchApplication(props: { children: Function; title: string; applicationId?: string }) {
  const { children, title, applicationId: applicationIdProp } = props;
  const { applicationId = applicationIdProp } = useParams();
  const [{ data: application, loading: loadingApplication, error }] = useLoggedApiRequest(
    `/applications/${applicationId}`
  );

  return (
    <Page title={title} loading={loadingApplication}>
      {!loadingApplication && children(application)}
    </Page>
  );
}

export default FetchApplication;
