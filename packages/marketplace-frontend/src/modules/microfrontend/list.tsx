import React, { useEffect } from 'react';
import { useLoggedApiRequest } from 'base/hooks/request';

import { Link } from 'react-router-dom';

import Page from 'base/components/page';
import { List } from 'antd';

function MicrofrontendList() {
  const [{ data: microfrontends }, refetch] = useLoggedApiRequest('/microfrontends', { manual: true });

  useEffect(() => {
    refetch();
  }, [refetch]);

  if (!microfrontends) return null;

  return (
    <Page title="Microfrontends" rootPage>
      <List
        itemLayout="vertical"
        size="large"
        dataSource={microfrontends}
        renderItem={(microfrontend: any) => (
          <List.Item
            key={microfrontend.id}
            extra={<Link to={`./microfrontend/${microfrontend.id}`}>Edit</Link>}
          >
            <List.Item.Meta title={microfrontend.name} description={microfrontend.description} />
          </List.Item>
        )}
      />
    </Page>
  );
}

export default MicrofrontendList;
