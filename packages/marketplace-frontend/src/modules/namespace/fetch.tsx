import React from 'react';

import { useLoggedApiRequest } from 'base/hooks/request';
import { useParams } from 'react-router-dom';
import Page from 'base/components/page';

function FetchNamespace(props: { children: Function; title?: string; namespaceId?: string }) {
  const { children, title, namespaceId: namespaceIdProp } = props;
  const { namespaceId = namespaceIdProp } = useParams();
  const [{ data: namespace, loading: loadingNamespace }] = useLoggedApiRequest(
    `/namespaces/${namespaceId}`
  );

  if (loadingNamespace) return null;

  if (!title) return children(namespace);

  return (
    <Page title={title} loading={loadingNamespace}>
      {!loadingNamespace && children(namespace)}
    </Page>
  );
}

export default FetchNamespace;
