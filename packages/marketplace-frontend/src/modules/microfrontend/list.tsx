import React, { useEffect, useState } from 'react';
import { useLoggedApiRequest } from 'base/hooks/request';

import { Link } from 'react-router-dom';

import { Card, Button } from 'antd';
import Page from 'base/components/page';
import { List } from 'antd';

function MicrofrontendList() {
  const [{ data: microfrontends, loading, error }, refetch] = useLoggedApiRequest('/microfrontends', { manual: true });

  useEffect(() => {
    refetch();
  }, []);

  if (!microfrontends) return null;

  return (
    <Page title="Microfrontends">
      <List
        itemLayout="vertical"
        size="large"
        dataSource={microfrontends}
        renderItem={(microfrontend: any) => (
          <List.Item
            key={microfrontend.id}
            actions={
              [
                // <IconText icon={StarOutlined} text={repo.stargazers_count} key="list-vertical-star-o" />,
                // <IconText icon={MessageOutlined} text={repo.open_issues} key="list-vertical-message" />,
              ]
            }
            extra={<Link to={`./microfrontend/${microfrontend.id}`}>Edit</Link>}
          >
            <List.Item.Meta title={microfrontend.name} description={microfrontend.description} />
            {'asd'}
          </List.Item>
        )}
      />
    </Page>
  );
}

export default MicrofrontendList;
